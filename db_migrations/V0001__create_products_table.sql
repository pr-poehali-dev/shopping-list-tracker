CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  photo TEXT,
  hint TEXT DEFAULT '',
  sku TEXT DEFAULT '',
  selling_price DECIMAL(10,2),
  purchase_price DECIMAL(10,2),
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);