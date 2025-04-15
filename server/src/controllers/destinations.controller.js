import Destination from '../models/destinations.model.js';

// Get all destinations
export const getDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.status(200).json(destinations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific destination by ID
export const getDestinationById = async (req, res) => {
  const { id } = req.params;
  try {
    const destination = await Destination.findById(id);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    res.status(200).json(destination);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new destination
export const addDestination = async (req, res) => {
  const newDestination = new Destination(req.body);
  try {
    const savedDestination = await newDestination.save();
    res.status(201).json(savedDestination);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an existing destination by ID
export const updateDestination = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedDestination = await Destination.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedDestination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    res.status(200).json(updatedDestination);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a destination by ID
export const deleteDestination = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedDestination = await Destination.findByIdAndDelete(id);
    if (!deletedDestination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
