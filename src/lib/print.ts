// Con ?print=<guía> en la URL, la app muestra el libro completo de esa guía para exportarlo a PDF.
// Con ?print a secas, el de la guía de React (así siguen andando los links viejos).
const params = new URLSearchParams(window.location.search)

export const IS_PRINT = params.has('print')
export const PRINT_GUIDE = params.get('print') ?? ''
