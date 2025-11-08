import type { TipoAsignatura } from "../entidades/asignatura/Asignatura.js";

export interface IAsignatura {
    getId(): number;
    getNombre(): string;
    getCargaHoraria(): number;
    getTipo(): TipoAsignatura;
    getFechaCreacion(): Date;
    getFechaActualizacion(): Date;

    actualizarInformacion(
        nuevoNombre: string,
        nuevaCargaHoraria: number,
        nuevoTipo: TipoAsignatura
    ): void;
}