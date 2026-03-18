const express = require('express');
const router = express.Router();
const { fetchTrainStatus, fetchSchedule } = require('../services/railwayApi');
const { AppError } = require('../middleware/errorHandler');

/**
 * GET /api/train/:trainNo
 * Returns live running status for a given train number
 */
router.get('/:trainNo', async (req, res, next) => {
    try {
        const { trainNo } = req.params;
        if (!/^\d{5}$/.test(trainNo)) {
            throw new AppError('Invalid train number. Must be 5 digits.', 400);
        }
        const data = await fetchTrainStatus(trainNo);
        res.json({ success: true, data });
    } catch (err) {
        next(err);
    }
});

/**
 * GET /api/train/:trainNo/schedule
 * Returns the time-table/schedule for a train
 */
router.get('/:trainNo/schedule', async (req, res, next) => {
    try {
        const { trainNo } = req.params;
        if (!/^\d{5}$/.test(trainNo)) {
            throw new AppError('Invalid train number. Must be 5 digits.', 400);
        }
        const schedule = await fetchSchedule(trainNo);
        res.json({ success: true, data: schedule });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
