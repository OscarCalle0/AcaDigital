
import type { IPeriodoAcademico } from '../../../dominio/interfaces/IPeriodoAcademico.js';
import type { IPeriodoRepositorio } from '../../../dominio/interfaces/repositorio/IPeriodoAcademicoRepositorio.js';

export class ObtenerPeriodoPorIdUseCase {
    constructor(private repositorio: IPeriodoRepositorio) {}
    async ejecutar(id: string): Promise<IPeriodoAcademico | null> {
        return await this.repositorio.obtenerPorId(id);
    };
};