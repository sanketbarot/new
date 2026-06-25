const fs = require('fs');
const path = require('path');

const srcDir = __dirname;
const destDir = path.join(__dirname, 'www');

console.log('Preparing clean build directory for APK assets...');

// Clean and recreate destination directory
if (fs.existsSync(destDir)) {
    fs.rmSync(destDir, { recursive: true, force: true });
}
fs.mkdirSync(destDir);

// Copy assets folders (css, js) recursively
const folders = ['css', 'js'];
folders.forEach(folder => {
    const src = path.join(srcDir, folder);
    const dest = path.join(destDir, folder);
    if (fs.existsSync(src)) {
        fs.cpSync(src, dest, { recursive: true });
        console.log(`Copied folder: ${folder}`);
    }
});

// Copy pages folder, excluding the back-office admin system
const srcPages = path.join(srcDir, 'pages');
const destPages = path.join(destDir, 'pages');
if (fs.existsSync(srcPages)) {
    fs.cpSync(srcPages, destPages, {
        recursive: true,
        filter: (src) => {
            const relativePath = path.relative(srcPages, src);
            const pathParts = relativePath.split(path.sep);
            const shouldInclude = !pathParts.includes('admin');
            return shouldInclude;
        }
    });
    console.log('Copied pages folder (excluding admin panel)');
}

// Copy configuration/meta files
const files = [
    'index.html',
    '404.html',
    'manifest.json',
    'browserconfig.xml',
    'robots.txt',
    'sitemap.xml',
    'ads.txt'
];

files.forEach(file => {
    const src = path.join(srcDir, file);
    const dest = path.join(destDir, file);
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log(`Copied file: ${file}`);
    }
});

console.log('Web assets packaged successfully in /www directory!');
