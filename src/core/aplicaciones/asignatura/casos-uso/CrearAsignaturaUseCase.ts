import { Asignatura, TipoAsignatura } from '../../../dominio/entidades/asignatura/Asignatura.js';
import type { IAsignaturaRepositorio } from '../../../dominio/interfaces/repositorio/IAsignaturaRepositorio.js';
import type { CrearAsignaturaDTO } from '../dtos/CrearAsignaturaDTO.js';
import type { IAsignatura } from '../../../dominio/interfaces/IAsignatura.js';

export class CrearAsignaturaUseCase {
    constructor(private readonly repositorio: IAsignaturaRepositorio) {}

    async execute(dto: CrearAsignaturaDTO): Promise<IAsignatura> {
        const existe = await this.repositorio.findByNombre(dto.nombre);
        if (existe) {
            throw new Error(`409: La asignatura con nombre '${dto.nombre}' ya existe.`); 
        }

        const nuevaAsignatura = new Asignatura(
            dto.nombre,
            dto.cargaHoraria,
            dto.tipo as TipoAsignatura 
        );

        return this.repositorio.save(nuevaAsignatura);
    }
}