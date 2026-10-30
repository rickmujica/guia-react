async function guardarPostulacion() {
  throw new Error('La base de datos no responde')
}

// Una promesa rechazada que nadie atrapa (falta el await o el .catch)
guardarPostulacion()

setTimeout(() => console.log('Esto no llega a imprimirse'), 100)
