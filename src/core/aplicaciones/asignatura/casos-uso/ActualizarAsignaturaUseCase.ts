import type { IAsignaturaRepositorio } from '../../../dominio/interfaces/repositorio/IAsignaturaRepositorio.js';
import type { ActualizarAsignaturaDTO } from '../dtos/ActualizarAsignaturaDTO.js';
import { TipoAsignatura } from '../../../dominio/entidades/asignatura/Asignatura.js';
import type { IAsignatura } from '../../../dominio/interfaces/IAsignatura.js';

export class ActualizarAsignaturaUseCase {
    constructor(private readonly repositorio: IAsignaturaRepositorio) {}

    async execute(dto: ActualizarAsignaturaDTO): Promise<IAsignatura> {
        const asignaturaExistente = await this.repositorio.findById(dto.id);
        if (!asignaturaExistente) {
            throw new Error(`404: Asignatura con ID ${dto.id} no encontrada.`);
        }

        if (dto.nombre !== asignaturaExistente.getNombre()) {
            const conMismoNombre = await this.repositorio.findByNombre(dto.nombre);
            
            if (conMismoNombre && conMismoNombre.getId() !== dto.id) {
                throw new Error(`409: La asignatura con nombre '${dto.nombre}' ya existe.`);
            }
        }
        
        asignaturaExistente.actualizarInformacion(
            dto.nombre,
            dto.cargaHoraria,
            dto.tipo as TipoAsignatura
        );

        return this.repositorio.save(asignaturaExistente);
    }
}