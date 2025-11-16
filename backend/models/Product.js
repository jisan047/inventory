const db = require('../database');

class Product {
  static findAll() {
    const products = db.prepare('SELECT * FROM products ORDER BY created_at DESC').all();
    // Format to match frontend expectations (add _id)
    return products.map(p => ({ ...p, _id: p.id, createdAt: p.created_at, updatedAt: p.updated_at }));
  }

  static findById(id) {
    // Handle both string and numeric IDs (frontend sends _id as string)
    const productId = typeof id === 'string' ? parseInt(id) : id;
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(productId);
    if (!product) return null;
    // Format to match frontend expectations (add _id)
    return { ...product, _id: product.id, createdAt: product.created_at, updatedAt: product.updated_at };
  }

  static create(data) {
    const { name, description, price, image, quantity } = data;
    const result = db.prepare(`
      INSERT INTO products (name, description, price, image, quantity)
      VALUES (?, ?, ?, ?, ?)
    `).run(name || '', description || '', price, image || '', quantity || 0);
    
    const product = this.findById(result.lastInsertRowid);
    return product;
  }

  static update(id, data) {
    const { name, description, price, image, quantity } = data;
    db.prepare(`
      UPDATE products
      SET name = ?, description = ?, price = ?, image = ?, quantity = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, description, price, image, quantity, id);
    
    return this.findById(id);
  }

  static delete(id) {
    return db.prepare('DELETE FROM products WHERE id = ?').run(id);
  }

  static updateQuantity(id, quantity) {
    // Handle both string and numeric IDs
    const productId = typeof id === 'string' ? parseInt(id) : id;
    db.prepare(`
      UPDATE products
      SET quantity = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(quantity, productId);
  }
}

module.exports = Product;
