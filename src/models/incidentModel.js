const db = require('../config/database');

class IncidentModel {
    static async create(incidentData) {
        const { user_id, type, title, description, latitude, longitude, severity, image_url } = incidentData;
        const [result] = await db.execute(
            'INSERT INTO incidents (user_id, type, title, description, latitude, longitude, severity, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [user_id, type, title, description, latitude, longitude, severity, image_url]
        );
        return result.insertId;
    }

    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM incidents WHERE id = ?', [id]);
        return rows[0];
    }

    static async findNearby(latitude, longitude, radius = 5) {
        const [rows] = await db.execute(
            `SELECT *, 
            (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * 
            cos(radians(longitude) - radians(?)) + sin(radians(?)) * 
            sin(radians(latitude)))) AS distance 
            FROM incidents 
            WHERE status = 'active'
            HAVING distance < ? 
            ORDER BY distance`,
            [latitude, longitude, latitude, radius]
        );
        return rows;
    }

    static async updateStatus(id, status) {
        const [result] = await db.execute(
            'UPDATE incidents SET status = ? WHERE id = ?',
            [status, id]
        );
        return result.affectedRows > 0;
    }

    static async getAll(filters = {}) {
        let query = 'SELECT * FROM incidents WHERE 1=1';
        const params = [];

        if (filters.type) {
            query += ' AND type = ?';
            params.push(filters.type);
        }

        if (filters.severity) {
            query += ' AND severity = ?';
            params.push(filters.severity);
        }

        if (filters.status) {
            query += ' AND status = ?';
            params.push(filters.status);
        }

        query += ' ORDER BY created_at DESC';

        const [rows] = await db.execute(query, params);
        return rows;
    }
}

module.exports = IncidentModel;
