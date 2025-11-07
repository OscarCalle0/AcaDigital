import { PeriodoAcademico } from '../../../dominio/entidades/periodo-academico/PeriodoAcademico.js';
import type { IPeriodoAcademico } from '../../../dominio/interfaces/IPeriodoAcademico.js';
import type { IPeriodoRepositorio } from '../../../dominio/interfaces/repositorio/IPeriodoAcademicoRepositorio.js';
import type { ActualizarPeriodoDTO } from '../dtos/ActualizarPeriodoDTO.js';

export class ActualizarPeriodoUseCase {
    constructor(private repo: IPeriodoRepositorio) { };

    async ejecutar(id: string, input: ActualizarPeriodoDTO): Promise<IPeriodoAcademico> {
        const periodoProps = await this.repo.obtenerPorId(id);
        if (!periodoProps) {
            throw new Error('Periodo no encontrado');
        };

        const periodoEntidad = new PeriodoAcademico(periodoProps);

        // Validaciones
        if (input.nombre && input.nombre !== periodoEntidad.nombre) {
            const existe = await this.repo.obtenerPorNombre(input.nombre);
            if (existe) throw new Error('Nombre ya en uso');
            periodoEntidad.nombre = input.nombre;
        };

        if (input.fechaInicio) periodoEntidad.fechaInicio = new Date(input.fechaInicio);
        if (input.fechaFin) periodoEntidad.fechaFin = new Date(input.fechaFin);
        
        periodoEntidad.actualizarEstado();
        periodoEntidad.updatedAt = new Date();
        
        const cambios: Partial<IPeriodoAcademico> = {
            nombre: periodoEntidad.nombre,
            fechaInicio: periodoEntidad.fechaInicio,
            fechaFin: periodoEntidad.fechaFin,
            estado: periodoEntidad.estado,
            updatedAt: periodoEntidad.updatedAt
        };

        return await this.repo.actualizar(id, cambios);
    };
};