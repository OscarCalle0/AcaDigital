import { Asignatura } from '../../../dominio/entidades/Asignatura/Asignatura.js';
import type { IAsignaturaRepositorio } from '../../../dominio/interfaces/repositorio/IAsignaturaRepositorio.js';


export class ObtenerAsignaturaPorIdUseCase {
  constructor(private readonly repositorio: IAsignaturaRepositorio) {}

  async findById(id: number): Promise<Asignatura | null> {
  return this.repositorio.findById(id);
 }
}