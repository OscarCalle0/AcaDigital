import { Asignatura } from '../../../dominio/entidades/asignatura/Asignatura.js';
import type { IAsignaturaRepositorio } from '../../../dominio/interfaces/repositorio/IAsignaturaRepositorio.js';

export class ObtenerAsignaturasUseCase {
  constructor(private readonly repositorio: IAsignaturaRepositorio) {}

  async findAll(): Promise<Asignatura[]> {
    return this.repositorio.findAll();
  }
  
  async findById(id: number): Promise<Asignatura | null> {
    return this.repositorio.findById(id);
  }
}