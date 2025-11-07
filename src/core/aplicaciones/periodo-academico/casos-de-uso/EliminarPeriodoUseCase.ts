import type { IPeriodoRepositorio } from '../../../dominio/interfaces/repositorio/IPeriodoAcademicoRepositorio.js';

export class EliminarPeriodoUseCase {
    constructor(private repo: IPeriodoRepositorio) { };

    async ejecutar(id: string): Promise<void> {
        const existe = await this.repo.obtenerPorId(id);
        if (!existe) {
            throw new Error('Periodo no encontrado');
        };
        await this.repo.eliminar(id);
    };
};