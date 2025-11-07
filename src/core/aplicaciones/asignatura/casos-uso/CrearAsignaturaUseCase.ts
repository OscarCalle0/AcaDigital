import { Asignatura } from '../../../dominio/entidades/asignatura/Asignatura.js';
import type { IAsignaturaRepositorio } from '../../../dominio/interfaces/repositorio/IAsignaturaRepositorio.js';
import type { CrearAsignaturaDTO } from '../dtos/CrearAsignaturaDTO.js';

export class CrearAsignaturaUseCase {
  constructor(private readonly repositorio: IAsignaturaRepositorio) {}

  async execute(request: CrearAsignaturaDTO): Promise<Asignatura> {
    const asignaturaExistente = await this.repositorio.findByNombre(request.nombre);
    if (asignaturaExistente) {
      throw new Error(`409: Ya existe una asignatura con el nombre: ${request.nombre}`);
    }

    const nuevaAsignatura = new Asignatura(request.nombre, request.cargaHoraria, request.tipo);

    return this.repositorio.save(nuevaAsignatura);
  }
}