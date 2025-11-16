const db = require('../database');

class Sale {
  static findAll() {
    const sales = db.prepare(`
      SELECT s.*, u.email as sold_by_email
      FROM sales s
      LEFT JOIN users u ON s.sold_by = u.id
      ORDER BY s.created_at DESC
    `).all();
    
    // Get items for each sale
    return sales.map(sale => {
      const items = db.prepare(`
        SELECT si.*, p.name as product_name, p.price as product_price
        FROM sale_items si
        LEFT JOIN products p ON si.product_id = p.id
        WHERE si.sale_id = ?
      `).all(sale.id);
      
      // Format to match frontend expectations
      return {
        ...sale,
        _id: sale.id,
        customerPhone: sale.customer_phone,
        memoNumber: sale.memo_number,
        soldBy: { email: sale.sold_by_email, _id: sale.sold_by },
        createdAt: sale.created_at,
        updatedAt: sale.updated_at,
        items: items.map(item => ({
          _id: item.id,
          product: { _id: item.product_id, name: item.product_name, price: item.price },
          productName: item.product_name,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal
        }))
      };
    });
  }

  static findById(id) {
    const sale = db.prepare(`
      SELECT s.*, u.email as sold_by_email
      FROM sales s
      LEFT JOIN users u ON s.sold_by = u.id
      WHERE s.id = ?
    `).get(id);
    
    if (!sale) return null;
    
    const items = db.prepare(`
      SELECT si.*, p.name as product_name, p.price as product_price
      FROM sale_items si
      LEFT JOIN products p ON si.product_id = p.id
      WHERE si.sale_id = ?
    `).all(id);
    
    // Format to match frontend expectations
    return {
      ...sale,
      _id: sale.id,
      customerPhone: sale.customer_phone,
      memoNumber: sale.memo_number,
      soldBy: { email: sale.sold_by_email, _id: sale.sold_by },
      createdAt: sale.created_at,
      updatedAt: sale.updated_at,
      items: items.map(item => ({
        _id: item.id,
        product: { _id: item.product_id, name: item.product_name, price: item.price },
        productName: item.product_name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal
      }))
    };
  }

  static create(data) {
    const { customerPhone, items, subtotal, discount, total, soldBy } = data;
    
    // Generate memo number
    const count = db.prepare('SELECT COUNT(*) as count FROM sales').get().count;
    const memoNumber = `MEMO-${Date.now()}-${count + 1}`;
    
    // Create sale
    const saleResult = db.prepare(`
      INSERT INTO sales (customer_phone, subtotal, discount, total, memo_number, sold_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(customerPhone, subtotal, discount, total, memoNumber, soldBy);
    
    const saleId = saleResult.lastInsertRowid;
    
    // Create sale items
    const insertItem = db.prepare(`
      INSERT INTO sale_items (sale_id, product_id, product_name, quantity, price, subtotal)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    for (const item of items) {
      insertItem.run(
        saleId,
        item.productId,
        item.productName,
        item.quantity,
        item.price,
        item.subtotal
      );
    }
    
    return this.findById(saleId);
  }
}

module.exports = Sale;
