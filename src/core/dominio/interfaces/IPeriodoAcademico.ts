import type { EstadoPeriodo } from "../entidades/periodo-academico/EstadoPeriodo.js";
export interface IPeriodoAcademico {
    id: string;
    nombre: string;
    fechaInicio: Date;
    fechaFin: Date;
    estado: EstadoPeriodo;
    createdAt: Date;
    updatedAt: Date;
};