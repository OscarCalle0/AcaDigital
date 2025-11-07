import type { FastifyInstance, RouteHandler } from 'fastify';
import type { CrearPeriodoUseCase } from '../../../core/aplicaciones/periodo-academico/casos-de-uso/CrearPeriodoUseCase.js';
import type { ObtenerPeriodosUseCase } from '../../../core/aplicaciones/periodo-academico/casos-de-uso/ObtenerPeriodosUseCase.js';
import type { ObtenerPeriodoPorIdUseCase } from '../../../core/aplicaciones/periodo-academico/casos-de-uso/ObtenerPeriodoPorIdUseCase.js';
import type { ActualizarPeriodoUseCase } from '../../../core/aplicaciones/periodo-academico/casos-de-uso/ActualizarPeriodoUseCase.js';
import type { EliminarPeriodoUseCase } from '../../../core/aplicaciones/periodo-academico/casos-de-uso/EliminarPeriodoUseCase.js';

const crearSchema = {
    body: {
        type: 'object',
        required: ['nombre', 'fechaInicio', 'fechaFin'],
        properties: {
            nombre: { type: 'string', pattern: '^[0-9]{4}-[IVX]+$' },
            fechaInicio: { type: 'string', format: 'date' },
            fechaFin: { type: 'string', format: 'date' }
        },
        additionalProperties: false
    }
};

interface Params {
    id: string;
}

export function registerPeriodoAcademicoRoutes(
    server: FastifyInstance,
    crear: CrearPeriodoUseCase,
    listar: ObtenerPeriodosUseCase,
    obtenerPorId: ObtenerPeriodoPorIdUseCase,
    actualizar: ActualizarPeriodoUseCase,
    eliminar: EliminarPeriodoUseCase
) {
    // POST /periodos
    server.post('/periodos', { schema: crearSchema }, async (req, reply) => {
        try {
            const resultado = await crear.ejecutar(req.body as any);
            reply.code(201).send(resultado);
        } catch (error: any) {
            reply.code(400).send({ error: error.message });
        }
    });

    // GET /periodos
    server.get('/periodos', async (req, reply) => {
        const estado = (req.query as any).estado;
        const resultado = await listar.ejecutar(estado ? { estado } : undefined);
        reply.send(resultado);
    });

    // GET /periodos/:id
    server.get<{ Params: Params }>('/periodos/:id', async (req, reply) => {
        const id = req.params.id;
        const resultado = await obtenerPorId.ejecutar(id);
        if (!resultado) return reply.code(404).send({ error: 'No encontrado' });
        reply.send(resultado);
    });

    // PUT /periodos/:id
    server.put<{ Params: Params }>('/periodos/:id', async (req, reply) => {
        try {
            const id = req.params.id;
            const resultado = await actualizar.ejecutar(id, req.body as any);
            reply.send(resultado);
        } catch (error: any) {
            reply.code(400).send({ error: error.message });
        }
    });

    // DELETE /periodos/:id
    server.delete<{ Params: Params }>('/periodos/:id', async (req, reply) => {
        try {
            await eliminar.ejecutar(req.params.id);
        reply.code(204).send({ message: 'El período ha sido eliminado con exito' });
        } catch (error: any) {
            reply.code(404).send({ error: error.message });
        }
    });
};