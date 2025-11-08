export interface ActualizarAsignaturaDTO {
    id: number;
    nombre: string;
    cargaHoraria: number;
    tipo: 'teorica' | 'practica' | 'mixta';
}