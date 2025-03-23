const db = require('../config/database');
const bcrypt = require('bcryptjs');

class UserModel {
    static async create(username, email, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.execute(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );
        return result.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.execute('SELECT id, username, email, created_at FROM users WHERE id = ?', [id]);
        return rows[0];
    }
}

module.exports = UserModel;
