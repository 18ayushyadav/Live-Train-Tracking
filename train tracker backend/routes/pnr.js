const express = require('express');
const router = express.Router();
const { fetchPNRStatus } = require('../services/railwayApi');
const { AppError } = require('../middleware/errorHandler');

/**
 * GET /api/pnr/:pnrNo
 * Returns PNR booking status
 */
router.get('/:pnrNo', async (req, res, next) => {
    try {
        const { pnrNo } = req.params;
        if (!/^\d{10}$/.test(pnrNo)) {
            throw new AppError('Invalid PNR number. Must be exactly 10 digits.', 400);
        }
        const data = await fetchPNRStatus(pnrNo);
        res.json({ success: true, data });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
