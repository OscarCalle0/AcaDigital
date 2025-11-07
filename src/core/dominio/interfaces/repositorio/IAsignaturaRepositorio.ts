import { Asignatura } from '../../entidades/asignatura/Asignatura.js';

export interface IAsignaturaRepositorio {
  save(asignatura: Asignatura): Promise<Asignatura>;
  findById(id: number): Promise<Asignatura | null>;
  findAll(): Promise<Asignatura[]>;
  delete(id: number): Promise<void>;
  findByNombre(nombre: string): Promise<Asignatura | null>; 
}