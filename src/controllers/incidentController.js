const IncidentModel = require('../models/incidentModel');

class IncidentController {
    static async createIncident(req, res) {
        try {
            const { type, title, description, latitude, longitude, severity } = req.body;
            
            // Validar que todos los campos requeridos estén presentes
            if (!type || !title || !latitude || !longitude || !severity) {
                return res.status(400).json({
                    message: 'Missing required fields',
                    required: {
                        type: 'pothole, accident, road_closure, traffic_jam, other',
                        title: 'string',
                        latitude: 'number',
                        longitude: 'number',
                        severity: 'low, medium, high, critical'
                    }
                });
            }

            const incidentData = {
                user_id: req.user.userId,
                type,
                title,
                description: description || '', // Si no hay descripción, usar string vacío
                latitude,
                longitude,
                severity,
                image_url: req.file ? req.file.path : null // Si hay imagen adjunta
            };
            
            const incidentId = await IncidentModel.create(incidentData);
            res.status(201).json({
                message: 'Incident created successfully',
                incidentId
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Error creating incident', 
                error: error.message,
                details: 'Please ensure all required fields are provided with valid values'
            });
        }
    }

    static async getNearbyIncidents(req, res) {
        try {
            const { latitude, longitude, radius } = req.query;
            const incidents = await IncidentModel.findNearby(
                parseFloat(latitude),
                parseFloat(longitude),
                parseFloat(radius)
            );
            res.json(incidents);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching nearby incidents', error: error.message });
        }
    }

    static async updateIncidentStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            
            const updated = await IncidentModel.updateStatus(id, status);
            if (!updated) {
                return res.status(404).json({ message: 'Incident not found' });
            }
            
            res.json({ message: 'Incident status updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error updating incident status', error: error.message });
        }
    }

    static async getAllIncidents(req, res) {
        try {
            const filters = {
                type: req.query.type,
                severity: req.query.severity,
                status: req.query.status
            };
            
            const incidents = await IncidentModel.getAll(filters);
            res.json(incidents);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching incidents', error: error.message });
        }
    }

    static async getIncidentById(req, res) {
        try {
            const { id } = req.params;
            const incident = await IncidentModel.findById(id);
            
            if (!incident) {
                return res.status(404).json({ message: 'Incident not found' });
            }
            
            res.json(incident);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching incident', error: error.message });
        }
    }
}

module.exports = IncidentController;
