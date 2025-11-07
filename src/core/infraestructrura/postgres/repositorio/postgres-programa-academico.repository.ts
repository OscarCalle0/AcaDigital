import { Pool, QueryResult } from 'pg';
import type { IProgramaAcademicoRepositorio } from '../../../dominio/repositorio/IProgramaAcademicoRepositorio.js';
import type { IProgramaAcademico } from '../../../dominio/interfaces/IProgramaAcademico.js';
import { ProgramaAcademico } from '../../../dominio/Programa-Academico/ProgramaAcademico.js';
import { Duracion } from '../../../dominio/Programa-Academico/Duracion.js';
import { NivelEducativo, Modalidad } from '../../../dominio/Programa-Academico/NivelYModalidad.js';

export class PostgresProgramaAcademicoRepository implements IProgramaAcademicoRepositorio {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'acadigital',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
    });
  }

  async crear(programa: IProgramaAcademico): Promise<IProgramaAcademico> {
    const query = `
      INSERT INTO programas_academicos 
      (id, nombre, descripcion, nivel, modalidad, duracion_valor, duracion_unidad)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const values = [
      programa.getId(),
      programa.getNombre(),
      programa.getDescripcion(),
      programa.getNivelEducativo(),
      programa.getModalidad(),
      programa.getDuracion().getValor(),
      programa.getDuracion().getUnidad()
    ];

    const result: QueryResult = await this.pool.query(query, values);
    return this.mapRowToProgramaAcademico(result.rows[0]);
  }

  async obtenerPorId(id: string): Promise<IProgramaAcademico | null> {
    const query = 'SELECT * FROM programas_academicos WHERE id = $1';
    const result: QueryResult = await this.pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.mapRowToProgramaAcademico(result.rows[0]);
  }

  async obtenerTodos(): Promise<IProgramaAcademico[]> {
    const query = 'SELECT * FROM programas_academicos ORDER BY created_at DESC';
    const result: QueryResult = await this.pool.query(query);
    
    return result.rows.map(row => this.mapRowToProgramaAcademico(row));
  }

  async actualizar(id: string, programa: IProgramaAcademico): Promise<IProgramaAcademico> {
    const query = `
      UPDATE programas_academicos 
      SET nombre = $1, descripcion = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;
    
    const values = [
      programa.getNombre(),
      programa.getDescripcion(),
      id
    ];

    const result: QueryResult = await this.pool.query(query, values);
    
    if (result.rows.length === 0) {
      throw new Error('Programa académico no encontrado.');
    }
    
    return this.mapRowToProgramaAcademico(result.rows[0]);
  }

  async eliminar(id: string): Promise<void> {
    const query = 'DELETE FROM programas_academicos WHERE id = $1';
    const result: QueryResult = await this.pool.query(query, [id]);
    
    if (result.rowCount === 0) {
      throw new Error('Programa académico no encontrado.');
    }
  }

  private mapRowToProgramaAcademico(row: any): ProgramaAcademico {
    const duracion = new Duracion(row.duracion_valor, row.duracion_unidad);
    
    return new ProgramaAcademico(
      row.nombre,
      row.descripcion,
      row.nivel as NivelEducativo,
      row.modalidad as Modalidad,
      duracion,
      row.id
    );
  }
}

