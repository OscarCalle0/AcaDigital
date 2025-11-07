export enum TipoAsignatura {
  TEORICA = 'teorica',
  PRACTICA = 'practica',
  MIXTA = 'mixta',
}

export class Asignatura {
  readonly id: number | null;
  nombre: string;
  cargaHoraria: number;
  tipo: TipoAsignatura;
  readonly fechaCreacion: Date;
  fechaActualizacion: Date;

  constructor(
    nombre: string,
    cargaHoraria: number,
    tipo: TipoAsignatura,
    id: number | null = null,
    fechaCreacion: Date = new Date(),
    fechaActualizacion: Date = new Date(),
  ) {
    
    if (!nombre || nombre.length < 3) {
      throw new Error('El nombre de la asignatura es obligatorio y debe tener al menos 3 caracteres.');
    }
    if (cargaHoraria <= 0 || !Number.isInteger(cargaHoraria)) {
      throw new Error('La carga horaria debe ser un número entero positivo.');
    }
    if (!Object.values(TipoAsignatura).includes(tipo)) {
      throw new Error(`El tipo de asignatura debe ser uno de: ${Object.values(TipoAsignatura).join(', ')}.`);
    }

    this.id = id;
    this.nombre = nombre;
    this.cargaHoraria = cargaHoraria;
    this.tipo = tipo;
    this.fechaCreacion = fechaCreacion;
    this.fechaActualizacion = fechaActualizacion;
  }
}