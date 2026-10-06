CREATE TABLE
    promos (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        text TEXT NOT NULL,
        product_id INTEGER NOT NULL UNIQUE REFERENCES products (id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW ()
    );