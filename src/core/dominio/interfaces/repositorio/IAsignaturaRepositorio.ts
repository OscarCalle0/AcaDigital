import type { IAsignatura } from '../IAsignatura.js';

export interface IAsignaturaRepositorio {
  save(asignatura: IAsignatura): Promise<IAsignatura>;
  findById(id: number): Promise<IAsignatura | null>;
  findAll(): Promise<IAsignatura[]>;
  delete(id: number): Promise<void>;
  findByNombre(nombre: string): Promise<IAsignatura | null>;
}