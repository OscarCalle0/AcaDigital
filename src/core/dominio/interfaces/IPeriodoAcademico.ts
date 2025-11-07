import type { EstadoPeriodo } from "../entidades/Periodo-Academico/EstadoPeriodo.js";
export interface IPeriodoAcademico {
    id: string;
    nombre: string;
    fechaInicio: Date;
    fechaFin: Date;
    estado: EstadoPeriodo;
    createdAt: Date;
    updatedAt: Date;
};