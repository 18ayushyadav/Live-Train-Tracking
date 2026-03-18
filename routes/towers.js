const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { getFirestore } = require('../config/firebase');
const { AppError } = require('../middleware/errorHandler');
const { v4: uuidv4 } = require('uuid');

/**
 * POST /api/towers
 * Authenticated: crowdsource a new cell tower mapping
 * Body: { mcc, mnc, cid, lac, lat, lon, routeCode, stationNear }
 */
router.post('/', authMiddleware, async (req, res, next) => {
    try {
        const { mcc, mnc, cid, lac, lat, lon, routeCode, stationNear } = req.body;

        // Validate required fields
        if (!mcc || !mnc || !cid || !lat || !lon) {
            throw new AppError('Missing required fields: mcc, mnc, cid, lat, lon', 400);
        }
        if (lat < 8 || lat > 37 || lon < 68 || lon > 97) {
            throw new AppError('Coordinates are outside India bounds', 400);
        }

        const tower = {
            id: uuidv4(),
            mcc: parseInt(mcc),
            mnc: parseInt(mnc),
            cid: parseInt(cid),
            lac: parseInt(lac) || 0,
            lat: parseFloat(lat),
            lon: parseFloat(lon),
            routeCode: routeCode || 'UNKNOWN',
            stationNear: stationNear || '',
            submittedBy: req.user.uid,
            // Never store identifiable user info beyond UID
            createdAt: new Date().toISOString(),
            verified: false,
        };

        const db = getFirestore();
        if (db) {
            await db.collection('cell_towers').doc(tower.id).set(tower);
        } else {
            // Dev mode without Firebase: just log
            console.log('📡 Tower submission (no DB):', tower);
        }

        res.status(201).json({ success: true, data: { id: tower.id } });
    } catch (err) {
        next(err);
    }
});

/**
 * GET /api/towers?lat=&lon=&radius=km
 * Returns towers near a coordinate (for triangulation download)
 */
router.get('/', async (req, res, next) => {
    try {
        const { lat, lon, radius = 50 } = req.query;
        const db = getFirestore();

        if (!db) {
            return res.json({ success: true, data: [], note: 'Firebase not configured' });
        }

        // Simple bounding box query (for production, use geohash or geo queries)
        const r = parseFloat(radius) / 111; // 1 degree ≈ 111 km
        const snapshot = await db.collection('cell_towers')
            .where('lat', '>=', parseFloat(lat) - r)
            .where('lat', '<=', parseFloat(lat) + r)
            .where('verified', '==', true)
            .limit(200)
            .get();

        const towers = snapshot.docs.map((d) => d.data());
        res.json({ success: true, data: towers });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
