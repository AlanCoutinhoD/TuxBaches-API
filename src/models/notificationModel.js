const db = require('../config/database');

class NotificationModel {
    static async create(userId, incidentId, message) {
        const [result] = await db.execute(
            'INSERT INTO notifications (user_id, incident_id, message) VALUES (?, ?, ?)',
            [userId, incidentId, message]
        );
        return result.insertId;
    }

    static async getUserNotifications(userId) {
        const [rows] = await db.execute(
            `SELECT n.*, i.type, i.title, i.latitude, i.longitude 
            FROM notifications n 
            LEFT JOIN incidents i ON n.incident_id = i.id 
            WHERE n.user_id = ? 
            ORDER BY n.created_at DESC`,
            [userId]
        );
        return rows;
    }

    static async markAsRead(notificationId, userId) {
        const [result] = await db.execute(
            'UPDATE notifications SET is_read = true WHERE id = ? AND user_id = ?',
            [notificationId, userId]
        );
        return result.affectedRows > 0;
    }

    static async getUnreadCount(userId) {
        const [rows] = await db.execute(
            'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = false',
            [userId]
        );
        return rows[0].count;
    }
}

module.exports = NotificationModel;
