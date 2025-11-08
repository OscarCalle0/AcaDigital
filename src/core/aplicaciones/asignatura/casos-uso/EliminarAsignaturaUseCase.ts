import type { IAsignaturaRepositorio } from '../../../dominio/interfaces/repositorio/IAsignaturaRepositorio.js';

export class EliminarAsignaturaUseCase {
    constructor(private readonly repositorio: IAsignaturaRepositorio) {}

    async execute(id: number): Promise<void> {
        const existe = await this.repositorio.findById(id);
        if (!existe) {
            throw new Error(`404: Asignatura con ID ${id} no encontrada.`);
        }
        
        await this.repositorio.delete(id);
    }
}