import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { TipoAsignatura } from '../../../core/dominio/entidades/asignatura/Asignatura.js';

import { 
    CrearAsignaturaUseCase, 
    ObtenerAsignaturasUseCase, 
    ObtenerAsignaturaPorIdUseCase,
    ActualizarAsignaturaUseCase, 
    EliminarAsignaturaUseCase,
    CrearAsignaturaDTO,
    ActualizarAsignaturaDTO
} from '../../../core/aplicaciones/asignatura/index.js'; 

type CrearRequest = FastifyRequest<{ Body: CrearAsignaturaDTO }>;
type ObtenerRequest = FastifyRequest<{ Params: { id: number } }>;
type ActualizarRequest = FastifyRequest<{ Params: { id: number }; Body: Omit<ActualizarAsignaturaDTO, 'id'> }>;

const EsquemaCuerpoAsignatura = {
    type: 'object',
    required: ['nombre', 'cargaHoraria', 'tipo'],
    properties: {
        nombre: { type: 'string', minLength: 3 },
        cargaHoraria: { type: 'number', minimum: 1 },
        tipo: { type: 'string', enum: Object.values(TipoAsignatura) },
    },
};

const EsquemaRespuestaAsignatura = {
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

const EsquemaParametrosId = { type: 'object', properties: { id: { type: 'number' } }, required: ['id'] };

const manejarError = (error: unknown, respuesta: FastifyReply) => {
    const mensaje = (error as any)?.message;
    if (typeof mensaje === 'string') {
        if (mensaje.startsWith('409')) return respuesta.code(409).send({ error: mensaje.split(': ')[1]?.trim() });
        if (mensaje.startsWith('404')) return respuesta.code(404).send({ error: mensaje.split(': ')[1]?.trim() });
    }
    console.error('Error en ruta:', error);
    return respuesta.code(400).send({ error: mensaje || 'Error desconocido o validación de esquema fallida.' });
};

export default function rutasAsignatura(
    fastify: FastifyInstance,
    options: {
        dependencies: {
            crearAsignaturaUseCase: CrearAsignaturaUseCase;
            listarAsignaturasUseCase: ObtenerAsignaturasUseCase;
            obtenerAsignaturaPorIdUseCase: ObtenerAsignaturaPorIdUseCase;
            actualizarAsignaturaUseCase: ActualizarAsignaturaUseCase;
            eliminarAsignaturaUseCase: EliminarAsignaturaUseCase;
        };
    },
    done: () => void,
) {
    const { crearAsignaturaUseCase, listarAsignaturasUseCase, obtenerAsignaturaPorIdUseCase, actualizarAsignaturaUseCase, eliminarAsignaturaUseCase } = options.dependencies;
    const prefijo = '/';

    fastify.post(
        prefijo,
        {
            schema: { body: EsquemaCuerpoAsignatura, response: { 201: EsquemaRespuestaAsignatura }, tags: ['Asignaturas'] },
        },
        async (peticion: CrearRequest, respuesta: FastifyReply) => {
            try {
                const nuevaAsignatura = await crearAsignaturaUseCase.execute(peticion.body);
                return respuesta.code(201).send(nuevaAsignatura);
            } catch (error) {
                return manejarError(error, respuesta);
            }
        }
    );

    fastify.get(
        prefijo,
        { schema: { response: { 200: { type: 'array', items: EsquemaRespuestaAsignatura } }, tags: ['Asignaturas'] } },
        async (peticion: FastifyRequest, respuesta: FastifyReply) => {
            const asignaturas = await listarAsignaturasUseCase.findAll();
            return respuesta.send(asignaturas);
        }
    );

    fastify.get(
        prefijo + ':id',
        { schema: { params: EsquemaParametrosId, response: { 200: EsquemaRespuestaAsignatura, 404: { type: 'object' } }, tags: ['Asignaturas'] } },
        async (peticion: ObtenerRequest, respuesta: FastifyReply) => {
            const asignatura = await obtenerAsignaturaPorIdUseCase.findById(peticion.params.id);
            if (!asignatura) return respuesta.code(404).send({ error: `Asignatura con ID ${peticion.params.id} no encontrada.` });
            return respuesta.send(asignatura);
        }
    );

    fastify.put(
        prefijo + ':id',
        { schema: { params: EsquemaParametrosId, body: EsquemaCuerpoAsignatura, response: { 200: EsquemaRespuestaAsignatura, 404: { type: 'object' }, 409: { type: 'object' } }, tags: ['Asignaturas'] } },
        async (peticion: ActualizarRequest, respuesta: FastifyReply) => {
            try {
                const id = peticion.params.id;
                // Uso de 'as any' para forzar el tipo si TypeScript se queja del spread
                const asignaturaActualizada = await actualizarAsignaturaUseCase.execute({ id, ...peticion.body } as any); 
                return respuesta.send(asignaturaActualizada);
            } catch (error) {
                return manejarError(error, respuesta);
            }
        }
    );

    fastify.delete(
        prefijo + ':id',
        { schema: { params: EsquemaParametrosId, response: { 204: { type: 'null' }, 404: { type: 'object' } }, tags: ['Asignaturas'] } },
        async (peticion: ObtenerRequest, respuesta: FastifyReply) => {
            try {
                await eliminarAsignaturaUseCase.execute(peticion.params.id);
                return respuesta.code(204).send();
            } catch (error) {
                return manejarError(error, respuesta);
            }
        }
    );

    done();
}