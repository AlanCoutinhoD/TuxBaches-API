const express = require('express');
const router = express.Router();
const IncidentController = require('../controllers/incidentController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const multer = require('multer');

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Validation middleware
const validateIncident = [
    body('type').isIn(['pothole', 'accident', 'road_closure', 'traffic_jam', 'other']),
    body('title').trim().isLength({ min: 3, max: 100 }),
    body('description').trim().optional(),
    body('latitude').isFloat({ min: -90, max: 90 }),
    body('longitude').isFloat({ min: -180, max: 180 }),
    body('severity').isIn(['low', 'medium', 'high', 'critical'])
];

// Routes
router.post('/', auth, upload.single('image'), validateIncident, IncidentController.createIncident);
router.get('/nearby', auth, IncidentController.getNearbyIncidents);
router.get('/', auth, IncidentController.getAllIncidents);
router.get('/:id', auth, IncidentController.getIncidentById);
router.patch('/:id/status', auth, IncidentController.updateIncidentStatus);

module.exports = router;
