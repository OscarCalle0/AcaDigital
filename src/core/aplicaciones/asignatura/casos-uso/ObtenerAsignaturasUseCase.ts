import type { IAsignaturaRepositorio } from '../../../dominio/interfaces/repositorio/IAsignaturaRepositorio.js';
import type { IAsignatura } from '../../../dominio/interfaces/IAsignatura.js';

export class ObtenerAsignaturasUseCase {
    constructor(private readonly repositorio: IAsignaturaRepositorio) {}
    
    async findAll(): Promise<IAsignatura[]> {
        return this.repositorio.findAll();
    }
}