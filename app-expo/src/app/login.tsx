import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { z } from 'zod'
import { colores, espacio } from '@/demos/tema'
import { useSesion } from '@/stores/sesion'

const esquema = z.object({
  email: z.email('Escribí un email válido'),
  password: z.string().min(8, 'La contraseña tiene al menos 8 caracteres'),
})
type Datos = z.infer<typeof esquema>

export default function Login() {
  const iniciarSesion = useSesion((s) => s.iniciarSesion)
  const {
    control,
    handleSubmit,
    setError,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<Datos>({ resolver: zodResolver(esquema), defaultValues: { email: '', password: '' } })

  async function entrar({ email, password }: Datos) {
    try {
      await iniciarSesion(email, password)
      // No hace falta navegar: el Stack.Protected del layout muestra las pestañas solo
    } catch (error) {
      setError('root', { message: error instanceof Error ? error.message : 'No se pudo entrar' })
    }
  }

  return (
    <SafeAreaView style={styles.pantalla}>
      <KeyboardAvoidingView style={styles.contenido} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Text style={styles.titulo}>Búsqueda RN</Text>
        <Text style={styles.subtitulo}>Usá cualquier email y la contraseña expo1234.</Text>

        {/* Controller conecta un TextInput (que no es un <input>) con react-hook-form */}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <TextInput
              ref={ref}
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="Email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="username"
              returnKeyType="next"
              onSubmitEditing={() => setFocus('password')}
              submitBehavior="submit"
            />
          )}
        />
        {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <TextInput
              ref={ref}
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="Contraseña"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              autoComplete="current-password"
              textContentType="password"
              returnKeyType="go"
              onSubmitEditing={() => handleSubmit(entrar)()}
            />
          )}
        />
        {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
        {errors.root && <Text style={styles.error}>{errors.root.message}</Text>}

        {/* handleSubmit(entrar) devuelve una función que espera un evento web: en RN se llama sin evento */}
        <Pressable style={styles.boton} onPress={() => handleSubmit(entrar)()} disabled={isSubmitting}>
          {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.botonTexto}>Entrar</Text>}
        </Pressable>
        <View style={styles.flex} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  contenido: { flex: 1, padding: espacio.xl, gap: espacio.s, justifyContent: 'center' },
  titulo: { fontSize: 34, fontWeight: '800', color: colores.texto },
  subtitulo: { fontSize: 15, color: colores.textoSuave, marginBottom: espacio.l },
  input: {
    backgroundColor: colores.tarjeta,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 12,
    paddingHorizontal: espacio.l,
    paddingVertical: 14,
    fontSize: 16,
    color: colores.texto,
  },
  inputError: { borderColor: colores.error },
  error: { color: colores.error, fontSize: 13 },
  boton: {
    backgroundColor: colores.primario,
    borderRadius: 12,
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: espacio.m,
  },
  botonTexto: { color: '#fff', fontSize: 16, fontWeight: '600' },
  flex: { flex: 0.3 },
})
