import type { IProgramaAcademico } from "../../interfaces/IProgramaAcademico.js";
import { NivelEducativo, Modalidad } from "./NivelYModalidad.js";
import { Duracion } from "./Duracion.js";
import { randomUUID } from "crypto";

export class ProgramaAcademico implements IProgramaAcademico{
    private readonly id: string;
    private nombre: string;
    private descripcion: string;
    private readonly nivel: NivelEducativo;
    private readonly modalidad: Modalidad;
    private readonly duracion: Duracion;

    constructor(
        nombre: string,
        descripcion: string,
        nivel: NivelEducativo,
        modalidad: Modalidad,
        duracion: Duracion,
        id?: string
    ){
    if (!nombre || nombre.trim().length === 0) {
      throw new Error('El nombre del programa académico es obligatorio.');
    }
    if (nombre.length > 255) {
      throw new Error('El nombre del programa académico no puede exceder 255 caracteres.');
    }
    if (!descripcion || descripcion.trim().length === 0) {
      throw new Error('La descripción del programa académico es obligatoria.');
    }

    this.id = id ?? this.generarId();
    this.nombre = nombre.trim();
    this.descripcion = descripcion.trim();
    this.nivel = nivel;
    this.modalidad = modalidad;
    this.duracion = duracion;
    }

    public getId(): string {
        return this.id;
    }

    public getNombre(): string {
        return this.nombre;
    }

    public getDescripcion(): string {
        return this.descripcion;
    }

    public getNivelEducativo(): NivelEducativo {
        return this.nivel;
    }

    public getModalidad(): Modalidad {
        return this.modalidad;
    }

    public getDuracion(): Duracion {
        return this.duracion;
    }

  public actualizarInfoGeneral(nuevoNombre: string, nuevaDescripcion: string): void {
    if (!nuevoNombre || nuevoNombre.trim().length === 0) {
      throw new Error('El nuevo nombre del programa académico es obligatorio.');
    }
    if (!nuevaDescripcion || nuevaDescripcion.trim().length === 0) {
      throw new Error('La nueva descripción del programa académico es obligatoria.');
    }
    
    this.nombre = nuevoNombre;
    this.descripcion = nuevaDescripcion;
  }

  // --- Método privado auxiliar ---
  private generarId(): string {
    return randomUUID();
  }
}

