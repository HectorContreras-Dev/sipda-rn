import { useState } from 'react'
import * as tf from '@tensorflow/tfjs'
import AppLayout from '../components/AppLayout'
import { FEATURES_PER_FRAME, SEQUENCE_FRAMES } from '../utils/sequence'

interface MotionSample {
  label: string
  frames: number[][] // 30 cuadros × 66 números
}

const EPOCHS = 40

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

function TrainMotionPage() {
  const [log, setLog] = useState('Elige uno o varios JSON de /capture-motion.')
  const [training, setTraining] = useState(false)

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return

    // 1. Juntar las muestras de todos los archivos
    let samples: MotionSample[] = []
    for (const file of files) {
      samples = samples.concat(JSON.parse(await file.text()))
    }

    // Revisa que todas tengan la forma correcta (por si eligieron un JSON de /capture)
    const valid = samples.every(
      (s) => s.frames?.length === SEQUENCE_FRAMES && s.frames[0].length === FEATURES_PER_FRAME,
    )
    if (!valid) {
      setLog('✕ Algún archivo no es de /capture-motion (cada muestra debe ser de 30 × 66).')
      return
    }

    // Lista de letras, ordenada: ['J', 'K', 'NADA', ...]
    const labels = [...new Set(samples.map((s) => s.label))].sort()
    if (labels.length < 2) {
      setLog('✕ Se necesitan al menos 2 etiquetas (por ejemplo J y NADA).')
      return
    }

    setTraining(true)

    // 2. Revolver: validationSplit usa el último 20% como prueba
    shuffle(samples)

    // 3. Tensores. Ahora xs tiene 3 dimensiones: muestras × 30 cuadros × 66 números
    const xs = tf.tensor3d(samples.map((s) => s.frames))
    const labelIndexes = tf.tensor1d(samples.map((s) => labels.indexOf(s.label)), 'int32')
    const ys = tf.oneHot(labelIndexes, labels.length)

    // 4. La red: GRU lee los 30 cuadros en orden y resume el movimiento en 64 números
    const model = tf.sequential()
    model.add(tf.layers.gru({ inputShape: [SEQUENCE_FRAMES, FEATURES_PER_FRAME], units: 64 }))
    model.add(tf.layers.dropout({ rate: 0.3 }))
    model.add(tf.layers.dense({ units: 32, activation: 'relu' }))
    model.add(tf.layers.dense({ units: labels.length, activation: 'softmax' }))

    model.compile({
      optimizer: 'adam',
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    })

    // 5. Entrenar
    await model.fit(xs, ys, {
      epochs: EPOCHS,
      batchSize: 16,
      validationSplit: 0.2,
      shuffle: true,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          const accuracy = ((logs?.val_acc ?? 0) * 100).toFixed(1)
          setLog(`Época ${epoch + 1}/${EPOCHS} — precisión en prueba: ${accuracy}%`)
        },
      },
    })

    xs.dispose()
    labelIndexes.dispose()
    ys.dispose()

    // 6. Descargar el modelo (2 archivos) y la lista de letras
    await model.save('downloads://sipda-motion-model')
    downloadText(JSON.stringify(labels), 'motion-labels.json')

    // Cuántas muestras hubo de cada letra
    const perLabel = labels.map((l) => `${l}: ${samples.filter((s) => s.label === l).length}`)
    setLog((previous) => `${previous}\n✓ Listo. ${perLabel.join(' · ')}`)
    setTraining(false)
  }

  return (
    <AppLayout>
      <h1 className="mb-4 text-2xl font-extrabold text-black dark:text-white">
        Entrenar modelo de movimiento
      </h1>

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

export default TrainMotionPage