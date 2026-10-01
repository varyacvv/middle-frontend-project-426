DROP TABLE IF EXISTS products CASCADE;

CREATE TABLE
    categories (
        id SERIAL PRIMARY KEY,
        slug TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL
    );

CREATE TABLE
    products (
        id SERIAL PRIMARY KEY,
        slug TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        category_id INTEGER NOT NULL REFERENCES categories (id),
        price INTEGER NOT NULL,
        in_stock BOOLEAN NOT NULL DEFAULT TRUE,
        image_url TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW ()
    );

CREATE INDEX products_category_id_idx ON products (category_id);

CREATE INDEX products_price_idx ON products (price);