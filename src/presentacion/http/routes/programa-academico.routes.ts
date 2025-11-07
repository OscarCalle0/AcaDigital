import type { FastifyInstance } from 'fastify';
import { 
  CrearProgramaAcademicoUseCase, 
  ListarProgramasAcademicosUseCase, 
  ObtenerProgramaAcademicoPorIdUseCase, 
  ActualizarProgramaAcademicoUseCase, 
  EliminarProgramaAcademicoUseCase,
  type CrearProgramaDto,
  type ActualizarProgramaDto,
  crearProgramaSchema,
  actualizarProgramaSchema
} from '../../../core/aplicaciones/programa-academico/index.js';

export function registerProgramaAcademicoRoutes(
  server: FastifyInstance,
  crearProgramaUseCase: CrearProgramaAcademicoUseCase,
  listarProgramasUseCase: ListarProgramasAcademicosUseCase,
  obtenerProgramaPorIdUseCase: ObtenerProgramaAcademicoPorIdUseCase,
  actualizarProgramaUseCase: ActualizarProgramaAcademicoUseCase,
  eliminarProgramaUseCase: EliminarProgramaAcademicoUseCase
) {
  // Crear programa académico
  server.post('/programas-academicos', async (request, reply) => {
    try {
      // Validar el body con Zod
      const validacion = crearProgramaSchema.safeParse(request.body);
      if (!validacion.success) {
        return reply.status(400).send({ 
          message: 'Error de validación',
          errors: validacion.error.issues.map((err: any) => ({
            campo: err.path.join('.'),
            mensaje: err.message
          }))
        });
      }

      const dto = validacion.data as CrearProgramaDto;
      const nuevoPrograma = await crearProgramaUseCase.execute(dto);
      return reply.status(201).send({
        id: nuevoPrograma.getId(),
        nombre: nuevoPrograma.getNombre(),
        descripcion: nuevoPrograma.getDescripcion(),
        nivel: nuevoPrograma.getNivelEducativo(),
        modalidad: nuevoPrograma.getModalidad(),
        duracion: {
          valor: nuevoPrograma.getDuracion().getValor(),
          unidad: nuevoPrograma.getDuracion().getUnidad()
        }
      });
    } catch (error: any) {
      return reply.status(400).send({ message: error.message });
    }
  });

  // Listar todos los programas académicos
  server.get('/programas-academicos', async (request, reply) => {
    try {
      const programas = await listarProgramasUseCase.execute();
      return reply.send(programas.map(p => ({
        id: p.getId(),
        nombre: p.getNombre(),
        descripcion: p.getDescripcion(),
        nivel: p.getNivelEducativo(),
        modalidad: p.getModalidad(),
        duracion: {
          valor: p.getDuracion().getValor(),
          unidad: p.getDuracion().getUnidad()
        }
      })));
    } catch (error: any) {
      return reply.status(500).send({ message: error.message });
    }
  });

  // Obtener programa académico por ID
  server.get('/programas-academicos/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const idLimpio = id?.trim();
      
      if (!idLimpio || idLimpio.length === 0) {
        return reply.status(400).send({ message: 'El ID es obligatorio' });
      }

      const programa = await obtenerProgramaPorIdUseCase.execute(idLimpio);
      if (!programa) {
        return reply.status(404).send({ 
          message: 'Programa no encontrado',
          idBuscado: idLimpio 
        });
      }
      
      return reply.send({
        id: programa.getId(),
        nombre: programa.getNombre(),
        descripcion: programa.getDescripcion(),
        nivel: programa.getNivelEducativo(),
        modalidad: programa.getModalidad(),
        duracion: {
          valor: programa.getDuracion().getValor(),
          unidad: programa.getDuracion().getUnidad()
        }
      });
    } catch (error: any) {
      return reply.status(400).send({ message: error.message });
    }
  });

  // Actualizar programa académico
  server.put('/programas-academicos/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const idLimpio = id?.trim();
      
      if (!idLimpio || idLimpio.length === 0) {
        return reply.status(400).send({ message: 'El ID es obligatorio' });
      }

      // Validar el body con Zod
      const validacion = actualizarProgramaSchema.safeParse(request.body);
      if (!validacion.success) {
        return reply.status(400).send({ 
          message: 'Error de validación',
          errors: validacion.error.issues.map((err: any) => ({
            campo: err.path.join('.'),
            mensaje: err.message
          }))
        });
      }

      const dto = validacion.data as ActualizarProgramaDto;
      const programaActualizado = await actualizarProgramaUseCase.execute(idLimpio, dto);
      
      return reply.send({
        id: programaActualizado.getId(),
        nombre: programaActualizado.getNombre(),
        descripcion: programaActualizado.getDescripcion(),
        nivel: programaActualizado.getNivelEducativo(),
        modalidad: programaActualizado.getModalidad(),
        duracion: {
          valor: programaActualizado.getDuracion().getValor(),
          unidad: programaActualizado.getDuracion().getUnidad()
        }
      });
    } catch (error: any) {
      if (error.message.includes('no encontrado')) {
        return reply.status(404).send({ message: error.message });
      }
      return reply.status(400).send({ message: error.message });
    }
  });

  // Eliminar programa académico
  server.delete('/programas-academicos/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const idLimpio = id?.trim();
      
      if (!idLimpio || idLimpio.length === 0) {
        return reply.status(400).send({ message: 'El ID es obligatorio' });
      }

      await eliminarProgramaUseCase.execute(idLimpio);
      return reply.status(204).send(); // No Content
    } catch (error: any) {
      if (error.message.includes('no encontrado')) {
        return reply.status(404).send({ message: error.message });
      }
      return reply.status(400).send({ message: error.message });
    }
  });
}

