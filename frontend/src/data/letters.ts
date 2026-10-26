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
  { id: 1, letter: 'A', description: 'Cierra la mano en puño con la palma hacia el frente y coloca el pulgar extendido a un lado del dedo índice.', image_url: null, difficulty: 'easy' },
  { id: 2, letter: 'B', description: 'Extiende los cuatro dedos juntos hacia arriba con la palma al frente y dobla el pulgar sobre la palma.', image_url: null, difficulty: 'easy' },
  { id: 3, letter: 'C', description: 'Curva todos los dedos juntos y el pulgar para formar la letra C, como si sostuvieras un vaso.', image_url: null, difficulty: 'easy' },
  { id: 4, letter: 'D', description: 'Extiende el dedo índice hacia arriba y junta las puntas de los demás dedos con la punta del pulgar, formando un círculo.', image_url: null, difficulty: 'medium' },
  { id: 5, letter: 'E', description: 'Dobla los cuatro dedos hacia la palma, con las puntas tocando la parte de arriba de la palma, y dobla el pulgar debajo de ellos.', image_url: null, difficulty: 'medium' },
  { id: 6, letter: 'F', description: 'Junta las puntas del índice y el pulgar formando un círculo, y extiende los dedos medio, anular y meñique separados, con la palma al frente.', image_url: null, difficulty: 'medium' },
  { id: 7, letter: 'G', description: 'Cierra la mano en puño y extiende el índice y el pulgar paralelos, apuntando hacia un lado.', image_url: null, difficulty: 'medium' },
  { id: 8, letter: 'H', description: 'Extiende los dedos índice y medio juntos apuntando hacia un lado, con los demás dedos cerrados y el pulgar sobre ellos.', image_url: null, difficulty: 'medium' },
  { id: 9, letter: 'I', description: 'Cierra la mano en puño con el pulgar sobre los dedos y extiende solo el meñique hacia arriba.', image_url: null, difficulty: 'easy' },
  { id: 10, letter: 'J', description: 'Forma la letra I (meñique extendido) y traza con el meñique una J en el aire: hacia abajo y curva hacia adentro. Lleva movimiento.', image_url: null, difficulty: 'hard' },
  { id: 11, letter: 'K', description: 'Extiende el índice y el medio separados hacia arriba, coloca el pulgar entre ellos y mueve la mano hacia arriba. Lleva movimiento.', image_url: null, difficulty: 'hard' },
  { id: 12, letter: 'L', description: 'Extiende el índice hacia arriba y el pulgar hacia un lado, formando una L, con los demás dedos cerrados.', image_url: null, difficulty: 'easy' },
  { id: 13, letter: 'M', description: 'Extiende los dedos índice, medio y anular juntos apuntando hacia abajo, con el meñique y el pulgar doblados.', image_url: null, difficulty: 'medium' },
  { id: 14, letter: 'N', description: 'Extiende los dedos índice y medio juntos apuntando hacia abajo, con los demás dedos y el pulgar doblados.', image_url: null, difficulty: 'medium' },
  { id: 15, letter: 'Ñ', description: 'Forma la letra N (índice y medio hacia abajo) y mueve la mano de un lado a otro. Lleva movimiento.', image_url: null, difficulty: 'hard' },
  { id: 16, letter: 'O', description: 'Curva todos los dedos y junta sus puntas con la punta del pulgar, formando una O.', image_url: null, difficulty: 'easy' },
  { id: 17, letter: 'P', description: 'Extiende el índice y el medio con el pulgar tocando el medio, como en la K, pero con la mano apuntando hacia el frente y abajo.', image_url: null, difficulty: 'medium' },
  { id: 18, letter: 'Q', description: 'Curva el índice y el pulgar como un gancho apuntando hacia abajo, con los demás dedos cerrados, y mueve la mano. Lleva movimiento.', image_url: null, difficulty: 'hard' },
  { id: 19, letter: 'R', description: 'Extiende el índice y el medio hacia arriba y cruza el medio sobre el índice, con los demás dedos cerrados.', image_url: null, difficulty: 'medium' },
  { id: 20, letter: 'S', description: 'Cierra la mano en puño con el pulgar cruzado por delante de los dedos.', image_url: null, difficulty: 'easy' },
  { id: 21, letter: 'T', description: 'Dobla el índice hasta que su punta toque la punta del pulgar y extiende los demás dedos juntos hacia arriba.', image_url: null, difficulty: 'medium' },
  { id: 22, letter: 'U', description: 'Extiende el índice y el medio juntos hacia arriba, con los demás dedos cerrados y el pulgar sobre ellos.', image_url: null, difficulty: 'easy' },
  { id: 23, letter: 'V', description: 'Extiende el índice y el medio separados hacia arriba formando una V, con los demás dedos cerrados.', image_url: null, difficulty: 'easy' },
  { id: 24, letter: 'W', description: 'Extiende el índice, el medio y el anular separados hacia arriba, con el meñique doblado bajo el pulgar.', image_url: null, difficulty: 'easy' },
  { id: 25, letter: 'X', description: 'Extiende el índice doblado como gancho, con los demás dedos cerrados, y mueve la mano. Lleva movimiento.', image_url: null, difficulty: 'hard' },
  { id: 26, letter: 'Y', description: 'Cierra la mano y extiende solo el pulgar y el meñique hacia los lados.', image_url: null, difficulty: 'easy' },
  { id: 27, letter: 'Z', description: 'Extiende el dedo índice y traza una Z en el aire. Lleva movimiento.', image_url: null, difficulty: 'hard' },
]