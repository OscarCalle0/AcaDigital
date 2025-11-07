// Casos de uso
export { CrearProgramaAcademicoUseCase } from './casos-uso/crear-programa-academico.use-case.js';
export { ListarProgramasAcademicosUseCase } from './casos-uso/listar-programas-academicos.use-case.js';
export { ObtenerProgramaAcademicoPorIdUseCase } from './casos-uso/obtener-programa-academico-por-id.use-case.js';
export { ActualizarProgramaAcademicoUseCase } from './casos-uso/actualizar-programa-academico.use-case.js';
export { EliminarProgramaAcademicoUseCase } from './casos-uso/eliminar-programa-academico.use-case.js';

// DTOs y Schemas
export { 
  crearProgramaSchema, 
  type CrearProgramaDto 
} from './dtos/crear-programa.dto.js';

export { 
  actualizarProgramaSchema, 
  type ActualizarProgramaDto 
} from './dtos/actualizar-programa.dto.js';

