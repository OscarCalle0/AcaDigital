// src/core/infraestructura/postgres/repositorio/asignatura.pg.repository.ts

import type { IAsignaturaRepositorio } from '../../../dominio/interfaces/repositorio/IAsignaturaRepositorio.js';
import { Asignatura, TipoAsignatura } from '../../../dominio/entidades/asignatura/Asignatura.js';
import type { IAsignatura } from '../../../dominio/interfaces/IAsignatura.js'; 

// ⚠️ MOCK DE BASE DE DATOS EN MEMORIA (SOLO PARA PRUEBAS INICIALES)
let almacenDeDatos: any[] = [];
let proximoId = 1;

const poolDeConexiones = {
    query: async (sql: string, parametros: any[]): Promise<{ rows: any[] }> => {
        if (sql.includes('INSERT')) {
            const nuevaFila = { 
                id: proximoId++, 
                nombre: parametros[0], 
                carga_horaria: parametros[1], // snake_case simulando la DB
                tipo: parametros[2], 
                fecha_creacion: new Date(), 
                fecha_actualizacion: new Date() 
            };
            almacenDeDatos.push(nuevaFila);
            return { rows: [nuevaFila] };
        }
        
        if (sql.includes('SELECT')) {
            if (sql.includes('WHERE id = $1')) {
                const fila = almacenDeDatos.find(r => r.id === parametros[0]);
                return { rows: fila ? [fila] : [] };
            }
            if (sql.includes('WHERE nombre ILIKE $1')) {
                const fila = almacenDeDatos.find(r => r.nombre === parametros[0]);
                return { rows: fila ? [fila] : [] };
            }
            return { rows: almacenDeDatos };
        }
        
        if (sql.includes('UPDATE')) {
            const [nombre, carga_horaria, tipo, id] = parametros;
            const indice = almacenDeDatos.findIndex(r => r.id === id);
            
            if (indice !== -1) {
                const filaActualizada = { 
                    ...almacenDeDatos[indice],
                    nombre,
                    carga_horaria,
                    tipo,
                    fecha_actualizacion: new Date()
                };
                almacenDeDatos[indice] = filaActualizada;
                return { rows: [filaActualizada] };
            }
            return { rows: [] };
        }
        
        if (sql.includes('DELETE')) {
            almacenDeDatos = almacenDeDatos.filter(r => r.id !== parametros[0]);
            return { rows: [] };
        }
        return { rows: [] };
    },
};

export class AsignaturaPGRepository implements IAsignaturaRepositorio {
    // Mapeo: traduce la fila de la DB (snake_case) a la Entidad (camelCase)
    private mapearFilaAAsignatura(fila: any): IAsignatura {
        return new Asignatura(
            fila.nombre,
            fila.carga_horaria, // Aquí se mapea 'carga_horaria' a 'cargaHoraria' del constructor
            fila.tipo as TipoAsignatura,
            fila.id,
            new Date(fila.fecha_creacion),
            new Date(fila.fecha_actualizacion),
        );
    }

    async save(asignatura: IAsignatura): Promise<IAsignatura> {
        if (asignatura.getId()) {
            const sql = `UPDATE asignaturas SET nombre = $1, carga_horaria = $2, tipo = $3, fecha_actualizacion = NOW() WHERE id = $4 RETURNING *;`;
            const valores = [asignatura.getNombre(), asignatura.getCargaHoraria(), asignatura.getTipo(), asignatura.getId()];
            const resultado = await poolDeConexiones.query(sql, valores);
            return this.mapearFilaAAsignatura(resultado.rows[0]);
        } else {
            const sql = `INSERT INTO asignaturas (nombre, carga_horaria, tipo) VALUES ($1, $2, $3) RETURNING *;`;
            const valores = [asignatura.getNombre(), asignatura.getCargaHoraria(), asignatura.getTipo()];
            const resultado = await poolDeConexiones.query(sql, valores);
            return this.mapearFilaAAsignatura(resultado.rows[0]);
        }
    }

    async findById(id: number): Promise<IAsignatura | null> {
        const sql = 'SELECT * FROM asignaturas WHERE id = $1;';
        const resultado = await poolDeConexiones.query(sql, [id]);
        if (resultado.rows.length === 0) return null;
        return this.mapearFilaAAsignatura(resultado.rows[0]);
    }

    async findAll(): Promise<IAsignatura[]> {
        const sql = 'SELECT * FROM asignaturas ORDER BY nombre;';
        const resultado = await poolDeConexiones.query(sql, []);
        return resultado.rows.map(this.mapearFilaAAsignatura);
    }

    async delete(id: number): Promise<void> {
        const sql = 'DELETE FROM asignaturas WHERE id = $1;';
        await poolDeConexiones.query(sql, [id]);
    }

    async findByNombre(nombre: string): Promise<IAsignatura | null> {
        const sql = 'SELECT * FROM asignaturas WHERE nombre ILIKE $1;';
        const resultado = await poolDeConexiones.query(sql, [nombre]);
        if (resultado.rows.length === 0) return null;
        return this.mapearFilaAAsignatura(resultado.rows[0]);
    }
}