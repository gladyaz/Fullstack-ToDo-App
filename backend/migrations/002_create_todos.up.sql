-- todos
CREATE TABLE IF NOT EXISTS todos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  category_id INT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  priority VARCHAR(10) NOT NULL DEFAULT 'medium',
  due_date TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_priority CHECK (priority IN ('low','medium','high'))
);

CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos (completed);
CREATE INDEX IF NOT EXISTS idx_todos_priority ON todos (priority);
CREATE INDEX IF NOT EXISTS idx_todos_category ON todos (category_id);
CREATE INDEX IF NOT EXISTS idx_todos_title_trgm ON todos USING GIN (title gin_trgm_ops);
