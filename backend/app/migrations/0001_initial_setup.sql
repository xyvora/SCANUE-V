CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  hashed_password TEXT NOT NULL,
  hashed_openai_api_key TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_superuser BOOLEAN NOT NULL DEFAULT false,
  last_login TIMESTAMP NOT NULL DEFAULT NOW()
);
