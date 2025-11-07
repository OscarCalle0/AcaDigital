CREATE TABLE IF NOT EXISTS periodos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(20) UNIQUE NOT NULL CHECK (nombre ~ '^[0-9]{4}-(I|II|III|IV)$'),
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'inactivo' 
    CHECK (estado IN ('activo', 'inactivo', 'cerrado')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT chk_fechas_valida CHECK (fecha_fin > fecha_inicio)
);

CREATE INDEX IF NOT EXISTS idx_periodos_nombre ON periodos(nombre);
CREATE INDEX IF NOT EXISTS idx_periodos_estado ON periodos(estado);