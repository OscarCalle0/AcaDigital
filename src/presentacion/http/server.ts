import fastify from 'fastify';

//periodo academico
import {
  CrearPeriodoUseCase,
  ObtenerPeriodosUseCase,
  ObtenerPeriodoPorIdUseCase,
  ActualizarPeriodoUseCase,
  EliminarPeriodoUseCase
} from '../../core/aplicaciones/periodo-academico/index.js';
import { PostgresPeriodoAcademicoRepository } from '../../core/infraestructura/postgres/repositorio/periodo-academico.pg.repository.js';
import { registerPeriodoAcademicoRoutes } from './routes/periodo-academico.routes.js';

//asignatura
import {
  CrearAsignaturaUseCase,
  ObtenerAsignaturasUseCase,
  ObtenerAsignaturaPorIdUseCase,
  ActualizarAsignaturaUseCase,
  EliminarAsignaturaUseCase
} from '../../core/aplicaciones/asignatura/index.js'; 
import { AsignaturaPGRepository } from '../../core/infraestructura/postgres/repositorio/asignatura.pg.repository.js';
import { asignaturaRoutes } from './routes/asignatura.routes.js';

//programa academico
import {
  CrearProgramaAcademicoUseCase,
  ListarProgramasAcademicosUseCase,
  ObtenerProgramaAcademicoPorIdUseCase,
  ActualizarProgramaAcademicoUseCase,
  EliminarProgramaAcademicoUseCase
} from '../../core/aplicaciones/programa-academico/index.js';
import { PostgresProgramaAcademicoRepository } from '../../core/infraestructrura/postgres/repositorio/postgres-programa-academico.repository.js';
import { registerProgramaAcademicoRoutes } from './routes/programa-academico.routes.js';

// --- Inyección de Dependencias Manual ---
const programaRepository = new PostgresProgramaAcademicoRepository();

const crearProgramaUseCase = new CrearProgramaAcademicoUseCase(programaRepository);
const listarProgramasUseCase = new ListarProgramasAcademicosUseCase(programaRepository);
const obtenerProgramaPorIdUseCase = new ObtenerProgramaAcademicoPorIdUseCase(programaRepository);
const actualizarProgramaUseCase = new ActualizarProgramaAcademicoUseCase(programaRepository);
const eliminarProgramaUseCase = new EliminarProgramaAcademicoUseCase(programaRepository);

const asignaturaRepository = new AsignaturaPGRepository ();
const crearAsignaturaUseCase = new CrearAsignaturaUseCase(asignaturaRepository);
const listarAsignaturasUseCase = new ObtenerAsignaturasUseCase(asignaturaRepository);
const obtenerAsignaturaPorIdUseCase = new ObtenerAsignaturaPorIdUseCase(asignaturaRepository);
const actualizarAsignaturaUseCase = new ActualizarAsignaturaUseCase(asignaturaRepository);
const eliminarAsignaturaUseCase = new EliminarAsignaturaUseCase(asignaturaRepository);

const periodoRepository = new PostgresPeriodoAcademicoRepository();

const crearPeriodoUseCase = new CrearPeriodoUseCase(periodoRepository);
const listarPeriodosUseCase = new ObtenerPeriodosUseCase(periodoRepository);
const obtenerPeriodoPorIdUseCase = new ObtenerPeriodoPorIdUseCase(periodoRepository);
const actualizarPeriodoUseCase = new ActualizarPeriodoUseCase(periodoRepository);
const eliminarPeriodoUseCase = new EliminarPeriodoUseCase(periodoRepository);
// --- Servidor Fastify ---
export const server = fastify({ logger: true });

// --- Registrar Rutas ---
registerProgramaAcademicoRoutes(
  server,
  crearProgramaUseCase,
  listarProgramasUseCase,
  obtenerProgramaPorIdUseCase,
  actualizarProgramaUseCase,
  eliminarProgramaUseCase
);
server.register(asignaturaRoutes, {
    prefix: '/api/v1/asignaturas',
    dependencies: {
        crearAsignaturaUseCase,
        listarAsignaturasUseCase,
        obtenerAsignaturaPorIdUseCase,
        actualizarAsignaturaUseCase,
        eliminarAsignaturaUseCase,
    }
});
registerPeriodoAcademicoRoutes(
  server,
  crearPeriodoUseCase,
  listarPeriodosUseCase,
  obtenerPeriodoPorIdUseCase,
  actualizarPeriodoUseCase,
  eliminarPeriodoUseCase
);


// --- Iniciar el Servidor ---
export const start = async () => {
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Servidor corriendo en http://localhost:3000');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  };
};

if (import.meta.main) {
  start();
};
