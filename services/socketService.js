const { fetchTrainStatus, MOCK_TRAINS } = require('./railwayApi');

/**
 * Sets up Socket.io event handlers for real-time train updates.
 * Clients can subscribe to specific train numbers and receive
 * live position/status pushes.
 */
function setupSocketHandlers(io) {
    // Map of trainNo -> Set of socket IDs subscribed
    const subscriptions = new Map();
    // Map of trainNo -> interval ID for broadcasting
    const intervals = new Map();

    io.on('connection', (socket) => {
        console.log(`🔌 Socket connected: ${socket.id}`);

        // Client subscribes to a train
        socket.on('subscribe_train', (trainNo) => {
            if (!/^\d{5}$/.test(trainNo)) {
                socket.emit('error', { message: 'Invalid train number' });
                return;
            }

            socket.join(`train_${trainNo}`);
            console.log(`  ↪ ${socket.id} subscribed to train ${trainNo}`);

            // Start broadcasting for this train if not already doing so
            if (!intervals.has(trainNo)) {
                const interval = setInterval(async () => {
                    try {
                        const data = await fetchTrainStatus(trainNo);
                        // Simulate position drift for demo
                        if (data.lat) data.lat += (Math.random() - 0.5) * 0.01;
                        if (data.lon) data.lon += (Math.random() - 0.5) * 0.01;
                        io.to(`train_${trainNo}`).emit('train_update', data);
                    } catch (err) {
                        console.error(`Broadcast error for ${trainNo}:`, err.message);
                    }
                }, 15000); // Push every 15 seconds
                intervals.set(trainNo, interval);
            }

            // Send immediate snapshot
            fetchTrainStatus(trainNo)
                .then((data) => socket.emit('train_update', data))
                .catch(console.error);
        });

        socket.on('unsubscribe_train', (trainNo) => {
            socket.leave(`train_${trainNo}`);
        });

        socket.on('disconnect', () => {
            console.log(`❌ Socket disconnected: ${socket.id}`);
            // Clean up intervals for rooms with no subscribers
            for (const [trainNo, _interval] of intervals.entries()) {
                const room = io.sockets.adapter.rooms.get(`train_${trainNo}`);
                if (!room || room.size === 0) {
                    clearInterval(intervals.get(trainNo));
                    intervals.delete(trainNo);
                    console.log(`  ↪ Stopped broadcast for train ${trainNo} (no subscribers)`);
                }
            }
        });
    });

    // Broadcast live feed (all active trains) every 30s
    setInterval(() => {
        const activeMocks = Object.values(MOCK_TRAINS).map((t) => ({
            ...t,
            lat: t.lat + (Math.random() - 0.5) * 0.02,
            lon: t.lon + (Math.random() - 0.5) * 0.02,
            speed: 80 + Math.floor(Math.random() * 50),
            lastUpdated: new Date().toISOString(),
        }));
        io.emit('live_feed', activeMocks);
    }, 30000);
}

module.exports = { setupSocketHandlers };
