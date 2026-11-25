-- Carga las 28 letras del abecedario con los mismos ids que frontend/src/data/letters.ts
-- (attempts y quiz_results apuntan a letters.id, por eso deben coincidir)
-- ON CONFLICT: si el id ya existe (las filas de prueba A, B, C), se sobrescribe en vez de dar error
INSERT INTO letters (id, letter, description, image_url, video_url, difficulty) VALUES
  (1, 'A', 'Cierra la mano en puño con la palma hacia el frente y coloca el pulgar extendido a un lado del dedo índice.', '/Letters/a.webp', NULL, 'easy'),
  (2, 'B', 'Extiende los cuatro dedos juntos hacia arriba con la palma al frente y dobla el pulgar sobre la palma.', '/Letters/b.webp', NULL, 'easy'),
  (3, 'C', 'Curva todos los dedos juntos y el pulgar para formar la letra C, como si sostuvieras un vaso.', '/Letters/c.webp', NULL, 'easy'),
  (4, 'D', 'Extiende el dedo índice hacia arriba y junta las puntas de los demás dedos con la punta del pulgar, formando un círculo.', '/Letters/d.webp', NULL, 'medium'),
  (5, 'E', 'Dobla los cuatro dedos hacia la palma, con las puntas tocando la parte de arriba de la palma, y dobla el pulgar debajo de ellos.', '/Letters/e.webp', NULL, 'medium'),
  (6, 'F', 'Junta las puntas del índice y el pulgar formando un círculo, y extiende los dedos medio, anular y meñique separados, con la palma al frente.', '/Letters/f.webp', NULL, 'medium'),
  (7, 'G', 'Cierra la mano en puño y extiende el índice y el pulgar paralelos, apuntando hacia un lado.', '/Letters/g.webp', NULL, 'medium'),
  (8, 'H', 'Extiende los dedos índice y medio juntos apuntando hacia un lado, con los demás dedos cerrados y el pulgar sobre ellos.', '/Letters/h.webp', NULL, 'medium'),
  (9, 'I', 'Cierra la mano en puño con el pulgar sobre los dedos y extiende solo el meñique hacia arriba.', '/Letters/i.webp', NULL, 'easy'),
  (10, 'J', 'Forma la letra I (meñique extendido) y traza con el meñique una J en el aire: hacia abajo y curva hacia adentro. Lleva movimiento.', NULL, '/Letters/j.mp4', 'hard'),
  (11, 'K', 'Extiende el índice y el medio separados hacia arriba, coloca el pulgar entre ellos y mueve la mano hacia arriba. Lleva movimiento.', NULL, '/Letters/K.mp4', 'hard'),
  (12, 'L', 'Extiende el índice hacia arriba y el pulgar hacia un lado, formando una L, con los demás dedos cerrados.', '/Letters/l.webp', NULL, 'easy'),
  (13, 'LL', 'Forma la letra L (índice hacia arriba y pulgar hacia un lado) y desliza la mano hacia afuera una vez. Lleva movimiento.', NULL, '/Letters/LL.mp4', 'easy'),
  (14, 'M', 'Extiende los dedos índice, medio y anular juntos apuntando hacia abajo, con el meñique y el pulgar doblados.', '/Letters/m.webp', NULL, 'medium'),
  (15, 'N', 'Extiende los dedos índice y medio juntos apuntando hacia abajo, con los demás dedos y el pulgar doblados.', '/Letters/n.webp', NULL, 'medium'),
  (16, 'Ñ', 'Forma la letra N (índice y medio hacia abajo) y mueve la mano de un lado a otro. Lleva movimiento.', NULL, '/Letters/enie.mp4', 'hard'),
  (17, 'O', 'Curva todos los dedos y junta sus puntas con la punta del pulgar, formando una O.', '/Letters/o.webp', NULL, 'easy'),
  (18, 'P', 'Extiende el índice y el medio con el pulgar tocando el medio, como en la K, pero con la mano apuntando hacia el frente y abajo.', '/Letters/p.webp', NULL, 'medium'),
  (19, 'Q', 'Curva el índice y el pulgar como un gancho apuntando hacia abajo, con los demás dedos cerrados, y mueve la mano hacia ti. Lleva movimiento.', NULL, '/Letters/Q.mp4', 'hard'),
  (20, 'R', 'Extiende el índice y el medio hacia arriba y cruza el medio sobre el índice, con los demás dedos cerrados.', '/Letters/r.webp', NULL, 'medium'),
  (21, 'S', 'Cierra la mano en puño con el pulgar cruzado por delante de los dedos.', '/Letters/s.webp', NULL, 'easy'),
  (22, 'T', 'Dobla el índice hasta que su punta toque la punta del pulgar y extiende los demás dedos juntos hacia arriba.', '/Letters/t.webp', NULL, 'medium'),
  (23, 'U', 'Extiende el índice y el medio juntos hacia arriba, con los demás dedos cerrados y el pulgar sobre ellos.', '/Letters/u.webp', NULL, 'easy'),
  (24, 'V', 'Extiende el índice y el medio separados hacia arriba formando una V, con los demás dedos cerrados.', '/Letters/v.webp', NULL, 'easy'),
  (25, 'W', 'Extiende el índice, el medio y el anular separados hacia arriba, con el meñique doblado bajo el pulgar.', '/Letters/w.webp', NULL, 'easy'),
  (26, 'X', 'Extiende el índice doblado como gancho, con los demás dedos cerrados, y jala la seña hacia tu cuerpo. Lleva movimiento.', NULL, '/Letters/X.mp4', 'hard'),
  (27, 'Y', 'Cierra la mano y extiende solo el pulgar y el meñique hacia los lados.', '/Letters/y.webp', NULL, 'easy'),
  (28, 'Z', 'Extiende el dedo índice y traza una Z en el aire. Lleva movimiento.', NULL, '/Letters/Z.mp4', 'hard')
ON CONFLICT (id) DO UPDATE SET
  letter = EXCLUDED.letter,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  video_url = EXCLUDED.video_url,
  difficulty = EXCLUDED.difficulty;

-- Como los ids se escribieron a mano, se ajusta el contador del SERIAL
-- para que la siguiente letra que se inserte sin id reciba el 29 y no choque
SELECT setval('letters_id_seq', (SELECT MAX(id) FROM letters));
