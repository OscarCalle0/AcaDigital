// src/core/infraestructura/postgres/repositorio/asignatura.pg.repository.ts

import type { IAsignaturaRepositorio } from '../../../dominio/interfaces/repositorio/IAsignaturaRepositorio.js';
import { Asignatura, TipoAsignatura } from '../../../dominio/entidades/Asignatura/Asignatura.js';

// ⚠️ MOCK DE BASE DE DATOS EN MEMORIA PARA PRUEBAS
// Almacena los datos simulados
let dataStore: any[] = [];
let nextId = 1;

const pool = {
    query: async (sql: string, params: any[]): Promise<{ rows: any[] }> => {
        // --- 1. INSERT (CREATE) ---
        if (sql.includes('INSERT')) {
            const newRow = { 
                id: nextId++, 
                nombre: params[0], 
                carga_horaria: params[1], 
                tipo: params[2], 
                fecha_creacion: new Date(), 
                fecha_actualizacion: new Date() 
            };
            dataStore.push(newRow);
            return { rows: [newRow] }; // Devuelve el objeto insertado
        }
        
        // --- 2. SELECT (FIND) ---
        if (sql.includes('SELECT')) {
            // SELECT * FROM asignaturas WHERE id = $1
            if (sql.includes('WHERE id = $1')) {
                const id = params[0];
                const row = dataStore.find(r => r.id === id);
                return { rows: row ? [row] : [] };
            }
            // SELECT * FROM asignaturas WHERE nombre ILIKE $1
            if (sql.includes('WHERE nombre ILIKE $1')) {
                const nombre = params[0];
                const row = dataStore.find(r => r.nombre === nombre);
                return { rows: row ? [row] : [] };
            }
            // SELECT * FROM asignaturas (FIND ALL)
            return { rows: dataStore };
        }
        
        // --- 3. UPDATE ---
        if (sql.includes('UPDATE')) {
            const [nombre, carga_horaria, tipo, id] = params;
            const index = dataStore.findIndex(r => r.id === id);
            
            if (index !== -1) {
                const updatedRow = { 
                    ...dataStore[index],
                    nombre,
                    carga_horaria,
                    tipo,
                    fecha_actualizacion: new Date()
                };
                dataStore[index] = updatedRow;
                return { rows: [updatedRow] }; // Devuelve la fila actualizada
            }
            return { rows: [] };
        }
        
        // --- 4. DELETE ---
        if (sql.includes('DELETE')) {
            const id = params[0];
            const initialLength = dataStore.length;
            dataStore = dataStore.filter(r => r.id !== id);
            // Devuelve algo para simular el éxito, no importa si es vacío
            return { rows: [] }; 
        }

        return { rows: [] };
    },
};
// FIN DEL MOCK

export class AsignaturaPGRepository implements IAsignaturaRepositorio {
    // La función de mapeo es correcta porque estás usando row.carga_horaria, que es lo que devuelve el mock
    private mapRowToAsignatura(row: any): Asignatura {
        return new Asignatura(
            row.nombre,
            row.carga_horaria, // El mock devuelve carga_horaria (snake_case)
            row.tipo as TipoAsignatura,
            row.id,
            new Date(row.fecha_creacion),
            new Date(row.fecha_actualizacion),
        );
    }

    async save(asignatura: Asignatura): Promise<Asignatura> {
        // ... (Tu lógica SQL anterior, que ahora usa el mock de 'pool')
        if (asignatura.id) {
            const sql = `
                UPDATE asignaturas 
                SET nombre = $1, carga_horaria = $2, tipo = $3, fecha_actualizacion = NOW()
                WHERE id = $4
                RETURNING *;
            `;
            const values = [asignatura.nombre, asignatura.cargaHoraria, asignatura.tipo, asignatura.id];
            const result = await pool.query(sql, values);
            return this.mapRowToAsignatura(result.rows[0]);
        } else {
            const sql = `
                INSERT INTO asignaturas (nombre, carga_horaria, tipo)
                VALUES ($1, $2, $3)
                RETURNING *;
            `;
            const values = [asignatura.nombre, asignatura.cargaHoraria, asignatura.tipo];
            const result = await pool.query(sql, values);
            return this.mapRowToAsignatura(result.rows[0]);
        }
    }

    async findById(id: number): Promise<Asignatura | null> {
        const sql = 'SELECT * FROM asignaturas WHERE id = $1;';
        const result = await pool.query(sql, [id]);
        if (result.rows.length === 0) return null;
        return this.mapRowToAsignatura(result.rows[0]);
    }

    async findAll(): Promise<Asignatura[]> {
        const sql = 'SELECT * FROM asignaturas ORDER BY nombre;';
        const result = await pool.query(sql, []);
        return result.rows.map(this.mapRowToAsignatura);
    }

    async delete(id: number): Promise<void> {
        const sql = 'DELETE FROM asignaturas WHERE id = $1;';
        await pool.query(sql, [id]);
    }

    async findByNombre(nombre: string): Promise<Asignatura | null> {
        const sql = 'SELECT * FROM asignaturas WHERE nombre ILIKE $1;';
        const result = await pool.query(sql, [nombre]);
        if (result.rows.length === 0) return null;
        return this.mapRowToAsignatura(result.rows[0]);
    }
}