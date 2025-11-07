import { z } from 'zod';
import { Modalidad, NivelEducativo } from "../../../dominio/entidades/programa-academico/NivelYModalidad.js";

// Schema de validación con Zod
export const crearProgramaSchema = z.object({
  nombre: z.string()
    .min(1, 'El nombre es obligatorio')
    .max(255, 'El nombre no puede exceder 255 caracteres')
    .trim(),
  descripcion: z.string()
    .min(1, 'La descripción es obligatoria')
    .trim(),
  nivel: z.nativeEnum(NivelEducativo, {
    message: 'El nivel educativo debe ser uno de: Técnico, Pregrado, Posgrado, Doctorado'
  }),
  modalidad: z.nativeEnum(Modalidad, {
    message: 'La modalidad debe ser una de: Presencial, Virtual, Semi-Presencial'
  }),
  duracionValor: z.number()
    .int('El valor de la duración debe ser un número entero')
    .positive('El valor de la duración debe ser mayor a 0'),
  duracionUnidad: z.enum(['meses', 'años', 'semestres', 'trimestres'], {
    message: 'La unidad de duración debe ser una de: meses, años, semestres, trimestres'
  })
});

export type CrearProgramaDto = z.infer<typeof crearProgramaSchema>;

