import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { SQLiteProvider, useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite'
import { useState } from 'react'
import { Button, FlatList, Text, TextInput, View } from 'react-native'

type Nota = { id: number; ofertaId: string; texto: string; creadaEn: string }

// Migraciones con PRAGMA user_version: SQLite guarda un número en el archivo
// y cada versión nueva de la app corre solo los pasos que le faltan.
async function migrar(db: SQLiteDatabase) {
  const VERSION_ACTUAL = 2
  const fila = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version')
  let version = fila?.user_version ?? 0
  if (version >= VERSION_ACTUAL) return

  if (version === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      CREATE TABLE notas (
        id INTEGER PRIMARY KEY NOT NULL,
        oferta_id TEXT NOT NULL,
        texto TEXT NOT NULL
      );
    `)
    version = 1
  }
  if (version === 1) {
    await db.execAsync(`
      ALTER TABLE notas ADD COLUMN creada_en TEXT NOT NULL DEFAULT (datetime('now'));
      CREATE INDEX idx_notas_oferta ON notas (oferta_id);
    `)
    version = 2
  }
  await db.execAsync(`PRAGMA user_version = ${VERSION_ACTUAL}`)
}

// El provider abre la base una vez y corre las migraciones antes de mostrar a los hijos
export function ConBaseDeDatos({ children }: { children: React.ReactNode }) {
  return (
    <SQLiteProvider databaseName="busqueda.db" onInit={migrar}>
      {children}
    </SQLiteProvider>
  )
}

export function NotasDeOferta({ ofertaId }: { ofertaId: string }) {
  const db = useSQLiteContext()
  const queryClient = useQueryClient()
  const [texto, setTexto] = useState('')
  const clave = ['notas', ofertaId]

  // Leer de SQLite también es asincrónico: TanStack Query maneja la carga y la caché igual que con una API
  const { data: notas = [] } = useQuery({
    queryKey: clave,
    // Tagged template: los ${valores} viajan como parámetros, nunca pegados al SQL
    queryFn: async () => await db.sql<Nota>`
      SELECT id, oferta_id AS ofertaId, texto, creada_en AS creadaEn
      FROM notas WHERE oferta_id = ${ofertaId} ORDER BY id DESC`,
  })

  const agregar = useMutation({
    // La API "clásica" con ? también es segura
    mutationFn: (nuevo: string) => db.runAsync('INSERT INTO notas (oferta_id, texto) VALUES (?, ?)', ofertaId, nuevo),
    onSuccess: () => {
      setTexto('')
      return queryClient.invalidateQueries({ queryKey: clave }) // vuelve a leer la lista
    },
  })

  const borrarTodas = useMutation({
    // Varias escrituras juntas: todas o ninguna
    mutationFn: () =>
      db.withTransactionAsync(async () => {
        await db.runAsync('DELETE FROM notas WHERE oferta_id = ?', ofertaId)
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: clave }),
  })

  return (
    <View style={{ gap: 8, padding: 16 }}>
      <TextInput value={texto} onChangeText={setTexto} placeholder="Ej: pedir rango salarial" />
      <Button title="Guardar nota" disabled={!texto.trim()} onPress={() => agregar.mutate(texto.trim())} />
      <FlatList
        data={notas}
        keyExtractor={(n) => String(n.id)}
        renderItem={({ item }) => <Text>• {item.texto}</Text>}
      />
      {notas.length > 0 && <Button title="Borrar todas" color="#dc2626" onPress={() => borrarTodas.mutate()} />}
    </View>
  )
}
