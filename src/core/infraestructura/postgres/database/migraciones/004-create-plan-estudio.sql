CREATE TABLE IF NOT EXISTS plan_estudio (
    programa_id VARCHAR(255) NOT NULL,
    asignatura_id INTEGER NOT NULL,
    semestre_nivel INTEGER NOT NULL CHECK (semestre_nivel > 0),
    creditos_carga DECIMAL(5, 2) NOT NULL CHECK (creditos_carga > 0),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (programa_id, asignatura_id),
    
    -- declaracion de las relaciones foreaneas
    
    FOREIGN KEY (programa_id) 
        REFERENCES programas_academicos (id) 
        ON DELETE CASCADE,
        
    FOREIGN KEY (asignatura_id) 
        REFERENCES asignaturas (id) 
        ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_plan_asignatura ON plan_estudio(asignatura_id);