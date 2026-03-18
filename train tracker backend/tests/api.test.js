const request = require('supertest');
const { app } = require('../index');

describe('Train API', () => {
    test('GET /health returns ok', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('ok');
    });

    test('GET /api/train/12951 returns mock data', async () => {
        const res = await request(app).get('/api/train/12951');
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.trainNo).toBe('12951');
    });

    test('GET /api/train/ABC returns 400', async () => {
        const res = await request(app).get('/api/train/ABC');
        expect(res.statusCode).toBe(400);
    });

    test('GET /api/pnr/1234567890 returns mock PNR', async () => {
        const res = await request(app).get('/api/pnr/1234567890');
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

    test('GET /api/pnr/123 returns 400 for short PNR', async () => {
        const res = await request(app).get('/api/pnr/123');
        expect(res.statusCode).toBe(400);
    });

    test('GET /api/stations returns station list', async () => {
        const res = await request(app).get('/api/stations');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('GET /api/stations?q=delhi returns filtered', async () => {
        const res = await request(app).get('/api/stations?q=delhi');
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBeGreaterThan(0);
    });
});
