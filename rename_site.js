const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const dirFile = path.join(dir, file);
        const dirent = fs.statSync(dirFile);
        if (dirent.isDirectory()) {
            if (!dirFile.includes('node_modules') && !dirFile.includes('.git') && !dirFile.includes('dist')) {
                filelist = walkSync(dirFile, filelist);
            }
        } else {
            if (
                dirFile.endsWith('.js') ||
                dirFile.endsWith('.jsx') ||
                dirFile.endsWith('.html') ||
                dirFile.endsWith('.json') ||
                dirFile.endsWith('.css')
            ) {
                filelist.push(dirFile);
            }
        }
    }
    return filelist;
};

const frontendFiles = walkSync(path.join(__dirname, 'frontend'));
const backendFiles = walkSync(path.join(__dirname, 'node-backend'));
const allFiles = [...frontendFiles, ...backendFiles];

for (const file of allFiles) {
    if (file === __filename || file.includes('package-lock.json')) continue;
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content
        .replace(/SmartPDF/g, 'PDFbazaar.com')
        .replace(/smartpdf/g, 'pdfbazaar');

    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log(`Updated: ${file}`);
    }
}
console.log('Done replacing SmartPDF with PDFbazaar.com');
