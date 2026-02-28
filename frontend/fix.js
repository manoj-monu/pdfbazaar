import fs from 'fs';
const data = fs.readFileSync('src/BlogData.js', 'utf8');
const fixedData = data.replace(/\\`/g, '`');
fs.writeFileSync('src/BlogData.js', fixedData);
console.log('Fixed BlogData.js');
