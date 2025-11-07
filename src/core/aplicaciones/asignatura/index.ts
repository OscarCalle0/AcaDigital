export * from './casos-uso/CrearAsignaturaUseCase.js';
export * from './casos-uso/ObtenerAsignaturasUseCase.js';
export * from './casos-uso/ObtenerAsignaturaPorIdUseCase.js';
export * from './casos-uso/ActualizarAsignaturaUseCase.js';
export * from './casos-uso/EliminarAsignaturaUseCase.js';

import type { CrearAsignaturaDTO } from './Dtos/CrearAsignaturaDTO.js';
import type { ActualizarAsignaturaDTO } from './Dtos/ActualizarAsignaturaDTO.js';

export type { CrearAsignaturaDTO, ActualizarAsignaturaDTO };