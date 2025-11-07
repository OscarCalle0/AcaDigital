import { TipoAsignatura } from '../../../dominio/entidades/Asignatura/Asignatura.js';

export interface ActualizarAsignaturaDTO {
  id: number;
  nombre: string;
  cargaHoraria: number;
  tipo: TipoAsignatura;
}