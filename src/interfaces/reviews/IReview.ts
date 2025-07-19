export interface IReview {
  /** Identificador único de la reseña */
  id: number;

  /** Modelo reseñable (e.g. "product", "course") */
  content_type: string;

  /** ID del objeto al que pertenece la reseña */
  object_id: number;

  /** Representación en texto del objeto reseñado */
  content_object: string;

  /** Nombre o representación del usuario que creó la reseña */
  user: string;

  /** Calificación de 1 a 5 */
  rating: 1 | 2 | 3 | 4 | 5;

  /** Título breve de la reseña */
  title: string;

  /** Texto completo de la reseña (puede estar vacío) */
  body: string;

  /** Visibilidad pública de la reseña */
  is_active: boolean;

  /** Fecha de creación en formato ISO */
  created_at: string;

  /** Fecha de última actualización en formato ISO */
  updated_at: string;
}
