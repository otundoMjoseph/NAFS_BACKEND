class User {
    constructor(pool) {
        this.pool = pool;
    }
  async findByEmail(email) {
    const [rows] = await this.pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  async create(name, email, hashedPassword, role) {
      const [result] = await this.pool.query(
          'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
          [name, email, hashedPassword, role]
      );
      return result;
  }

    async findById(id){
        const [rows] = await this.pool.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
    }

    async update(name, role, profilePhotoPath, id) {
        const [result] = await this.pool.query(
            'UPDATE users SET name = ?, role = ?, profile_photo = ? WHERE id = ?',
            [name, role, profilePhotoPath, id]
        );
        return result;
    }

    async delete(id) {
        const [result] = await this.pool.query('DELETE FROM users WHERE id = ?', [id]);
        return result;
    }
}

module.exports = User;