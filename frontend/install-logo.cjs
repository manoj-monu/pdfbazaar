const fs = require('fs');
const path = require('path');

const brainDir = 'C:/Users/ADMIN/.gemini/antigravity/brain/34392059-19f6-4536-872b-66a17c606462/';
const targetDir = 'C:/Users/ADMIN/pdfbazaar/frontend/public/';

const files = fs.readdirSync(brainDir);
const pngFiles = files.filter(f => f.endsWith('.png'));

if (pngFiles.length > 0) {
    const latestPng = pngFiles
        .map(f => ({ file: f, mtime: fs.statSync(path.join(brainDir, f)).mtime.getTime() }))
        .sort((a, b) => b.mtime - a.mtime)[0].file;

    fs.copyFileSync(path.join(brainDir, latestPng), path.join(targetDir, 'logo.png'));
    console.log(`Copied ${latestPng} to logo.png`);
} else {
    console.log('No .png files found in brain dir');
}
