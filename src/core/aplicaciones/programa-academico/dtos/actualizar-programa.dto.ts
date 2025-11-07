import { z } from 'zod';

// Schema de validación con Zod
export const actualizarProgramaSchema = z.object({
  nombre: z.string()
    .min(1, 'El nombre es obligatorio')
    .max(255, 'El nombre no puede exceder 255 caracteres')
    .trim(),
  descripcion: z.string()
    .min(1, 'La descripción es obligatoria')
    .trim()
});

export type ActualizarProgramaDto = z.infer<typeof actualizarProgramaSchema>;

