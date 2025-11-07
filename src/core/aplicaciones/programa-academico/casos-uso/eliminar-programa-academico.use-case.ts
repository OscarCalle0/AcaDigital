import type { IProgramaAcademicoRepositorio } from '../../../dominio/interfaces/repositorio/IProgramaAcademicoRepositorio.js';

export class EliminarProgramaAcademicoUseCase {
  constructor(private readonly programaRepository: IProgramaAcademicoRepositorio) {}

  async execute(id: string): Promise<void> {
    if (!id || id.trim().length === 0) {
      throw new Error('El ID del programa académico es obligatorio.');
    }

    const programaExistente = await this.programaRepository.obtenerPorId(id);
    if (!programaExistente) {
      throw new Error('Programa académico no encontrado.');
    }

    await this.programaRepository.eliminar(id);
  }
}

