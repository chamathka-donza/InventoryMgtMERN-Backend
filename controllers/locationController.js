const Location = require('../models/location');

// Get all locations
const getLocations = async (req, res) => {
    try {
        const locations = await Location.find({});
        res.status(200).json(locations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get location by ID
const getLocationById = async (req, res) => {
    const { id } = req.params;
    try {
        const location = await Location.findById(id);
        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }
        res.status(200).json(location);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const generateLocCode = async () => {
    const lastLocation = await Location.findOne().sort({ loc_code: -1 }).select('loc_code');
    let nextCode = 1;
    if (lastLocation) {
        nextCode = parseInt(lastLocation.loc_code) + 1;
    }
    return nextCode.toString().padStart(6, '0'); // Ensures 6-digit format
};

// Create a new location
const createLocation = async (req, res) => {
    const { loc_name, loc_address } = req.body;
    try {
        const loc_code = await generateLocCode();

        const location = new Location({
            loc_code,
            loc_name,
            loc_address
        });

        await location.save();
        res.status(201).json(location);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update location
const updateLocation = async (req, res) => {
    const { loc_name, loc_address } = req.body;
    const { id } = req.params;
    try {
        const location = await Location.findById(id);
        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }

        location.loc_name = loc_name;
        location.loc_address = loc_address;
        await location.save();

        res.status(200).json(location);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete location
const deleteLocation = async (req, res) => {
    const { id } = req.params;
    try {
        const location = await Location.findById(id);
        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }

        await Location.findByIdAndDelete(id);
        res.status(200).json({ message: 'Location deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getLocations,
    getLocationById,
    createLocation,
    updateLocation,
    deleteLocation
};
