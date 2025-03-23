const NotificationModel = require('../models/notificationModel');

class NotificationController {
    static async getUserNotifications(req, res) {
        try {
            const notifications = await NotificationModel.getUserNotifications(req.user.userId);
            res.json(notifications);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching notifications', error: error.message });
        }
    }

    static async markAsRead(req, res) {
        try {
            const { notificationId } = req.params;
            const updated = await NotificationModel.markAsRead(notificationId, req.user.userId);
            
            if (!updated) {
                return res.status(404).json({ message: 'Notification not found' });
            }
            
            res.json({ message: 'Notification marked as read' });
        } catch (error) {
            res.status(500).json({ message: 'Error updating notification', error: error.message });
        }
    }

    static async getUnreadCount(req, res) {
        try {
            const count = await NotificationModel.getUnreadCount(req.user.userId);
            res.json({ unreadCount: count });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching unread count', error: error.message });
        }
    }
}

module.exports = NotificationController;
