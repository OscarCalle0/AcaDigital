// Unidades de duración válidas
export const UNIDADES_DURACION_VALIDAS = ['meses', 'años', 'semestres', 'trimestres'] as const;
export type UnidadDuracion = typeof UNIDADES_DURACION_VALIDAS[number];

export class Duracion{
    private readonly valor: number;
    private readonly unidad: string;

    constructor(valor: number, unidad: string){
    if (valor <=0){
        throw new Error("El valor de la duración debe ser positivo");
    }
    if (!UNIDADES_DURACION_VALIDAS.includes(unidad as UnidadDuracion)) {
        throw new Error(`La unidad de duración debe ser una de: ${UNIDADES_DURACION_VALIDAS.join(', ')}`);
    }
    this.valor = valor;
    this.unidad = unidad;
    }

    getValor(): number{
        return this.valor;
    }

    getUnidad(): string{
        return this.unidad;
    }

    toString(): string{
        return `${this.valor} ${this.unidad}`;
    }
}

