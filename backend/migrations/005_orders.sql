CREATE TABLE
    orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        method TEXT NOT NULL,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT,
        total INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'paid',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW ()
    );

CREATE INDEX orders_user_id_idx ON orders (user_id);

CREATE TABLE
    order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
        product_id INTEGER NOT NULL,
        product_name TEXT NOT NULL,
        product_price INTEGER NOT NULL,
        quantity INTEGER NOT NULL
    );

CREATE INDEX order_items_order_id_idx ON order_items (order_id);