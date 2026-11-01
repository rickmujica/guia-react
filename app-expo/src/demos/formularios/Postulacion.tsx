import { useRef, useState } from 'react'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputInstance,
} from 'react-native'
import { colores, espacio } from '../tema'

type Campos = { nombre: string; email: string; mensaje: string }

function validar({ nombre, email, mensaje }: Campos) {
  const errores: Partial<Record<keyof Campos, string>> = {}
  if (nombre.trim().length < 2) errores.nombre = 'Escribí tu nombre'
  if (!/^\S+@\S+\.\S+$/.test(email)) errores.email = 'El email no es válido'
  if (mensaje.trim().length < 20) errores.mensaje = 'Contá un poco más (20 letras o más)'
  return errores
}

export default function Postulacion() {
  const [campos, setCampos] = useState<Campos>({ nombre: '', email: '', mensaje: '' })
  const [intentado, setIntentado] = useState(false)
  const [estado, setEstado] = useState<'editando' | 'enviando' | 'enviado'>('editando')
  // Refs para pasar al campo siguiente con el botón "Siguiente" del teclado
  const emailRef = useRef<TextInputInstance>(null)
  const mensajeRef = useRef<TextInputInstance>(null)

  const errores = validar(campos)
  const cambiar = (campo: keyof Campos) => (texto: string) => setCampos({ ...campos, [campo]: texto })

  function enviar() {
    setIntentado(true)
    if (Object.keys(errores).length > 0) return
    setEstado('enviando')
    setTimeout(() => setEstado('enviado'), 1200)
  }

  if (estado === 'enviado') {
    return (
      <View style={[styles.pantalla, styles.centro]}>
        <Text style={styles.listo}>¡Listo, {campos.nombre.trim()}!</Text>
        <Text style={styles.ayuda}>Te vamos a escribir a {campos.email}.</Text>
      </View>
    )
  }

  return (
    // Sube el contenido cuando aparece el teclado, para que no tape el campo activo
    <KeyboardAvoidingView style={styles.pantalla} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.contenido} keyboardShouldPersistTaps="handled">
        <Text style={styles.etiqueta}>Nombre</Text>
        <TextInput
          style={[styles.input, intentado && errores.nombre && styles.inputError]}
          value={campos.nombre}
          onChangeText={cambiar('nombre')}
          autoComplete="name"
          textContentType="name"
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
          submitBehavior="submit"
        />
        {intentado && errores.nombre && <Text style={styles.error}>{errores.nombre}</Text>}

        <Text style={styles.etiqueta}>Email</Text>
        <TextInput
          ref={emailRef}
          style={[styles.input, intentado && errores.email && styles.inputError]}
          value={campos.email}
          onChangeText={cambiar('email')}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
          onSubmitEditing={() => mensajeRef.current?.focus()}
          submitBehavior="submit"
        />
        {intentado && errores.email && <Text style={styles.error}>{errores.email}</Text>}

        <Text style={styles.etiqueta}>¿Por qué te interesa?</Text>
        <TextInput
          ref={mensajeRef}
          style={[styles.input, styles.multilinea, intentado && errores.mensaje && styles.inputError]}
          value={campos.mensaje}
          onChangeText={cambiar('mensaje')}
          multiline
          textAlignVertical="top"
        />
        {intentado && errores.mensaje && <Text style={styles.error}>{errores.mensaje}</Text>}

        <Pressable style={styles.boton} onPress={enviar} disabled={estado === 'enviando'}>
          {estado === 'enviando' ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.botonTexto}>Enviar postulación</Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  centro: { alignItems: 'center', justifyContent: 'center', padding: espacio.xl, gap: espacio.s },
  contenido: { padding: espacio.l, gap: espacio.xs },
  etiqueta: { fontSize: 13, fontWeight: '600', color: colores.textoSuave, marginTop: espacio.m },
  input: {
    backgroundColor: colores.tarjeta,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 10,
    paddingHorizontal: espacio.m,
    paddingVertical: 10,
    fontSize: 16, // con menos de 16, Safari en iOS hace zoom al enfocar (en la web)
    color: colores.texto,
  },
  inputError: { borderColor: colores.error },
  multilinea: { minHeight: 90 },
  error: { color: colores.error, fontSize: 13 },
  boton: {
    backgroundColor: colores.primario,
    borderRadius: 12,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: espacio.xl,
  },
  botonTexto: { color: '#fff', fontWeight: '600', fontSize: 16 },
  listo: { fontSize: 22, fontWeight: '700', color: colores.texto },
  ayuda: { color: colores.textoSuave, fontSize: 15, textAlign: 'center' },
})
