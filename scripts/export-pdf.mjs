// Genera un PDF por guía en docs/ a partir de su versión imprimible (?print=<guía>).
//
// Uso:  npm run pdf             todas las guías
//       npm run pdf -- mysql    solo una (o varias, separadas por espacios)
// La primera vez, descargá el navegador que usa Playwright:  npx playwright install chromium
//
// Cómo funciona: levanta `vite preview` sobre el build (dist/), lee de la home qué guías hay
// y abre cada una con ?print=<guía> en Chromium para imprimirla a PDF. El tamaño de página
// (104 x 185 mm, pensado para leer en el celular) sale de la regla @page de src/styles/global.css.
import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { PDFDict, PDFDocument, PDFHexString, PDFName } from 'pdf-lib'
import { chromium } from 'playwright'
import { preview } from 'vite'

const root = fileURLToPath(new URL('..', import.meta.url))
const docs = fileURLToPath(new URL('../docs/', import.meta.url))
const only = process.argv.slice(2)

const server = await preview({ root, logLevel: 'warn', preview: { port: 4173, open: false } })
const browser = await chromium.launch()

try {
  const base = server.resolvedUrls.local[0]
  const page = await browser.newPage()
  await page.emulateMedia({ media: 'print', colorScheme: 'light' })

  // Cada tarjeta de la home tiene data-guide (el id) y data-pdf (el nombre del archivo).
  await page.goto(base, { waitUntil: 'networkidle' })
  const guides = await page.$$eval('[data-guide]', (cards) =>
    cards.map((card) => ({ id: card.dataset.guide, pdf: card.dataset.pdf })),
  )
  const selected = only.length ? guides.filter((guide) => only.includes(guide.id)) : guides
  if (!selected.length) throw new Error(`No hay guías con ese id. Las que hay: ${guides.map((g) => g.id).join(', ')}`)

  await mkdir(docs, { recursive: true })
  for (const guide of selected) {
    const output = docs + guide.pdf
    await writeFile(output, await printGuide(page, new URL(`?print=${guide.id}`, base).href))
    console.log(`PDF generado: ${output}`)
  }
} finally {
  await browser.close()
  await server.close()
}

async function printGuide(page, url) {
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', (elements) =>
    elements.map((element) => element.textContent.replace(/\s+/g, ' ').trim()),
  )

  const pdf = await page.pdf({
    preferCSSPageSize: true, // usa el @page de global.css
    printBackground: true, // colores de los bloques de código y de los recuadros
    outline: true, // marcadores (índice lateral del PDF) a partir de los títulos
    tagged: true, // PDF accesible: los lectores de pantalla entienden la estructura
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate:
      '<div style="width:100%;text-align:center;font:7px sans-serif;color:#8a8f98">' +
      '<span class="pageNumber"></span> / <span class="totalPages"></span></div>',
  })
  return fixOutlineTitles(pdf, headings)
}

// Chrome arma los marcadores con el texto de cada línea del título: si un título largo
// ocupa dos líneas, se pierde el espacio del corte ("Puente aNext.js"). Acá cada marcador
// se reemplaza por el texto completo del título que le corresponde.
async function fixOutlineTitles(bytes, headings) {
  const byLetters = new Map(headings.map((text) => [text.replace(/\s/g, ''), text]))
  const doc = await PDFDocument.load(bytes)
  const outlines = doc.catalog.lookupMaybe(PDFName.of('Outlines'), PDFDict)

  function fix(item) {
    for (; item; item = item.lookupMaybe(PDFName.of('Next'), PDFDict)) {
      const title = item.lookup(PDFName.of('Title')).decodeText()
      const fullTitle = byLetters.get(title.replace(/\s/g, ''))
      if (fullTitle && fullTitle !== title) item.set(PDFName.of('Title'), PDFHexString.fromText(fullTitle))
      fix(item.lookupMaybe(PDFName.of('First'), PDFDict))
    }
  }

  fix(outlines?.lookupMaybe(PDFName.of('First'), PDFDict))
  return doc.save()
}
