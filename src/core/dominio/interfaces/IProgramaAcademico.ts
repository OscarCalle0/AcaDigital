import type { NivelEducativo, Modalidad } from "../entidades/programa-academico/NivelYModalidad.js";
import type { Duracion } from "../entidades/programa-academico/Duracion.js";

export interface IProgramaAcademico{
    getId(): string;
    getNombre(): string;
    getDescripcion(): string;
    getNivelEducativo(): NivelEducativo;
    getModalidad(): Modalidad;
    getDuracion(): Duracion;
    actualizarInfoGeneral(nuevoNombre: string, nuevaDescripcion: string):void;
}

