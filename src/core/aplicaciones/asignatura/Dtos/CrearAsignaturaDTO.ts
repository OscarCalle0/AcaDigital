export interface CrearAsignaturaDTO {
    nombre: string;
    cargaHoraria: number;
    tipo: 'teorica' | 'practica' | 'mixta';
}