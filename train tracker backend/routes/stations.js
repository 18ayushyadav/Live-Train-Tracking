const express = require('express');
const router = express.Router();

const STATIONS = require('../data/stations.json');

/**
 * GET /api/stations
 * Returns all stations or filtered by ?q=name
 */
router.get('/', (req, res) => {
    const { q } = req.query;
    if (q && q.length >= 2) {
        const filtered = STATIONS.filter(
            (s) =>
                s.name.toLowerCase().includes(q.toLowerCase()) ||
                s.code.toLowerCase().includes(q.toLowerCase())
        ).slice(0, 20);
        return res.json({ success: true, data: filtered });
    }
    res.json({ success: true, data: STATIONS.slice(0, 50) });
});

/**
 * GET /api/stations/:code
 * Returns a single station by code
 */
router.get('/:code', (req, res) => {
    const station = STATIONS.find(
        (s) => s.code.toUpperCase() === req.params.code.toUpperCase()
    );
    if (!station) {
        return res.status(404).json({ success: false, error: 'Station not found' });
    }
    res.json({ success: true, data: station });
});

module.exports = router;
