import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { TipoAsignatura } from '../../../core/dominio/entidades/asignatura/Asignatura.js';
import { CrearAsignaturaUseCase } from '../../../core/aplicaciones/asignatura/casos-uso/CrearAsignaturaUseCase.js';
import { ObtenerAsignaturasUseCase } from '../../../core/aplicaciones/asignatura/casos-uso/ObtenerAsignaturasUseCase.js';
import { ActualizarAsignaturaUseCase } from '../../../core/aplicaciones/asignatura/casos-uso/ActualizarAsignaturaUseCase.js';
import { EliminarAsignaturaUseCase } from '../../../core/aplicaciones/asignatura/casos-uso/EliminarAsignaturaUseCase.js';
import { AsignaturaPGRepository } from '../../../core/infraestructura/postgres/repositorio/asignatura.pg.repository.js';

const repositorio = new AsignaturaPGRepository();
const crearAsignaturaUseCase = new CrearAsignaturaUseCase(repositorio);
const obtenerAsignaturasUseCase = new ObtenerAsignaturasUseCase(repositorio);
const actualizarAsignaturaUseCase = new ActualizarAsignaturaUseCase(repositorio);
const eliminarAsignaturaUseCase = new EliminarAsignaturaUseCase(repositorio);

const AsignaturaBodySchema = {
  type: 'object',
  required: ['nombre', 'cargaHoraria', 'tipo'],
  properties: {
    nombre: { type: 'string', minLength: 3 },
    cargaHoraria: { type: 'number', minimum: 1 },
    tipo: { type: 'string', enum: Object.values(TipoAsignatura) },
  },
};

const AsignaturaResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    nombre: { type: 'string' },
    cargaHoraria: { type: 'number' },
    tipo: { type: 'string', enum: Object.values(TipoAsignatura) },
    fechaCreacion: { type: 'string', format: 'date-time' },
    fechaActualizacion: { type: 'string', format: 'date-time' },
  },
};

const paramsIdSchema = {
  type: 'object',
  properties: { id: { type: 'number' } },
  required: ['id'],
};

const errorHandler = (error: unknown, reply: FastifyReply) => {
    const message = (error as Error).message;
    if (message.startsWith('409')) return reply.code(409).send({ error: message.split(': ')[1] }); 
    if (message.startsWith('404')) return reply.code(404).send({ error: message.split(': ')[1] }); 
    return reply.code(400).send({ error: message || 'Error desconocido.' }); 
};

export async function asignaturaRoutes(fastify: FastifyInstance) {

  fastify.post('/', {
    schema: {
      body: AsignaturaBodySchema,
      response: { 201: AsignaturaResponseSchema },
      tags: ['Asignaturas'],
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const nuevaAsignatura = await crearAsignaturaUseCase.execute(request.body as any);
      return reply.code(201).send(nuevaAsignatura); 
    } catch (error) {
      return errorHandler(error, reply); 
    }
  });


  fastify.get('/', {
    schema: {
      response: { 200: { type: 'array', items: AsignaturaResponseSchema } },
      tags: ['Asignaturas'],
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const asignaturas = await obtenerAsignaturasUseCase.findAll();
    return reply.send(asignaturas); 
  });

  fastify.get('/:id', {
    schema: {
      params: paramsIdSchema,
      response: { 200: AsignaturaResponseSchema, 404: { type: 'object' } },
      tags: ['Asignaturas'],
    }
  }, async (request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
    const asignatura = await obtenerAsignaturasUseCase.findById(request.params.id);
    if (!asignatura) {
      return reply.code(404).send({ error: `Asignatura con ID ${request.params.id} no encontrada.` }); // AC2
    }
    return reply.send(asignatura);
  });

  fastify.put('/:id', {
    schema: {
      params: paramsIdSchema,
      body: AsignaturaBodySchema,
      response: { 200: AsignaturaResponseSchema, 404: { type: 'object' }, 409: { type: 'object' } },
      tags: ['Asignaturas'],
    }
  }, async (request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
    try {
      const id = request.params.id;
      const asignaturaActualizada = await actualizarAsignaturaUseCase.execute({ id, ...(request.body as any) });
      return reply.send(asignaturaActualizada); 
    } catch (error) {
      return errorHandler(error, reply); 
    }
  });

  fastify.delete('/:id', {
    schema: {
      params: paramsIdSchema,
      response: { 204: { type: 'null' }, 404: { type: 'object' } },
      tags: ['Asignaturas'],
    }
  }, async (request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
    try {
      await eliminarAsignaturaUseCase.execute(request.params.id);
      return reply.code(204).send(); 
    } catch (error) {
      return errorHandler(error, reply);
    }
  });
}