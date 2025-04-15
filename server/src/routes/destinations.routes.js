import express from 'express';
const router = express.Router();

import { getDestinations, getDestinationById, addDestination, updateDestination, deleteDestination } from '../controllers/destinations.controller.js';

// Get all destinations
router.get('/', getDestinations);

// Get a specific destination by ID
router.get('/:id', getDestinationById);

// Add a new destination
router.post('/', addDestination);

// Update an existing destination by ID
router.put('/:id', updateDestination);

// Delete a destination by ID
router.delete('/:id', deleteDestination);

// Export the router
export default router;



