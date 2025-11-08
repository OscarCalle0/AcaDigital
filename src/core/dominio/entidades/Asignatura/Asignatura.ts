import type { IAsignatura } from "../../interfaces/IAsignatura.js";

export enum TipoAsignatura {
    TEORICA = "teorica",
    PRACTICA = "practica",
    MIXTA = "mixta",
}

export class Asignatura implements IAsignatura {
    private readonly id: number;
    private nombre: string;
    private cargaHoraria: number;
    private tipo: TipoAsignatura;
    private readonly fechaCreacion: Date;
    private fechaActualizacion: Date;

    constructor(
        nombre: string,
        cargaHoraria: number,
        tipo: TipoAsignatura,
        id?: number,
        fechaCreacion?: Date,
        fechaActualizacion?: Date,
    ) {
        if (!nombre || nombre.trim().length < 3) {
            throw new Error('El nombre de la asignatura debe tener al menos 3 caracteres.');
        }
        if (cargaHoraria <= 0) {
            throw new Error('La carga horaria debe ser un valor positivo (AC3).');
        }

        this.id = id || 0;
        this.nombre = nombre.trim();
        this.cargaHoraria = cargaHoraria;
        this.tipo = tipo;
        this.fechaCreacion = fechaCreacion || new Date();
        this.fechaActualizacion = fechaActualizacion || new Date();
    }

    public getId(): number { return this.id; }
    public getNombre(): string { return this.nombre; }
    public getCargaHoraria(): number { return this.cargaHoraria; }
    public getTipo(): TipoAsignatura { return this.tipo; }
    public getFechaCreacion(): Date { return this.fechaCreacion; }
    public getFechaActualizacion(): Date { return this.fechaActualizacion; }

    public actualizarInformacion(
        nuevoNombre: string,
        nuevaCargaHoraria: number,
        nuevoTipo: TipoAsignatura
    ): void {
        if (!nuevoNombre || nuevoNombre.trim().length < 3) {
            throw new Error('El nuevo nombre de la asignatura es obligatorio.');
        }
        if (nuevaCargaHoraria <= 0) {
            throw new Error('La nueva carga horaria debe ser un valor positivo.');
        }

        this.nombre = nuevoNombre.trim();
        this.cargaHoraria = nuevaCargaHoraria;
        this.tipo = nuevoTipo;
        this.fechaActualizacion = new Date();
    }
}