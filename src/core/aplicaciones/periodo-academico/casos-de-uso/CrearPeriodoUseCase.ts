import { PeriodoAcademico } from '../../../dominio/entidades/periodo-academico/PeriodoAcademico.js';
import type { IPeriodoAcademico } from '../../../dominio/interfaces/IPeriodoAcademico.js'; 
import type { IPeriodoRepositorio } from '../../../dominio/interfaces/repositorio/IPeriodoAcademicoRepositorio.js';
import type { CrearPeriodoDTO} from '../dtos/CrearPeriodoDTO.js';

export class CrearPeriodoUseCase {
    constructor(private repo: IPeriodoRepositorio) { };

    async ejecutar(input: CrearPeriodoDTO): Promise<IPeriodoAcademico> {
        const { nombre, fechaInicio, fechaFin } = input;
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);

        if (fin <= inicio) {
            throw new Error('fechaFin debe ser posterior a fechaInicio');
        };

        const existe = await this.repo.obtenerPorNombre(nombre); 
        if (existe) {
            throw new Error('Ya existe un periodo con ese nombre');
        };
        const periodoEntidad = new PeriodoAcademico({

            nombre,
            fechaInicio: inicio,
            fechaFin: fin,
        });

        return await this.repo.guardar(periodoEntidad);
    };
};