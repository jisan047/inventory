const db = require('../database');
const bcrypt = require('bcryptjs');

class User {
  static findByEmail(email) {
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  }

  static findById(id) {
    return db.prepare('SELECT id, email, role, created_at, updated_at FROM users WHERE id = ?').get(id);
  }

  static create(email, password, role = 'admin') {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const result = db.prepare(`
      INSERT INTO users (email, password, role)
      VALUES (?, ?, ?)
    `).run(email, hashedPassword, role);
    
    return this.findById(result.lastInsertRowid);
  }

  static comparePassword(hashedPassword, candidatePassword) {
    return bcrypt.compareSync(candidatePassword, hashedPassword);
  }
}

module.exports = User;
