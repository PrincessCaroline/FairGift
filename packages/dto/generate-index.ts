// generate-index.ts
const fs = require('fs');
const path = require('path');

// Dossier des fichiers DTO
const dtoDir = path.join(__dirname, 'src');
const indexPath = path.join(dtoDir, 'index.ts');

function generateExports(dir, baseDir = '') {
    const files = fs.readdirSync(dir);
    let exports = '';

    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const relativePath = path.join(baseDir, file).replace(/\\/g, '/'); // Support Windows
        if (fs.statSync(fullPath).isDirectory()) {
            // Appel récursif pour gérer les sous-dossiers
            exports += generateExports(fullPath, relativePath);
        } else if (file.endsWith('.ts') && file !== 'index.ts') {
            // Génère un export pour chaque fichier TypeScript
            const exportPath = `./${relativePath.replace('.ts', '')}`;
            exports += `export * from '${exportPath}';\n`;
        }
    });

    return exports;
}

function generateIndex() {
    const exports = generateExports(dtoDir);
    fs.writeFileSync(indexPath, exports);
    console.log('index.ts generated successfully!');
}

generateIndex();
