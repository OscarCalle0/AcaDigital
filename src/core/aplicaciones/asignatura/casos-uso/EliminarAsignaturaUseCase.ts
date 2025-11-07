import type { IAsignaturaRepositorio } from '../../../dominio/interfaces/repositorio/IAsignaturaRepositorio.js';

export class EliminarAsignaturaUseCase {
  constructor(private readonly repositorio: IAsignaturaRepositorio) {}

  async execute(id: number): Promise<void> {
    const asignaturaExistente = await this.repositorio.findById(id);
    if (!asignaturaExistente) {
      throw new Error(`404: Asignatura con ID ${id} no encontrada para eliminar.`);
    }
    await this.repositorio.delete(id);
  }
}