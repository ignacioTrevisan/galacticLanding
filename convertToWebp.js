const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './public/frames2'; // Cambia esta ruta a la carpeta que contiene tus imágenes JPG
const outputDir = './public/frames2WebP'; // La carpeta donde guardarás las imágenes WebP

// Verificar si la carpeta de salida existe, si no, crearla
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// Función para convertir imágenes
function convertToWebP(file) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file.replace(/\.[^/.]+$/, '.webp')); // Cambia la extensión a .webp

    sharp(inputPath)
        .webp({ quality: 80 }) // Ajusta la calidad (0-100)
        .toFile(outputPath, (err, info) => {
            if (err) {
                console.error(`Error convirtiendo ${file}:`, err);
            } else {
                console.log(`Convertido ${file} a WebP.`);
            }
        });
}

// Leer las imágenes en la carpeta de entrada
fs.readdir(inputDir, (err, files) => {
    if (err) {
        console.error('Error leyendo la carpeta:', err);
        return;
    }

    // Filtrar solo los archivos JPG
    const jpgFiles = files.filter(file => file.endsWith('.jpg'));

    // Convertir cada archivo
    jpgFiles.forEach(convertToWebP);
});
