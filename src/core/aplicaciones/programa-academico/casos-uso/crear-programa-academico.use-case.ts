import type { IProgramaAcademico } from '../../../dominio/interfaces/IProgramaAcademico.js';
import type { IProgramaAcademicoRepositorio } from '../../../dominio/repositorio/IProgramaAcademicoRepositorio.js';
import type { CrearProgramaDto } from '../dto/crear-programa.dto.js';
import { Duracion } from '../../../dominio/Programa-Academico/Duracion.js';
import { ProgramaAcademico } from '../../../dominio/Programa-Academico/ProgramaAcademico.js';

export class CrearProgramaAcademicoUseCase {
  constructor(private readonly programaRepository: IProgramaAcademicoRepositorio) {}
  async execute(dto: CrearProgramaDto): Promise<IProgramaAcademico> {
    const duracion = new Duracion(dto.duracionValor, dto.duracionUnidad);  
    const nuevoPrograma = new ProgramaAcademico(
      dto.nombre,
      dto.descripcion,
      dto.nivel,
      dto.modalidad,
      duracion
    );
    const programaCreado = await this.programaRepository.crear(nuevoPrograma);

    return programaCreado;
  }
}

