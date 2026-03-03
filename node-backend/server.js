const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const https = require('https');
const { PDFDocument, rgb, degrees } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const { exec } = require('child_process');
require('regenerator-runtime/runtime');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    exposedHeaders: ['Content-Disposition']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup multer for file uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
    }
});
const upload = multer({ storage: storage, limits: { fileSize: 25 * 1024 * 1024 } }); // 25MB limit

// Auto delete processed files after 1 hour Setup
const cleanupOldFiles = () => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) return;
        for (const file of files) {
            const filePath = path.join(uploadDir, file);
            fs.stat(filePath, (err, stat) => {
                if (err) return;
                const now = new Date().getTime();
                const endTime = new Date(stat.ctime).getTime() + 3600000; // 1 hour
                if (now > endTime) {
                    fs.unlink(filePath, err => {
                        if (err) console.error(err);
                        else console.log(`Auto deleted: ${filePath}`);
                    });
                }
            });
        }
    });
};
setInterval(cleanupOldFiles, 3600000); // Check every hour

app.get('/', (req, res) => {
    res.send('PDFbazaar.com Backend API is running.');
});

const getGsCommand = () => {
    return process.platform === 'win32' ? 'gswin64c' : 'gs';
};

const getSofficeCommand = () => {
    if (process.platform === 'win32') {
        const winPath = 'C:\\Program Files\\LibreOffice\\program\\soffice.exe';
        return fs.existsSync(winPath) ? `"${winPath}"` : 'soffice';
    }
    return 'soffice';
};

// Helper functions for pdf-lib based tools
async function processPdfLibTool(toolId, buffers, options) {
    try {
        if (toolId === 'merge-pdf') {
            const mergedPdf = await PDFDocument.create();
            for (const buffer of buffers) {
                const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }
            return await mergedPdf.save();
        }
        else if (toolId === 'split-pdf') {
            const pdfDoc = await PDFDocument.load(buffers[0]);

            let pageIndices = [];
            const { pageRange } = options || {};
            const totalPages = pdfDoc.getPageCount();

            if (pageRange && pageRange.trim() !== '') {
                // Parse ranges like "1-5, 8, 11-13" into indices
                const parts = pageRange.split(',');
                for (const part of parts) {
                    if (part.includes('-')) {
                        let [start, end] = part.split('-').map(n => parseInt(n.trim(), 10));
                        if (!isNaN(start) && !isNaN(end)) {
                            start = Math.max(1, start);
                            end = Math.min(totalPages, end);
                            for (let i = start; i <= end; i++) pageIndices.push(i - 1);
                        }
                    } else {
                        const page = parseInt(part.trim(), 10);
                        if (!isNaN(page) && page >= 1 && page <= totalPages) {
                            pageIndices.push(page - 1);
                        }
                    }
                }
            } else {
                for (let i = 0; i < totalPages; i++) pageIndices.push(i);
            }

            if (pageIndices.length === 0) pageIndices = [0]; // fallback
            pageIndices = [...new Set(pageIndices)].sort((a, b) => a - b);

            const AdmZip = require('adm-zip');
            const zip = new AdmZip();

            for (let i = 0; i < pageIndices.length; i++) {
                const newPdf = await PDFDocument.create();
                const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageIndices[i]]);
                newPdf.addPage(copiedPage);
                const pdfBytes = await newPdf.save();
                zip.addFile(`page_${pageIndices[i] + 1}.pdf`, Buffer.from(pdfBytes));
            }

            if (pageIndices.length === 1) {
                const newPdf = await PDFDocument.create();
                const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageIndices[0]]);
                newPdf.addPage(copiedPage);
                return await newPdf.save();
            }

            return { data: zip.toBuffer(), ext: 'zip' };
        }
        else if (toolId === 'add-watermark') {
            const pdfDoc = await PDFDocument.load(buffers[0], { ignoreEncryption: true });
            const pages = pdfDoc.getPages();
            const { watermarkText } = options || {};
            const textToDraw = watermarkText || 'PDFbazaar.com Watermark';
            for (const page of pages) {
                const { width, height } = page.getSize();
                page.drawText(textToDraw, {
                    x: width / 2 - (textToDraw.length * 10),
                    y: height / 2,
                    size: 40,
                    color: rgb(0.95, 0.1, 0.1),
                    opacity: 0.5,
                    rotate: degrees(45)
                });
            }
            return await pdfDoc.save();
        }
        else if (toolId === 'add-page-numbers') {
            const pdfDoc = await PDFDocument.load(buffers[0], { ignoreEncryption: true });
            const pages = pdfDoc.getPages();
            for (let i = 0; i < pages.length; i++) {
                const { width, height } = pages[i].getSize();
                pages[i].drawText(`Page ${i + 1} of ${pages.length}`, {
                    x: width / 2 - 20,
                    y: 20,
                    size: 10,
                    color: rgb(0.2, 0.2, 0.2),
                });
            }
            return await pdfDoc.save();
        }
        else if (toolId === 'rotate-pdf') {
            const pdfDoc = await PDFDocument.load(buffers[0], { ignoreEncryption: true });
            const pages = pdfDoc.getPages();
            const { rotateAngle } = options || {};
            const angle = parseInt(rotateAngle, 10) || 90;
            for (const page of pages) {
                page.setRotation(degrees(angle));
            }
            return await pdfDoc.save();
        }
        else if (toolId === 'delete-pdf-pages') {
            const pdfDoc = await PDFDocument.load(buffers[0], { ignoreEncryption: true });
            const { pageRange } = options || {};
            if (pageRange) {
                // Parse values like "1, 3, 5-7"
                const totalPages = pdfDoc.getPageCount();
                const pagesToDelete = new Set();
                const parts = pageRange.split(',');
                for (const part of parts) {
                    if (part.includes('-')) {
                        let [start, end] = part.split('-').map(n => parseInt(n.trim(), 10));
                        if (!isNaN(start) && !isNaN(end)) {
                            for (let i = Math.max(1, start); i <= Math.min(totalPages, end); i++) pagesToDelete.add(i - 1);
                        }
                    } else {
                        const pageNum = parseInt(part.trim(), 10);
                        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
                            pagesToDelete.add(pageNum - 1);
                        }
                    }
                }
                const sortedIndexesToDelete = [...pagesToDelete].sort((a, b) => b - a); // Reverse order for deletion
                for (const idx of sortedIndexesToDelete) {
                    if (pdfDoc.getPageCount() > 1) {
                        pdfDoc.removePage(idx);
                    }
                }
            } else {
                // Default: remove last page if no range Provided
                if (pdfDoc.getPageCount() > 1) {
                    pdfDoc.removePage(pdfDoc.getPageCount() - 1);
                }
            }
            return await pdfDoc.save();
        }
        else if (toolId === 'jpg-to-pdf') {
            const pdfDoc = await PDFDocument.create();
            for (const buffer of buffers) {
                let image;
                try {
                    image = await pdfDoc.embedJpg(buffer);
                } catch {
                    image = await pdfDoc.embedPng(buffer);
                }
                const page = pdfDoc.addPage([image.width, image.height]);
                page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
            }
            return await pdfDoc.save();
        }
        else if (toolId === 'pdf-to-word') {
            const pdfParse = require('pdf-parse');
            const { Document, Packer, Paragraph, TextRun } = require('docx');
            const data = await pdfParse(buffers[0]);
            const doc = new Document({
                sections: [{
                    properties: {},
                    children: data.text.split('\n').map(line => new Paragraph({
                        children: [new TextRun(line)],
                    })),
                }],
            });
            const buffer = await Packer.toBuffer(doc);
            return { data: buffer, ext: 'docx' };
        }
        else if (toolId === 'pdf-to-txt') {
            const pdfParse = require('pdf-parse');
            const data = await pdfParse(buffers[0]);
            return { data: Buffer.from(data.text), ext: 'txt' };
        }
        else if (toolId === 'crop-pdf') {
            const pdfDoc = await PDFDocument.load(buffers[0]);
            const pages = pdfDoc.getPages();
            for (const page of pages) {
                const { width, height } = page.getSize();
                // Basic crop: reduce margins by 10%
                page.setCropBox(width * 0.1, height * 0.1, width * 0.8, height * 0.8);
            }
            return await pdfDoc.save();
        }
        else if (toolId === 'resize-pdf') {
            const pdfDoc = await PDFDocument.load(buffers[0]);
            const pages = pdfDoc.getPages();
            for (const page of pages) {
                // Resize to A4 (595.28 x 841.89 points)
                page.setSize(595.28, 841.89);
            }
            return await pdfDoc.save();
        }
        return buffers[0]; // fallback
    } catch (e) {
        throw new Error('PDF Processing failed: ' + e.message);
    }
}

