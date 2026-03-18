/**
 * Auth Middleware
 * When Firebase is configured: verifies Firebase ID token.
 * When Firebase is not configured (dev/mock mode): passes through with a mock user.
 */
async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    // Dev / no-Firebase mode: skip auth if USE_MOCK_DATA is true
    if (process.env.USE_MOCK_DATA === 'true' || process.env.SKIP_AUTH === 'true') {
        req.user = { uid: 'mock-user-001', email: 'dev@localhost', mock: true };
        return next();
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
        // Lazy-load admin only when Firebase is actually configured
        const { admin } = require('../config/firebase');
        if (!admin || !admin.apps || admin.apps.length === 0) {
            // Firebase not initialized — treat as open in dev
            req.user = { uid: 'mock-user-001', mock: true };
            return next();
        }
        const decoded = await admin.auth().verifyIdToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Auth error:', err.message);
        return res.status(403).json({ error: 'Forbidden: Invalid or expired token' });
    }
}

module.exports = { authMiddleware };
