import type { NivelEducativo, Modalidad } from "../Programa-Academico/NivelYModalidad";
import type { Duracion } from "../Programa-Academico/Duracion.js";

export interface IProgramaAcademico{
    getId(): string;
    getNombre(): string;
    getDescripcion(): string;
    getNivelEducativo(): NivelEducativo;
    getModalidad(): Modalidad;
    getDuracion(): Duracion;
    actualizarInfoGeneral(nuevoNombre: string, nuevaDescripcion: string):void;
}

