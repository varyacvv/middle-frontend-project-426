CREATE TABLE
    IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        slug TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        price INTEGER NOT NULL,
        in_stock BOOLEAN NOT NULL DEFAULT TRUE,
        image_url TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW ()
    );