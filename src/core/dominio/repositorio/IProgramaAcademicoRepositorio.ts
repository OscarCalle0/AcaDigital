import type { IProgramaAcademico as ProgramaAcademicoType } from "../interfaces/IProgramaAcademico.js";

export interface IProgramaAcademicoRepositorio {
    crear(programa: ProgramaAcademicoType):
    Promise<ProgramaAcademicoType>;
    obtenerPorId(id: string):
    Promise<ProgramaAcademicoType | null>;
    obtenerTodos():
    Promise<ProgramaAcademicoType[]>;
    actualizar(id: string, programa: ProgramaAcademicoType):
    Promise<ProgramaAcademicoType>;
    eliminar(id: string):
    Promise<void>;
}
