import { IPlanEstudio } from "../../interfaces/IPlanEstudio.js";

export interface IPlanEstudioRepositorio {
    existeVinculo(programaId: string, asignaturaId: string): Promise<boolean>; 
    guardar(plan: IPlanEstudio): Promise<IPlanEstudio>;
};