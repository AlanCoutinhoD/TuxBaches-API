const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');

// Routes
router.get('/', auth, NotificationController.getUserNotifications);
router.get('/unread-count', auth, NotificationController.getUnreadCount);
router.patch('/:notificationId/read', auth, NotificationController.markAsRead);

module.exports = router;
