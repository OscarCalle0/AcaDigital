CREATE TABLE IF NOT EXISTS programas_academicos (
    id VARCHAR(255) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    nivel VARCHAR(50) NOT NULL CHECK (nivel IN ('Técnico', 'Pregrado', 'Posgrado', 'Doctorado')),
    modalidad VARCHAR(50) NOT NULL CHECK (modalidad IN ('Presencial', 'Virtual', 'Semi-Presencial')),
    duracion_valor INT NOT NULL CHECK (duracion_valor > 0),
    duracion_unidad VARCHAR(50) NOT NULL CHECK (duracion_unidad IN ('meses', 'años', 'semestres', 'trimestres')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_programas_nivel ON programas_academicos(nivel);
CREATE INDEX IF NOT EXISTS idx_programas_modalidad ON programas_academicos(modalidad);
CREATE INDEX IF NOT EXISTS idx_programas_created_at ON programas_academicos(created_at);

