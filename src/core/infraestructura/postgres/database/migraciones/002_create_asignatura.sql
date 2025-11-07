CREATE TABLE asignaturas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL UNIQUE, 
    carga_horaria INTEGER NOT NULL CHECK (carga_horaria > 0), 
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('teorica', 'practica', 'mixta')), 
    fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


DROP TABLE IF EXISTS asignaturas;