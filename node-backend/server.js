const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { PDFDocument, rgb, degrees } = require('pdf-lib');
const { exec } = require('child_process');
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
const upload = multer({ storage: storage, limits: { fileSize: 100 * 1024 * 1024 } }); // 100MB limit

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
            return res.download(htmlProcessedPath, `pdfbazaar-html-result.pdf`);
        }

        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded.' });
        }

        console.log(`Processing tool [${toolId}] with ${files.length} files.`);

        // Determine tool category based on toolId
        const isPdfLibTool = ['merge-pdf', 'split-pdf', 'add-watermark', 'rotate-pdf', 'delete-pdf-pages', 'jpg-to-pdf', 'add-page-numbers', 'pdf-to-txt', 'pdf-to-word', 'crop-pdf', 'resize-pdf'].includes(toolId);

        let ext = 'pdf';
        let processedFilePath = path.join(uploadDir, `processed-${Date.now()}.${ext}`);

        if (isPdfLibTool) {
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
                        { quality: '/screen', dpi: 120 },
                        { quality: '/screen', dpi: 96 },
                        { quality: '/screen', dpi: 72 },
                        { quality: '/screen', dpi: 60 },
                        { quality: '/screen', dpi: 48 },
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
                // ── Try LibreOffice first (perfect layout) ──
                let sofficeDone = false;
                try {
                    await new Promise((resolve, reject) => {
                        const sofficePath = getSofficeCommand();
                        const cmd = `${sofficePath} --headless --convert-to pdf --outdir "${uploadDir}" "${inputFile}"`;
                        exec(cmd, { timeout: 60000 }, (err) => {
                            const outName = path.parse(inputFile).name + '.pdf';
                            const loPath = path.join(uploadDir, outName);
                            if (!err && fs.existsSync(loPath)) {
                                fs.renameSync(loPath, processedFilePath);
                                sofficeDone = true;
                                resolve();
                            } else {
                                console.log('soffice error:', err?.message);
                                reject(new Error('soffice not available'));
                            }
                        });
                    });

                    // ── Remove truly blank trailing pages (robust approach) ──
                    if (sofficeDone && fs.existsSync(processedFilePath)) {
                        try {
                            const pdfBytes = fs.readFileSync(processedFilePath);
                            const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
                            const pageCount = pdfDoc.getPageCount();
                            if (pageCount > 1) {
                                // Helper: isolate each page into its own single-page PDF and check size.
                                // A truly blank page (no text, no images) will produce a very small PDF (< 5KB).
                                // A page with real content (like Aadhaar card) produces a much larger file.
                                const isPageBlank = async (srcDoc, pageIndex) => {
                                    try {
                                        const testDoc = await PDFDocument.create();
                                        const [copiedPage] = await testDoc.copyPages(srcDoc, [pageIndex]);
                                        testDoc.addPage(copiedPage);
                                        const testBytes = await testDoc.save();
                                        // Blank pages in PDF are typically < 5 KB
                                        return testBytes.length < 5120;
                                    } catch (e) {
                                        return false; // On error, assume not blank (safe default)
                                    }
                                };

                                let pagesToRemove = [];
                                // Only scan from the end, stop at first non-blank page
                                for (let i = pageCount - 1; i >= 1; i--) {
                                    if (await isPageBlank(pdfDoc, i)) {
                                        pagesToRemove.push(i);
                                    } else {
                                        break;
                                    }
                                }

                                if (pagesToRemove.length > 0) {
                                    // Remove in reverse order (highest index first)
                                    for (const idx of pagesToRemove) {
                                        pdfDoc.removePage(idx);
                                    }
                                    const cleaned = await pdfDoc.save();
                                    fs.writeFileSync(processedFilePath, cleaned);
                                    console.log(`Removed ${pagesToRemove.length} truly blank trailing page(s)`);
                                } else {
                                    console.log('No blank trailing pages found, keeping all pages.');
                                }
                            }
                        } catch (cleanErr) {
                            console.log('Page cleanup skipped:', cleanErr.message);
                        }
                    }
                } catch (_) { /* soffice not installed, use mammoth fallback */ }

                // ── Fallback: mammoth + Puppeteer ──
                if (!sofficeDone) {
                    try {
                        const mammoth = require('mammoth');
                        const puppeteer = require('puppeteer');

                        const result = await mammoth.convertToHtml(
                            { path: inputFile },
                            {
                                convertImage: mammoth.images.imgElement(async (image) => {
                                    const imageBuffer = await image.read();
                                    const base64 = imageBuffer.toString('base64');
                                    return { src: `data:${image.contentType};base64,${base64}` };
                                })
                            }
                        );

                        const htmlContent = `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>
  @page { size: A4; margin: 2cm; }
  * { box-sizing: border-box; }
  body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; line-height: 1.5; color: #000; margin: 0; padding: 0; background: white; }
  h1, h2, h3, h4, h5, h6 { page-break-after: avoid; page-break-inside: avoid; margin-top: 12pt; margin-bottom: 6pt; }
  p { margin: 0 0 8pt 0; orphans: 3; widows: 3; }
  img { max-width: 100%; height: auto; display: block; page-break-inside: avoid; }
  table { border-collapse: collapse; width: 100%; margin-bottom: 12pt; page-break-inside: avoid; }
  td, th { border: 1px solid #ccc; padding: 6pt 8pt; vertical-align: top; word-wrap: break-word; }
  th { background-color: #f2f2f2; font-weight: bold; }
  ul, ol { margin: 0 0 8pt 20pt; page-break-inside: avoid; }
  li { margin-bottom: 4pt; }
  br:last-child { display: none; }
  [style*="background"] { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
</style></head>
<body>${result.value}</body></html>`;

                        const browser = await puppeteer.launch({
                            headless: 'new',
                            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
                        });
                        const page = await browser.newPage();
                        try {
                            await page.setContent(htmlContent, { waitUntil: 'networkidle2', timeout: 30000 });
                            await page.pdf({
                                path: processedFilePath,
                                format: 'A4',
                                margin: { top: '2cm', right: '1.5cm', bottom: '2cm', left: '1.5cm' },
                                printBackground: true,
                                preferCSSPageSize: false
                            });
                        } finally {
                            await browser.close();
                        }
                    } catch (convErr) {
                        console.error('Word-to-PDF Error:', convErr);
                        return res.status(500).json({
                            error: 'Processing Error',
                            details: 'Could not convert Word to PDF. Please ensure the file is a valid .docx file.'
                        });
                    }
                }
            } else {
                // For Excel and PPT, we still need soffice as there isn't a reliable JS only fallback as simple as mammoth
                const command = `soffice --headless --convert-to pdf --outdir "${uploadDir}" "${inputFile}"`;
                await new Promise((resolve, reject) => {
                    exec(command, (error, stdout, stderr) => {
                        const outName = path.parse(inputFile).name + '.pdf';
                        const loPath = path.join(uploadDir, outName);
                        if (fs.existsSync(loPath)) {
                            fs.renameSync(loPath, processedFilePath);
                            resolve();
                        } else {
                            reject(new Error('Office conversion failed. Ensure LibreOffice (soffice) is installed.'));
                        }
                    });
                });
            }
        }
        else {
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


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log('PDF Conversion API Ready!');
    console.log('Ensure Ghostscript (gs) is installed for compression.');
    console.log('Ensure LibreOffice (soffice) is installed for doc conversion.');
});
