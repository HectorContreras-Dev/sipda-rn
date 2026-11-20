import { useState } from 'react'
import * as tf from '@tensorflow/tfjs'
import AppLayout from '../components/AppLayout'

interface Sample {
  label: string
  points: number[]
}

const EPOCHS = 60

// Revuelve la lista al azar (algoritmo Fisher-Yates)
function shuffle<T>(list: T[]) {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[list[i], list[j]] = [list[j], list[i]]
  }
}

// Descarga un texto como archivo
function downloadText(text: string, fileName: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }))
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}

function TrainPage() {
  const [log, setLog] = useState('Elige uno o varios JSON de captura.')
  const [training, setTraining] = useState(false)

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return

    // 1. Juntar las muestras de todos los archivos
    let samples: Sample[] = []
    for (const file of files) {
      samples = samples.concat(JSON.parse(await file.text()))
    }

    // Lista de letras, ordenada: ['A', 'NADA']
    const labels = [...new Set(samples.map((s) => s.label))].sort()
    if (labels.length < 2) {
      setLog('✕ Se necesitan al menos 2 etiquetas (por ejemplo A y NADA).')
      return
    }

    setTraining(true)

    // 2. Revolver: validationSplit usa el último 20% como prueba,
    //    y sin revolver ese 20% sería pura NADA
    shuffle(samples)

    // 3. Convertir a tensores (las tablas de números que usa TensorFlow)
    //    xs: los 63 números de cada muestra
    //    ys: la respuesta correcta en formato one-hot, A = [1, 0] y NADA = [0, 1]
    const xs = tf.tensor2d(samples.map((s) => s.points))
    const labelIndexes = tf.tensor1d(samples.map((s) => labels.indexOf(s.label)), 'int32')
    const ys = tf.oneHot(labelIndexes, labels.length)

    // 4. Definir la red: 63 entradas → 128 → 64 → una salida por letra
    const model = tf.sequential()
    model.add(tf.layers.dense({ inputShape: [63], units: 128, activation: 'relu' }))
    // Dropout apaga al azar 30% de las neuronas al entrenar, para que no memorice
    model.add(tf.layers.dropout({ rate: 0.3 }))
    model.add(tf.layers.dense({ units: 64, activation: 'relu' }))
    // softmax: las salidas suman 1, como porcentajes de confianza
    model.add(tf.layers.dense({ units: labels.length, activation: 'softmax' }))

    model.compile({
      optimizer: 'adam',
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    })

    // 5. Entrenar
    await model.fit(xs, ys, {
      epochs: EPOCHS,
      validationSplit: 0.2,
      shuffle: true,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          const accuracy = ((logs?.val_acc ?? 0) * 100).toFixed(1)
          setLog(`Época ${epoch + 1}/${EPOCHS} — precisión en prueba: ${accuracy}%`)
        },
      },
    })

    // Liberar memoria de los tensores
    xs.dispose()
    labelIndexes.dispose()
    ys.dispose()

    // 6. Descargar el modelo (2 archivos) y la lista de letras
    await model.save('downloads://sipda-model')
    downloadText(JSON.stringify(labels), 'labels.json')

    setLog((previous) => `${previous}\n✓ Listo. Etiquetas: ${labels.join(', ')} · ${samples.length} muestras`)
    setTraining(false)
  }

  return (
    <AppLayout>
      <h1 className="mb-4 text-2xl font-extrabold text-black dark:text-white">Entrenar modelo</h1>

      <input
        type="file"
        accept=".json"
        multiple
        disabled={training}
        onChange={(e) => handleFiles(e.target.files)}
        className="block text-black dark:text-white"
      />

      <p className="mt-4 whitespace-pre-line font-semibold text-black dark:text-white">{log}</p>
    </AppLayout>
  )
}

export default TrainPage