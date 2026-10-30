import path from 'node:path'

// Armar rutas con path (y no concatenando strings): usa el separador correcto en cada sistema
console.log(path.join('datos', 'ofertas', '..', 'empresas.json'))
console.log(path.basename('/home/ana/cv/cv-2026.pdf'))
console.log(path.extname('cv-2026.pdf'))
console.log(path.dirname('/home/ana/cv/cv-2026.pdf'))
console.log(path.parse('/home/ana/cv/cv-2026.pdf'))

// La carpeta de este archivo, para leer archivos que están al lado
console.log(import.meta.dirname)
console.log(path.join(import.meta.dirname, 'datos.json'))
