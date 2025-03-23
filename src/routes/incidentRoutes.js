const express = require('express');
const router = express.Router();
const IncidentController = require('../controllers/incidentController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');

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
router.post('/', auth, validateIncident, IncidentController.createIncident);
router.get('/nearby', auth, IncidentController.getNearbyIncidents);
router.get('/', auth, IncidentController.getAllIncidents);
router.get('/:id', auth, IncidentController.getIncidentById);
router.patch('/:id/status', auth, IncidentController.updateIncidentStatus);

module.exports = router;
