import { Asignatura } from '../../../dominio/entidades/Asignatura/Asignatura.js';
import type { IAsignaturaRepositorio } from '../../../dominio/interfaces/repositorio/IAsignaturaRepositorio.ts';
import type { ActualizarAsignaturaDTO } from '../Dtos/ActualizarAsignaturaDTO.js';

export class ActualizarAsignaturaUseCase {
  constructor(private readonly repositorio: IAsignaturaRepositorio) {}

  async execute(request: ActualizarAsignaturaDTO): Promise<Asignatura> {
    const asignaturaActual = await this.repositorio.findById(request.id);
    if (!asignaturaActual) {
      throw new Error(`404: Asignatura con ID ${request.id} no encontrada.`);
    }

    if (request.nombre !== asignaturaActual.nombre) {
      const asignaturaExistente = await this.repositorio.findByNombre(request.nombre);
      if (asignaturaExistente && asignaturaExistente.id !== request.id) {
        throw new Error(`409: Ya existe otra asignatura con el nombre: ${request.nombre}`);
      }
    }

    const asignaturaActualizada = new Asignatura(
      request.nombre,
      request.cargaHoraria,
      request.tipo,
      request.id,
      asignaturaActual.fechaCreacion,
    );
    
    return this.repositorio.save(asignaturaActualizada);
  }
}