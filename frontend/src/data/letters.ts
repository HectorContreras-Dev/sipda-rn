export interface Letter {
  id: number
  letter: string
  description: string
  camera_hint?: string
  image_url: string | null
  video_url?: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export const difficultyLabels: Record<Letter['difficulty'], string> = {
  easy: 'Fácil',
  medium: 'Media',
  hard: 'Difícil',
}

// Datos temporales: después se reemplazan por GET /api/letters
export const letters: Letter[] = [
  { id: 1, letter: 'A', description: 'Cierra la mano en puño con la palma hacia el frente y coloca el pulgar extendido a un lado del dedo índice.', camera_hint: 'Palma hacia la cámara.', image_url: '/Letters/a.webp', difficulty: 'easy' },
  { id: 2, letter: 'B', description: 'Extiende los cuatro dedos juntos hacia arriba con la palma al frente y dobla el pulgar sobre la palma.', camera_hint: 'Palma hacia la cámara.', image_url: '/Letters/b.webp', difficulty: 'easy' },
  { id: 3, letter: 'C', description: 'Curva todos los dedos juntos y el pulgar para formar la letra C, como si sostuvieras un vaso.', camera_hint: 'Igual que la foto de ejemplo',image_url: '/Letters/c.webp', difficulty: 'easy' },
  { id: 4, letter: 'D', description: 'Extiende el dedo índice hacia arriba y junta las puntas de los demás dedos con la punta del pulgar, formando un círculo.', camera_hint: 'Palma hacia la cámara, un poco de lado.',image_url: '/Letters/d.webp', difficulty: 'medium' },
  { id: 5, letter: 'E', description: 'Dobla los cuatro dedos hacia la palma, con las puntas tocando la parte de arriba de la palma, y dobla el pulgar debajo de ellos.', camera_hint: 'Palma hacia la cámara.',image_url: '/Letters/e.webp', difficulty: 'medium' },
  { id: 6, letter: 'F', description: 'Junta las puntas del índice y el pulgar formando un círculo, y extiende los dedos medio, anular y meñique separados, con la palma al frente.', camera_hint: 'Palma hacia la cámara.',image_url: '/Letters/f.webp', difficulty: 'medium' },
  { id: 7, letter: 'G', description: 'Cierra la mano en puño y extiende el índice y el pulgar paralelos, apuntando hacia un lado.', camera_hint: 'Palma hacia tí', image_url: '/Letters/g.webp', difficulty: 'medium' },
  { id: 8, letter: 'H', description: 'Extiende los dedos índice y medio juntos apuntando hacia un lado, con los demás dedos cerrados y el pulgar sobre ellos.', camera_hint: 'Palma hacia tí', image_url: '/Letters/h.webp', difficulty: 'medium' },
  { id: 9, letter: 'I', description: 'Cierra la mano en puño con el pulgar sobre los dedos y extiende solo el meñique hacia arriba.', camera_hint: 'Palma hacia la cámara.', image_url: '/Letters/i.webp', difficulty: 'easy' },
  { id: 10, letter: 'J', description: 'Forma la letra I (meñique extendido) y traza con el meñique una J en el aire: hacia abajo y curva hacia adentro. Lleva movimiento.', camera_hint: 'Comienza con la palma hacia la camara.', image_url: null, video_url: '/Letters/j.mp4', difficulty: 'hard' },
  { id: 11, letter: 'K', description: 'Extiende el índice y el medio separados hacia arriba, coloca el pulgar entre ellos y mueve la mano hacia arriba. Lleva movimiento.', camera_hint: 'Igual que el ejemplo.', image_url: null, video_url: '/Letters/K.mp4', difficulty: 'hard' },
  { id: 12, letter: 'L', description: 'Extiende el índice hacia arriba y el pulgar hacia un lado, formando una L, con los demás dedos cerrados.', camera_hint: 'Palma hacia la cámara.', image_url: '/Letters/l.webp', difficulty: 'easy' },
  { id: 13, letter: 'LL', description: 'Forma la letra L (índice hacia arriba y pulgar hacia un lado) y desliza la mano hacia afuera una vez. Lleva movimiento.', camera_hint: 'Palma hacia la cámara.', image_url: null, video_url: '/Letters/LL.mp4', difficulty: 'easy' },
  { id: 14, letter: 'M', description: 'Extiende los dedos índice, medio y anular juntos apuntando hacia abajo, con el meñique y el pulgar doblados.', camera_hint: 'Igual que el ejemplo.', image_url: '/Letters/m.webp', difficulty: 'medium' },
  { id: 15, letter: 'N', description: 'Extiende los dedos índice y medio juntos apuntando hacia abajo, con los demás dedos y el pulgar doblados.', camera_hint: 'Igual que el ejemplo.', image_url: '/Letters/n.webp', difficulty: 'medium' },
  { id: 16, letter: 'Ñ', description: 'Forma la letra N (índice y medio hacia abajo) y mueve la mano de un lado a otro. Lleva movimiento.', camera_hint: 'Igual que el ejemplo.', image_url: null, video_url: '/Letters/enie.mp4', difficulty: 'hard' },
  { id: 17, letter: 'O', description: 'Curva todos los dedos y junta sus puntas con la punta del pulgar, formando una O.', camera_hint: 'Pulgar hacia tí.', image_url: '/Letters/o.webp', difficulty: 'easy' },
  { id: 18, letter: 'P', description: 'Extiende el índice y el medio con el pulgar tocando el medio, como en la K, pero con la mano apuntando hacia el frente y abajo.', camera_hint: 'Pulgar hacia tí.', image_url: '/Letters/p.webp', difficulty: 'medium' },
  { id: 19, letter: 'Q', description: 'Curva el índice y el pulgar como un gancho apuntando hacia abajo, con los demás dedos cerrados, y mueve la mano hacia ti. Lleva movimiento.', camera_hint: 'Igual que el ejemplo.', image_url: null, video_url: '/Letters/Q.mp4', difficulty: 'hard' },
  { id: 20, letter: 'R', description: 'Extiende el índice y el medio hacia arriba y cruza el medio sobre el índice, con los demás dedos cerrados.', camera_hint: 'Palma hacia la cámara.', image_url: '/Letters/r.webp', difficulty: 'medium' },
  { id: 21, letter: 'S', description: 'Cierra la mano en puño con el pulgar cruzado por delante de los dedos.', camera_hint: 'Palma hacia la cámara.', image_url: '/Letters/s.webp', difficulty: 'easy' },
  { id: 22, letter: 'T', description: 'Dobla el índice hasta que su punta toque la punta del pulgar y extiende los demás dedos juntos hacia arriba.', camera_hint: 'Palma hacia la cámara.', image_url: '/Letters/t.webp', difficulty: 'medium' },
  { id: 23, letter: 'U', description: 'Extiende el índice y el medio juntos hacia arriba, con los demás dedos cerrados y el pulgar sobre ellos.', camera_hint: 'Palma hacia la cámara.', image_url: '/Letters/u.webp', difficulty: 'easy' },
  { id: 24, letter: 'V', description: 'Extiende el índice y el medio separados hacia arriba formando una V, con los demás dedos cerrados.', camera_hint: 'Palma hacia la cámara.', image_url: '/Letters/v.webp', difficulty: 'easy' },
  { id: 25, letter: 'W', description: 'Extiende el índice, el medio y el anular separados hacia arriba, con el meñique doblado bajo el pulgar.', camera_hint: 'Palma hacia la cámara.', image_url: '/Letters/w.webp', difficulty: 'easy' },
  { id: 26, letter: 'X', description: 'Extiende el índice doblado como gancho, con los demás dedos cerrados, y jala la seña hacia tu cuerpo. Lleva movimiento.', camera_hint: 'Igual que el ejemplo.',image_url: null, video_url: '/Letters/X.mp4', difficulty: 'hard' },
  { id: 27, letter: 'Y', description: 'Cierra la mano y extiende solo el pulgar y el meñique hacia los lados.', camera_hint: 'Palma hacia tí.', image_url: '/Letters/y.webp', difficulty: 'easy' },
  { id: 28, letter: 'Z', description: 'Extiende el dedo índice y traza una Z en el aire. Lleva movimiento.', camera_hint: 'Palma hacia la cámara.', image_url: null, video_url: '/Letters/Z.mp4', difficulty: 'hard' }]