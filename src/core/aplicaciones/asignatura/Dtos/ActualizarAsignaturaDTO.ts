import { TipoAsignatura } from '../../../dominio/entidades/asignatura/Asignatura.js';

export interface ActualizarAsignaturaDTO {
  id: number;
  nombre: string;
  cargaHoraria: number;
  tipo: TipoAsignatura;
}