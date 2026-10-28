// Con ?print en la URL, la app muestra el libro completo para exportarlo a PDF.
export const IS_PRINT = new URLSearchParams(window.location.search).has('print')
