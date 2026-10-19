export interface Letter {
  id: number
  letter: string
  description: string
  image_url: string | null
  difficulty: 'easy' | 'medium' | 'hard'
}

export const difficultyLabels: Record<Letter['difficulty'], string> = {
  easy: 'Fácil',
  medium: 'Media',
  hard: 'Difícil',
}

// Datos temporales: después se reemplazan por GET /api/letters
export const letters: Letter[] = [
  {
    id: 1,
    letter: 'A',
    description:
      'Cierra la mano en puño con la palma hacia el frente y coloca el pulgar extendido a un lado del dedo índice.',
    image_url: null,
    difficulty: 'easy',
  },
  {
    id: 2,
    letter: 'B',
    description:
      'Extiende los cuatro dedos juntos hacia arriba con la palma al frente y dobla el pulgar sobre la palma.',
    image_url: null,
    difficulty: 'easy',
  },
  {
    id: 3,
    letter: 'C',
    description:
      'Curva todos los dedos juntos y el pulgar para formar la letra C, como si sostuvieras un vaso.',
    image_url: null,
    difficulty: 'easy',
  },
]