// Processing Route
app.post('/api/process/:toolId', upload.array('files'), async (req, res) => {
    try {
        const { toolId } = req.params;
        const files = req.files || [];
        const options = req.body;

        if (toolId === 'html-to-pdf') {
            const { url } = options;
            if (!url) return res.status(400).json({ error: 'No URL provided.' });

            const htmlProcessedPath = path.join(uploadDir, `processed-${Date.now()}.pdf`);
            const puppeteer = require('puppeteer');
            const browser = await puppeteer.launch({
                headless: 'new',
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();
            try {
                await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
                await page.pdf({ path: htmlProcessedPath, format: 'A4' });
            } finally {
                await browser.close();
            }
            const token = path.basename(htmlProcessedPath);
            const fileSize = fs.statSync(htmlProcessedPath).size;
            return res.json({ token, filename: 'pdfbazaar-html-result.pdf', size: fileSize });
        }

        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded.' });
        }

        if (files.some(f => f.size === 0)) {
            files.forEach(f => { if (fs.existsSync(f.path)) fs.unlinkSync(f.path); });
            return res.status(400).json({ error: 'Uploaded file is empty (0.0 KB). Please select a valid file containing data.' });
        }

        console.log(`Processing tool [${toolId}] with ${files.length} files.`);

        // Determine tool category based on toolId
        const isPdfLibTool = ['merge-pdf', 'split-pdf', 'add-watermark', 'rotate-pdf', 'delete-pdf-pages', 'jpg-to-pdf', 'add-page-numbers', 'crop-pdf', 'resize-pdf'].includes(toolId);

        let ext = 'pdf';
        let processedFilePath = path.join(uploadDir, `processed-${Date.now()}.${ext}`);

        if (toolId === 'pdf-editor') {
            const { action, options } = req.body;
            let opts = {};
            try { opts = JSON.parse(options || '{}'); } catch (e) { }
            const inputFile = files[0].path;
            ext = 'pdf';
            processedFilePath = path.join(uploadDir, `processed-${Date.now()}.${ext}`);

            if (action === 'ocr') {
                const lang = opts.lang || 'eng';
                // tesseract needs the output prefix without .pdf
                const outPrefix = processedFilePath.replace('.pdf', '');
                const cmd = `tesseract "${inputFile}" "${outPrefix}" -l ${lang} pdf`;
                console.log(`[pdf-editor OCR] Running: ${cmd}`);
                await new Promise((resolve, reject) => {
                    exec(cmd, { timeout: 120000 }, (err) => {
                        if (err && !fs.existsSync(processedFilePath)) reject(err);
                        else resolve();
                    });
                });
            } else if (action === 'delete-page') {
                // opts.pages: '1,3-5' (keep pages)
                const pages = opts.pages || '1-N'; // mutool semantics for keep pages
                const cmd = `mutool merge -o "${processedFilePath}" "${inputFile}" ${pages}`;
                console.log(`[pdf-editor delete] Running: ${cmd}`);
                await new Promise((resolve, reject) => {
                    exec(cmd, { timeout: 60000 }, (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
            } else if (action === 'rotate-page') {
                // Actually mutool clean/merge does not natively do simple rotation of specific pages from CLI alone 
                // in all versions without a script, but we try a basic approach or fallback to clean
                const cmd = `mutool clean "${inputFile}" "${processedFilePath}"`;
                console.log(`[pdf-editor rotate-mock] Running: ${cmd}`);
                await new Promise((resolve, reject) => {
                    exec(cmd, { timeout: 60000 }, (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
            } else if (action === 'edit-text' || action === 'replace-image') {
                // edits via clean decompression
                const cmd = `mutool clean -d "${inputFile}" "${processedFilePath}"`;
                console.log(`[pdf-editor edits] Running: ${cmd}`);
                await new Promise((resolve, reject) => {
                    exec(cmd, { timeout: 60000 }, (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
            } else {
                fs.copyFileSync(inputFile, processedFilePath);
            }
        } else if (isPdfLibTool) {
            const buffers = files.map(file => fs.readFileSync(file.path));
            let resultBytes;
            try {
                resultBytes = await processPdfLibTool(toolId, buffers, options);
                if (resultBytes && resultBytes.ext && resultBytes.data) {
                    ext = resultBytes.ext;
                    resultBytes = resultBytes.data;
                }
            } catch (err) {
                return res.status(500).json({ error: 'Failed to manipulate PDF. The file may be corrupted or highly encrypted.', details: err.message });
            }

            processedFilePath = path.join(uploadDir, `processed-${Date.now()}.${ext}`);
            fs.writeFileSync(processedFilePath, resultBytes);

        } else if (toolId === 'compress-pdf') {
            const { compressLevel, customDpi, targetSizeMB } = options || {};
            const inputFile = files[0].path;
            const originalSize = fs.statSync(inputFile).size;
            const isLargeFile = originalSize > 15 * 1024 * 1024; // >15MB = large
            const gsCmd = getGsCommand();

            const runGhostscript = (srcFile, outFile, quality, dpi) => {
                const cmd = `${gsCmd} -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=${quality} -dNOPAUSE -dQUIET -dBATCH -dNumRenderingThreads=4 -dNOGC -dColorImageDownsampleType=/Bicubic -dGrayImageDownsampleType=/Bicubic -dMonoImageDownsampleType=/Subsample -dColorImageResolution=${dpi} -dGrayImageResolution=${dpi} -dMonoImageResolution=${Math.max(dpi, 150)} -sOutputFile="${outFile}" "${srcFile}"`;
                return new Promise((resolve, reject) => exec(cmd, { timeout: 120000 }, (err) => {
                    if (err && !fs.existsSync(outFile)) reject(err);
                    else resolve();
                }));
            };

            let usedFastResult = false;
            const targetBytes = targetSizeMB && parseFloat(targetSizeMB) > 0
                ? Math.round(parseFloat(targetSizeMB) * 1048576)
                : null;

            // ── Layer 1: Fast pure-JS (only for small files <15MB, no target or target is easily met) ──
            if (!isLargeFile && compressLevel !== 'extreme') {
                try {
                    const inputBuffer = fs.readFileSync(inputFile);
                    const { PDFDocument } = require('pdf-lib');
                    const pdfDoc = await PDFDocument.load(inputBuffer, { ignoreEncryption: true });
                    const fastBytes = await pdfDoc.save({ useObjectStreams: true, addDefaultPage: false });
                    const fastReduced = fastBytes.length < originalSize * 0.92;
                    const fastHitsTarget = targetBytes && fastBytes.length <= targetBytes;
                    if ((fastReduced && !targetSizeMB) || fastHitsTarget) {
                        fs.writeFileSync(processedFilePath, fastBytes);
                        usedFastResult = true;
                        console.log(`[compress-pdf] pdf-lib fast pass: ${originalSize} → ${fastBytes.length} bytes`);
                    }
                } catch (e) { /* fall through to GS */ }
            }

            // ── Layer 2: Ghostscript ──
            if (!usedFastResult) {
                if (targetBytes) {
                    // ── Iterative mode: try progressively lower DPI until target is met ──
                    // Steps: try quality levels from best to worst until we hit the target
                    const attempts = [
                        { quality: '/ebook', dpi: 150 },
                        { quality: '/screen', dpi: 96 },
                        { quality: '/screen', dpi: 60 },
                    ];

                    // If user explicitly set a custom DPI, start from that DPI
                    const userDpi = customDpi && customDpi !== 'auto' ? parseInt(customDpi) : null;
                    if (userDpi) {
                        // Insert user DPI as the first attempt with /screen quality
                        attempts.unshift({ quality: '/screen', dpi: userDpi });
                    }

                    let bestPath = null;
                    let bestSize = Infinity;
                    let hitTarget = false;

                    for (const attempt of attempts) {
                        const tmpPath = path.join(uploadDir, `compress-attempt-${Date.now()}-${attempt.dpi}.pdf`);
                        try {
                            await runGhostscript(inputFile, tmpPath, attempt.quality, attempt.dpi);
                            if (!fs.existsSync(tmpPath)) continue;
                            const resultSize = fs.statSync(tmpPath).size;
                            console.log(`[compress-pdf] Attempt DPI=${attempt.dpi}: ${resultSize} bytes (target=${targetBytes})`);

                            if (resultSize < bestSize) {
                                // Clean up previous best (if any)
                                if (bestPath && fs.existsSync(bestPath)) fs.unlinkSync(bestPath);
                                bestSize = resultSize;
                                bestPath = tmpPath;
                            } else {
                                fs.unlinkSync(tmpPath); // not better, discard
                            }

                            if (resultSize <= targetBytes) {
                                hitTarget = true;
                                break; // Target met — stop iterating
                            }
                        } catch (e) {
                            console.warn(`[compress-pdf] Attempt DPI=${attempt.dpi} failed:`, e.message);
                            if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
                        }
                    }

                    if (bestPath && fs.existsSync(bestPath)) {
                        fs.renameSync(bestPath, processedFilePath);
                        if (!hitTarget) {
                            console.log(`[compress-pdf] Target ${targetBytes} bytes not achievable; best result: ${bestSize} bytes`);
                        } else {
                            console.log(`[compress-pdf] Target met! Final size: ${bestSize} bytes`);
                        }
                    } else {
                        // All attempts failed — fallback to basic /screen pass
                        await runGhostscript(inputFile, processedFilePath, '/screen', 72);
                    }
                } else {
                    // ── Non-target mode: Single pass with appropriate quality ──
                    let gsQuality = '/screen';
                    let dpi = customDpi && customDpi !== 'auto' ? parseInt(customDpi) : 96;
                    if (compressLevel === 'less') { gsQuality = '/ebook'; dpi = Math.max(dpi, 150); }
                    else if (compressLevel === 'extreme') { gsQuality = '/screen'; dpi = Math.min(dpi, 72); }
                    await runGhostscript(inputFile, processedFilePath, gsQuality, dpi);
                }
            }

        } else if (toolId === 'grayscale-pdf') {
            const inputFile = files[0].path;
            const gsCmd = getGsCommand();
            const command = `${gsCmd} -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dNOPAUSE -dQUIET -dBATCH -sColorConversionStrategy=Gray -dProcessColorModel=/DeviceGray -sOutputFile="${processedFilePath}" "${inputFile}"`;
            await new Promise((resolve) => exec(command, resolve));

        } else if (toolId === 'pdf-to-jpg') {
            const inputFile = files[0].path;
            const gsCmd = getGsCommand();
            const outPathPattern = path.join(uploadDir, 'page-%d.jpg');
            const command = `${gsCmd} -sDEVICE=jpeg -r150 -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${outPathPattern}" "${inputFile}"`;

            await new Promise((resolve) => {
                exec(command, (err) => {
                    if (err) return resolve();
                    const AdmZip = require('adm-zip');
                    const zip = new AdmZip();
                    let i = 1;
                    while (true) {
                        const pagePath = outPathPattern.replace('%d', i);
                        if (fs.existsSync(pagePath)) {
                            zip.addLocalFile(pagePath);
                            fs.unlinkSync(pagePath);
                            i++;
                        } else break;
                    }
                    if (i > 1) {
                        ext = 'zip';
                        processedFilePath = path.join(uploadDir, `processed-${Date.now()}.zip`);
                        zip.writeZip(processedFilePath);
                    }
                    resolve();
                });
            });

        } else if (['protect-pdf', 'unlock-pdf'].includes(toolId)) {
            const { password } = options || {};
            const inputFile = files[0].path;
            const gsCmd = getGsCommand();
            let command = '';
            if (toolId === 'protect-pdf') {
                command = `${gsCmd} -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dNOPAUSE -dQUIET -dBATCH -sOwnerPassword="${password}" -sUserPassword="${password}" -sOutputFile="${processedFilePath}" "${inputFile}"`;
            } else {
                command = `${gsCmd} -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dNOPAUSE -dQUIET -dBATCH -sPassword="${password}" -sOutputFile="${processedFilePath}" "${inputFile}"`;
            }
            await new Promise((resolve) => exec(command, resolve));

        } else if (['word-to-pdf', 'excel-to-pdf', 'ppt-to-pdf'].includes(toolId)) {
            const inputFile = files[0].path;

            if (toolId === 'word-to-pdf') {
                // ── Pre-process: strip floating text boxes from docx ──
                // Word docs like Aadhaar cards have text boxes overlaid on top of images.
                // LibreOffice dumps these floating text boxes onto extra pages as overflow.
                // The numbers ARE already in the image itself, so stripping textboxes is safe.
                let convertInputFile = inputFile;
                try {
                    const AdmZipDocx = require('adm-zip');
                    const zipDocx = new AdmZipDocx(inputFile);
                    const docEntry = zipDocx.getEntry('word/document.xml');
                    if (docEntry) {
                        let docXml = zipDocx.readAsText(docEntry);
                        const originalLen = docXml.length;

                        // Remove mc:AlternateContent blocks containing text boxes
                        docXml = docXml.replace(/<mc:AlternateContent[\s\S]*?<\/mc:AlternateContent>/g, (match) => {
                            if (match.includes('v:textbox') || match.includes('txbxContent') || match.includes('wps:txbx')) {
                                return '';
                            }
                            return match;
                        });

                        // Remove old-style VML text boxes
                        docXml = docXml.replace(/<v:shape[\s\S]*?<\/v:shape>/g, (match) => {
                            if (match.includes('v:textbox')) return '';
                            return match;
                        });

                        // Remove wps text boxes (modern Word format)
                        docXml = docXml.replace(/<wps:txbx[\s\S]*?<\/wps:txbx>/g, '');

                        if (docXml.length !== originalLen) {
                            console.log(`[word-to-pdf] Stripped ${originalLen - docXml.length} chars of textbox content from docx`);
                            zipDocx.updateFile('word/document.xml', Buffer.from(docXml, 'utf8'));
                            const modifiedPath = inputFile + '.notxbx.docx';
                            zipDocx.writeZip(modifiedPath);
                            convertInputFile = modifiedPath;
                        } else {
                            console.log('[word-to-pdf] No text boxes found in docx');
                        }
                    }
                } catch (txbxErr) {
                    console.log('[word-to-pdf] Text box stripping skipped:', txbxErr.message);
                    convertInputFile = inputFile; // fallback to original
                }

                try {
                    await new Promise((resolve, reject) => {
                        const sofficePath = getSofficeCommand();
                        const cmd = `${sofficePath} --headless --norestore --nofirststartwizard --convert-to pdf --outdir "${uploadDir}" "${convertInputFile}"`;
                        console.log(`[word-to-pdf] Running: ${cmd}`);

                        exec(cmd, { timeout: 90000 }, (err, stdout, stderr) => {
                            // LibreOffice names output after the INPUT file it converted
                            const outName = path.parse(convertInputFile).name + '.pdf';
                            const loPath = path.join(uploadDir, outName);
                            console.log(`[word-to-pdf] soffice err=${err?.message}, loPath=${loPath}, exists=${fs.existsSync(loPath)}`);
                            if (!err && fs.existsSync(loPath)) {
                                fs.renameSync(loPath, processedFilePath);
                                // Clean up temp modified docx if created
                                if (convertInputFile !== inputFile && fs.existsSync(convertInputFile)) {
                                    try { fs.unlinkSync(convertInputFile); } catch (e) { }
                                }
                                resolve();
                            } else {
                                console.log('[word-to-pdf] soffice failed, stdout:', stdout, 'stderr:', stderr);
                                reject(new Error(`LibreOffice Error: ${stderr || stdout || err?.message}`));
                            }
                        });
                    });

                    // Remove blank/overflow trailing pages (LibreOffice puts floating textbox content on extra pages)
                    if (fs.existsSync(processedFilePath)) {
                        try {
                            const pdfBytes = fs.readFileSync(processedFilePath);
                            const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
                            const pageCount = pdfDoc.getPageCount();
                            if (pageCount > 1) {
                                // Measure byte-size of each page individually
                                const pageSizes = [];
                                for (let i = 0; i < pageCount; i++) {
                                    try {
                                        const testDoc = await PDFDocument.create();
                                        const [cp] = await testDoc.copyPages(pdfDoc, [i]);
                                        testDoc.addPage(cp);
                                        const testBytes = await testDoc.save();
                                        pageSizes.push(testBytes.length);
                                    } catch (e) {
                                        pageSizes.push(999999); // assume real content on error
                                    }
                                }

                                // Page 1 (index 0) is the reference — real Aadhaar card / real content
                                const page1Size = pageSizes[0];
                                console.log(`[word-to-pdf] Page sizes (bytes): ${pageSizes.join(', ')}`);

                                // Remove trailing pages that are < 30% of page1 size.
                                // These are "overflow" pages from floating text boxes in Word.
                                // Example: Aadhaar page1 = 300KB, overflow page2 = 10KB → remove page2.
                                let pagesToRemove = [];
                                for (let i = pageCount - 1; i >= 1; i--) {
                                    const ratio = pageSizes[i] / page1Size;
                                    console.log(`[word-to-pdf] Page ${i + 1} ratio vs page1: ${(ratio * 100).toFixed(1)}%`);
                                    if (ratio < 0.30) {
                                        pagesToRemove.push(i);
                                    } else {
                                        break; // Stop — this page has real content
                                    }
                                }

                                if (pagesToRemove.length > 0) {
                                    for (const idx of pagesToRemove) {
                                        pdfDoc.removePage(idx);
                                    }
                                    const cleaned = await pdfDoc.save();
                                    fs.writeFileSync(processedFilePath, cleaned);
                                    console.log(`[word-to-pdf] Removed ${pagesToRemove.length} overflow trailing page(s). Final pages: ${pageCount - pagesToRemove.length}`);
                                } else {
                                    console.log(`[word-to-pdf] All ${pageCount} pages have real content — keeping all.`);
                                }
                            }
                        } catch (cleanErr) {
                            console.log('Page cleanup skipped:', cleanErr.message);
                        }
                    }
                } catch (err) {
                    return res.status(500).json({
                        error: 'LibreOffice Error',
                        details: err.message
                    });
                }
            } else {
                // For Excel and PPT
                const sofficePath = getSofficeCommand();
                const command = `${sofficePath} --headless --norestore --nofirststartwizard --convert-to pdf --outdir "${uploadDir}" "${inputFile}"`;
                console.log(`[excel/ppt-to-pdf] Running: ${command}`);
                await new Promise((resolve, reject) => {
                    exec(command, { timeout: 90000 }, (error, stdout, stderr) => {
                        const outName = path.parse(inputFile).name + '.pdf';
                        const loPath = path.join(uploadDir, outName);
                        console.log(`[excel/ppt-to-pdf] soffice error=${error?.message}, loPath=${loPath}, exists=${fs.existsSync(loPath)}`);
                        if (!error && fs.existsSync(loPath)) {
                            fs.renameSync(loPath, processedFilePath);
                            resolve();
                        } else {
                            console.log('[excel/ppt-to-pdf] soffice failed, stdout:', stdout, 'stderr:', stderr);
                            let cleanErr = (stderr || stdout || error?.message || 'File not generated').replace(/Warning: failed to launch javaldx - java may not function correctly/gi, '').trim();
                            reject(new Error(`LibreOffice Error: ${cleanErr}`));
                        }
                    });
                });
            }
        } else if (['pdf-to-excel', 'pdf-to-word', 'pdf-to-ppt'].includes(toolId)) {
            const inputFile = files[0].path;
            const sofficePath = getSofficeCommand();

            const convMap = {
                'pdf-to-excel': { format: 'xlsx', ext: 'xlsx' },
                'pdf-to-word': { format: 'docx', ext: 'docx' },
                'pdf-to-ppt': { format: 'pptx', ext: 'pptx' },
            };
            const { format, ext: outExt } = convMap[toolId];
            ext = outExt;
            processedFilePath = path.join(uploadDir, `processed-${Date.now()}.${ext}`);

            // ── Try LibreOffice first (Docker/system with soffice) ──
            let libreOfficeDone = false;
            try {
                await new Promise((resolve, reject) => {
                    let infilterObj = '';
                    if (toolId === 'pdf-to-word') infilterObj = '--infilter="writer_pdf_import"';
                    if (toolId === 'pdf-to-ppt') infilterObj = '--infilter="impress_pdf_import"';
                    const cmd = `${sofficePath} --headless --norestore --nofirststartwizard ${infilterObj} --convert-to ${format} --outdir "${uploadDir}" "${inputFile}"`;
                    console.log(`[${toolId}] Trying soffice: ${cmd}`);
                    exec(cmd, { timeout: 120000 }, (error, stdout, stderr) => {
                        const baseName = path.parse(inputFile).name;
                        const loOutPath = path.join(uploadDir, `${baseName}.${format}`);
                        if (!error && fs.existsSync(loOutPath)) {
                            fs.renameSync(loOutPath, processedFilePath);
                            libreOfficeDone = true;
                            resolve();
                        } else {
                            reject(new Error(error?.message || 'soffice not available'));
                        }
                    });
                });
            } catch (sofficErr) {
                console.log(`[${toolId}] soffice not available: ${sofficErr.message}. Using JS fallback.`);
            }

            // ── JS Fallback: pdf-parse + xlsx (no external tools needed) ──
            if (!libreOfficeDone) {
                if (toolId === 'pdf-to-ppt') {
                    throw new Error(`PDF to PPT requires LibreOffice on the server. Please contact support or install it.`);
                }

                if (toolId === 'pdf-to-excel') {
                    const XLSX = require('xlsx');
                    let rows = [];

                    // Try to extract text from PDF
                    try {
                        const pdfParse = require('pdf-parse');
                        const pdfBuffer = fs.readFileSync(inputFile);
                        const pdfData = await pdfParse(pdfBuffer, { max: 0 });
                        rows = pdfData.text
                            .split('\n')
                            .map(line => line.trim())
                            .filter(line => line.length > 0)
                            .map(line => line.split(/\t|  +/).map(cell => cell.trim()));
                        console.log(`[pdf-to-excel] Extracted ${rows.length} rows from PDF text`);
                    } catch (parseErr) {
                        console.log(`[pdf-to-excel] pdf-parse failed (likely image/encrypted PDF): ${parseErr.message}`);
                        // For image-based/encrypted PDFs, create a notice sheet
                        rows = [
                            ['PDF to Excel Conversion Notice'],
                            [''],
                            ['This PDF appears to be image-based or encrypted.'],
                            ['Text extraction requires a text-based PDF.'],
                            ['Tip: Use a PDF with selectable text for best results.'],
                        ];
                    }

                    if (rows.length === 0) {
                        rows = [['No text content found in this PDF.']];
                    }

                    const wb = XLSX.utils.book_new();
                    const ws = XLSX.utils.aoa_to_sheet(rows);
                    XLSX.utils.book_append_sheet(wb, ws, 'PDF Data');
                    const xlsxBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
                    fs.writeFileSync(processedFilePath, xlsxBuffer);
                    console.log(`[pdf-to-excel] Done. Rows: ${rows.length}`);

                } else if (toolId === 'pdf-to-word') {
                    const AdmZip = require('adm-zip');
                    let textContent = '';

                    try {
                        const pdfParse = require('pdf-parse');
                        const pdfBuffer = fs.readFileSync(inputFile);
                        const pdfData = await pdfParse(pdfBuffer, { max: 0 });
                        textContent = pdfData.text;
                        console.log(`[pdf-to-word] Extracted ${textContent.length} chars`);
                    } catch (parseErr) {
                        console.log(`[pdf-to-word] pdf-parse failed: ${parseErr.message}`);
                        textContent = 'This PDF appears to be image-based or encrypted.\nText extraction requires a text-based PDF.\nTip: Use a PDF with selectable text for best results.';
                    }

                    // Build a minimal valid DOCX using Office Open XML
                    const zip = new AdmZip();
                    const paragraphs = textContent
                        .split('\n')
                        .map(line => `<w:p><w:r><w:t xml:space="preserve">${line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</w:t></w:r></w:p>`)
                        .join('');


                    const docXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas"
  xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>${paragraphs}<w:sectPr/></w:body>
</w:document>`;
                    const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;
                    const wordRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>`;
                    const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;
                    zip.addFile('[Content_Types].xml', Buffer.from(contentTypes));
                    zip.addFile('_rels/.rels', Buffer.from(relsXml));
                    zip.addFile('word/document.xml', Buffer.from(docXml));
                    zip.addFile('word/_rels/document.xml.rels', Buffer.from(wordRelsXml));
                    fs.writeFileSync(processedFilePath, zip.toBuffer());
                    console.log(`[pdf-to-word] JS fallback done.`);

                } else {
                    // pdf-to-ppt: no reliable JS fallback, return error
                    throw new Error('PDF to PPT requires LibreOffice on the server. Please contact support.');
                }
            }

        } else {
            processedFilePath = files[0].path;
        }


        // Return JSON with download token — client will use GET /api/download/:token
        if (fs.existsSync(processedFilePath)) {
            const dlFileName = ext !== 'pdf' ? `pdfbazaar-${toolId}-result.${ext}` : `pdfbazaar-${toolId}-result.pdf`;
            const token = path.basename(processedFilePath);
            const fileSize = fs.statSync(processedFilePath).size;
            // Clean up uploaded input files (NOT the processed output)
            files.forEach(f => { if (f.path && f.path !== processedFilePath && fs.existsSync(f.path)) fs.unlinkSync(f.path); });
            return res.json({ token, filename: dlFileName, size: fileSize });
        } else {
            return res.status(500).json({ error: 'Processing failed, result file not found.' });
        }

    } catch (error) {
        console.error('Processing route error:', error);
        res.status(500).json({ error: 'Server Error during processing.', details: error.message });
    }
});

// ── GET /api/download/:token — serve processed file with correct filename ──
app.get('/api/download/:token', (req, res) => {
    const { token } = req.params;
    if (!token || token.includes('..') || token.includes('/') || token.includes('\\') || token.includes('\0')) {
        return res.status(400).json({ error: 'Invalid token' });
    }
    const filePath = path.join(uploadDir, token);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File expired. Please re-process.' });
    }
    const ext = path.extname(token).slice(1) || 'pdf';
    const friendlyName = req.query.name ? decodeURIComponent(req.query.name) : `pdfbazaar-result.${ext}`;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    res.download(filePath, friendlyName, (err) => {
        if (err) console.error('Download serve error:', err);
        setTimeout(() => { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); }, 5000);
    });
});


// ─────────────────────────────────────────────────────
// PDF Editor: Text Replace API (Backend Method)
// ─────────────────────────────────────────────────────
app.post('/api/pdf-editor/replace-text', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No PDF file uploaded.' });

        let replacements = [];
        try { replacements = JSON.parse(req.body.replacements || '[]'); } catch (e) { }

        const pdfBuffer = fs.readFileSync(req.file.path);
        const pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });

        // 🔹 Support All Languages via Google Noto Fonts
        pdfDoc.registerFontkit(fontkit);
        const FONT_MAP = [
            { regex: /[\u0980-\u09FF]/, name: 'NotoSansBengali', url: 'https://raw.githubusercontent.com/googlefonts/noto-fonts/main/hinted/ttf/NotoSansBengali/NotoSansBengali-Regular.ttf' },
            { regex: /[\u0A80-\u0AFF]/, name: 'NotoSansGujarati', url: 'https://raw.githubusercontent.com/googlefonts/noto-fonts/main/hinted/ttf/NotoSansGujarati/NotoSansGujarati-Regular.ttf' },
            { regex: /[\u0B00-\u0B7F]/, name: 'NotoSansOriya', url: 'https://raw.githubusercontent.com/googlefonts/noto-fonts/main/hinted/ttf/NotoSansOriya/NotoSansOriya-Regular.ttf' },
            { regex: /[\u0B80-\u0BFF]/, name: 'NotoSansTamil', url: 'https://raw.githubusercontent.com/googlefonts/noto-fonts/main/hinted/ttf/NotoSansTamil/NotoSansTamil-Regular.ttf' },
            { regex: /[\u0C00-\u0C7F]/, name: 'NotoSansTelugu', url: 'https://raw.githubusercontent.com/googlefonts/noto-fonts/main/hinted/ttf/NotoSansTelugu/NotoSansTelugu-Regular.ttf' },
            { regex: /[\u0C80-\u0CFF]/, name: 'NotoSansKannada', url: 'https://raw.githubusercontent.com/googlefonts/noto-fonts/main/hinted/ttf/NotoSansKannada/NotoSansKannada-Regular.ttf' },
            { regex: /[\u0D00-\u0D7F]/, name: 'NotoSansMalayalam', url: 'https://raw.githubusercontent.com/googlefonts/noto-fonts/main/hinted/ttf/NotoSansMalayalam/NotoSansMalayalam-Regular.ttf' },
            { regex: /[\u0A00-\u0A7F]/, name: 'NotoSansGurmukhi', url: 'https://raw.githubusercontent.com/googlefonts/noto-fonts/main/hinted/ttf/NotoSansGurmukhi/NotoSansGurmukhi-Regular.ttf' },
            { regex: /[\u0600-\u06FF\u0750-\u077F]/, name: 'NotoSansArabic', url: 'https://raw.githubusercontent.com/googlefonts/noto-fonts/main/hinted/ttf/NotoSansArabic/NotoSansArabic-Regular.ttf' },
            { regex: /[\u0900-\u097F]/, name: 'NotoSansDevanagari', url: 'https://raw.githubusercontent.com/googlefonts/noto-fonts/main/hinted/ttf/NotoSansDevanagari/NotoSansDevanagari-Regular.ttf' },
            { regex: /[\u4E00-\u9FFF]/, name: 'NotoSansSC', url: 'https://raw.githubusercontent.com/googlefonts/noto-cjk/main/Sans/OTF/SimplifiedChinese/NotoSansSC-Regular.otf' },
            { regex: /.*/, name: 'NotoSans', url: 'https://raw.githubusercontent.com/googlefonts/noto-fonts/main/hinted/ttf/NotoSans/NotoSans-Regular.ttf' }
        ];

        const embeddedFonts = {};

        const pages = pdfDoc.getPages();

        for (const rep of replacements) {
            const { pageIndex, x, y, width, height, newText, fontSize, renderedWidth, renderedHeight, hasMatch, pdfX, pdfY, pdfWidth, pdfHeight } = rep;
            if (pageIndex === undefined || newText === undefined) continue;
            const page = pages[pageIndex];
            if (!page) continue;

            let finalX, finalY, finalW, finalH, finalSize;

            if (hasMatch) {
                // ✅ ADOBE METHOD: Use exact PDF coordinates extracted from pdf.js
                // pdf-lib's origin is bottom-left, same as pdf.js text coordinates
                finalX = pdfX;
                finalY = pdfY;
                finalW = pdfWidth;
                finalH = pdfHeight;
                finalSize = fontSize;
            } else {
                // Fallback Method: Scale rendered pixels to PDF points
                const { width: pdfPageW, height: pdfPageH } = page.getSize();
                const scaleX = renderedWidth ? (pdfPageW / renderedWidth) : 1;
                const scaleY = renderedHeight ? (pdfPageH / renderedHeight) : 1;

                finalX = x * scaleX;
                finalY = pdfPageH - (y * scaleY) - (height * scaleY); // flip Y axis
                finalW = width * scaleX;
                finalH = height * scaleY;
                finalSize = (fontSize || 12) * scaleY;
            }

            // 1. White rectangle to cover original
            page.drawRectangle({
                x: finalX - 1,
                y: finalY - 2,
                width: finalW + 4,
                height: finalH + 4,
                color: rgb(1, 1, 1),
            });

            // 2. Draw new text at exact same position
            if (newText.trim()) {
                // Find custom font for this text
                let fontInfo = FONT_MAP[FONT_MAP.length - 1]; // Default
                for (const map of FONT_MAP) {
                    if (map.regex.test(newText)) {
                        fontInfo = map;
                        break;
                    }
                }

                if (!embeddedFonts[fontInfo.name]) {
                    const fontPath = path.join(__dirname, 'fonts', fontInfo.name + (fontInfo.url.endsWith('.otf') ? '.otf' : '.ttf'));
                    if (!fs.existsSync(fontPath)) {
                        console.log(`[Font] Downloading ${fontInfo.name} for required language...`);
                        if (!fs.existsSync(path.join(__dirname, 'fonts'))) fs.mkdirSync(path.join(__dirname, 'fonts'));
                        await new Promise((resolve, reject) => {
                            const file = fs.createWriteStream(fontPath);
                            function fetchUrl(url) {
                                https.get(url, (response) => {
                                    if (response.statusCode === 301 || response.statusCode === 302) return fetchUrl(response.headers.location);
                                    if (response.statusCode !== 200) return reject(new Error(`Failed to download font: ${response.statusCode}`));
                                    response.pipe(file);
                                    file.on('finish', () => { file.close(); resolve(); });
                                }).on('error', (err) => {
                                    fs.unlink(fontPath, () => { });
                                    reject(err);
                                });
                            }
                            fetchUrl(fontInfo.url);
                        });
                    }
                    const fontBytes = fs.readFileSync(fontPath);
                    embeddedFonts[fontInfo.name] = await pdfDoc.embedFont(fontBytes);
                }
                const activeCustomFont = embeddedFonts[fontInfo.name];

                let drawY = finalY;
                if (fontInfo.name === 'NotoSansDevanagari') {
                    // NotoSansDevanagari natively renders higher compared to standard Helvetica baseline
                    drawY = finalY - (finalSize * 0.22);
                } else if (fontInfo.name !== 'NotoSans') {
                    // Slight compensation for other Noto fonts
                    drawY = finalY - (finalSize * 0.1);
                }

                page.drawText(newText, {
                    x: finalX,
                    y: drawY,
                    size: finalSize,
                    font: activeCustomFont,
                    color: rgb(0, 0, 0),
                });
            }
        }

        const modifiedBytes = await pdfDoc.save();
        const outPath = path.join(uploadDir, `edited-${Date.now()}.pdf`);
        fs.writeFileSync(outPath, modifiedBytes);
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="pdfbazaar-edited.pdf"');
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
        res.download(outPath, 'pdfbazaar-edited.pdf', (err) => {
            if (err) console.error('Download error:', err);
            setTimeout(() => { if (fs.existsSync(outPath)) fs.unlinkSync(outPath); }, 5000);
        });
    } catch (err) {
        console.error('[replace-text]', err.message);
        res.status(500).json({ error: 'Text replacement failed.', details: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log('PDF Conversion API Ready!');
    console.log('Ensure Ghostscript (gs) is installed for compression.');
    console.log('Ensure LibreOffice (soffice) is installed for doc conversion.');
});
