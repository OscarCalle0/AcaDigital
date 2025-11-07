import { TipoAsignatura } from '../../../../dominio/entidades/Asignatura/Asignatura.js';

export interface CrearAsignaturaDTO {
  nombre: string;
  cargaHoraria: number;
  tipo: TipoAsignatura;
}