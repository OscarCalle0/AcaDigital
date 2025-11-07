import type { IProgramaAcademico } from '../../../dominio/interfaces/IProgramaAcademico.js';
import type { IProgramaAcademicoRepositorio } from '../../../dominio/interfaces/repositorio/IProgramaAcademicoRepositorio.js';

export class ObtenerProgramaAcademicoPorIdUseCase {
  constructor(private readonly programaRepository: IProgramaAcademicoRepositorio) {}

  async execute(id: string): Promise<IProgramaAcademico | null> {
    return this.programaRepository.obtenerPorId(id);
  }
}

