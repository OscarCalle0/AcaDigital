import type { IPeriodoAcademico } from '../IPeriodoAcademico.js';

export interface IPeriodoRepositorio {
    guardar(periodo: IPeriodoAcademico): Promise<IPeriodoAcademico>; // crear
    obtenerPorNombre(nombre: string): Promise<IPeriodoAcademico | null>;
    obtenerPorId(id: string): Promise<IPeriodoAcademico | null>;
    obtenerTodos(filtro?: { estado?: string }): Promise<IPeriodoAcademico[]>;
    actualizar(id: string, data: Partial<IPeriodoAcademico>): Promise<IPeriodoAcademico>;
    eliminar(id: string): Promise<void>;
};