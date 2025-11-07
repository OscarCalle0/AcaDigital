import type { EstadoPeriodo } from "./EstadoPeriodo.js";
import type { IPeriodoAcademico } from "../../interfaces/IPeriodoAcademico.js";
import { randomUUID } from 'crypto';

export class PeriodoAcademico implements IPeriodoAcademico {
    public id: string;
    public nombre: string;
    public fechaInicio: Date;
    public fechaFin: Date;
    public estado: EstadoPeriodo;
    public createdAt: Date;
    public updatedAt: Date;

    // Constructor que acepta PROPIEDADES para facilitar la reconstrucción desde la DB
    constructor(props: {
        id?: string;
        nombre: string;
        fechaInicio: Date;
        fechaFin: Date;
        estado?: EstadoPeriodo;
        createdAt?: Date;
        updatedAt?: Date;
    }){
        this.id = props.id || randomUUID();
        this.nombre = props.nombre;
        this.fechaInicio = props.fechaInicio;
        this.fechaFin = props.fechaFin;
        
        // La lógica de estado se aplica si no se proporciona
        this.estado = props.estado || 'inactivo';

        this.createdAt = props.createdAt || new Date();
        this.updatedAt = props.updatedAt || new Date();
        
        // Llamada a lógica de dominio
        this.actualizarEstado();
    };

    actualizarEstado(): void {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const inicio = new Date(this.fechaInicio);
        const fin = new Date(this.fechaFin);
        
        if (hoy > fin) this.estado = 'cerrado';
        else if (hoy >= inicio && hoy <= fin) this.estado = 'activo';
        else this.estado = 'inactivo';
    };
};