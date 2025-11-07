
import type { IPeriodoAcademico } from '../../../dominio/interfaces/IPeriodoAcademico.js';
import type { IPeriodoRepositorio } from '../../../dominio/interfaces/repositorio/IPeriodoAcademicoRepositorio.js';

export class ObtenerPeriodosUseCase {
    constructor(private repo: IPeriodoRepositorio) { };
    async ejecutar(filtro?: { estado?: string }): Promise<IPeriodoAcademico[]> {
        return await this.repo.obtenerTodos(filtro);
    };
};