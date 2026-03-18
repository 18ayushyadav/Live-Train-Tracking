const axios = require('axios');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: parseInt(process.env.CACHE_TTL) || 60 });

// ─── Helpers ───────────────────────────────────────────────────────────────────
function minutesFromMidnight(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
}

// Simulate a train's current position along a route based on current time.
function simulateLivePosition(trainData) {
    const now = new Date();
    const minutesNow = now.getHours() * 60 + now.getMinutes();
    const schedule = MOCK_SCHEDULES[trainData.trainNo] || [];
    let currentStation = schedule[0] || { station: 'En Route', code: 'SRC' };
    let nextStation = schedule[1] || { station: 'Destination', code: 'DST' };
    let lat = trainData.lat;
    let lon = trainData.lon;

    for (let i = 0; i < schedule.length - 1; i++) {
        const depMin = minutesFromMidnight(schedule[i].departure !== '--' ? schedule[i].departure : schedule[i].arrival);
        const arrMin = minutesFromMidnight(schedule[i + 1].arrival !== '--' ? schedule[i + 1].arrival : schedule[i + 1].departure);
        if (minutesNow >= depMin && minutesNow < arrMin) {
            currentStation = schedule[i];
            nextStation = schedule[i + 1];
            // Interpolate coordinates
            const progress = (minutesNow - depMin) / Math.max(arrMin - depMin, 1);
            lat = schedule[i].lat + (schedule[i + 1].lat - schedule[i].lat) * progress;
            lon = schedule[i].lon + (schedule[i + 1].lon - schedule[i].lon) * progress;
            break;
        }
    }

    return { ...trainData, currentStation: currentStation.station, currentStationCode: currentStation.code, nextStation: nextStation.station, nextStationCode: nextStation.code, lat, lon, lastUpdated: now.toISOString() };
}

// ─── Mock Train Database ───────────────────────────────────────────────────────
const MOCK_TRAINS = {
    '12951': {
        trainNo: '12951', trainName: 'Mumbai Rajdhani Express',
        from: 'MMCT', to: 'NDLS', departure: '17:00', arrival: '08:35',
        status: 'Running', delay: 5, speed: 115, lat: 22.3007, lon: 73.2088,
    },
    '12302': {
        trainNo: '12302', trainName: 'Howrah Rajdhani Express',
        from: 'HWH', to: 'NDLS', departure: '14:05', arrival: '09:55',
        status: 'Running', delay: 0, speed: 130, lat: 24.7914, lon: 84.9994,
    },
    '12163': {
        trainNo: '12163', trainName: 'Chennai Dadar Express',
        from: 'MAS', to: 'DR', departure: '10:55', arrival: '14:20',
        status: 'Running', delay: 12, speed: 85, lat: 18.5236, lon: 73.8478,
    },
    '12259': {
        trainNo: '12259', trainName: 'Sealdah Duronto Express',
        from: 'SDAH', to: 'NDLS', departure: '18:05', arrival: '10:05',
        status: 'Running', delay: 0, speed: 140, lat: 26.8467, lon: 80.9462,
    },
    '22691': {
        trainNo: '22691', trainName: 'Rajdhani Express (SBC)',
        from: 'SBC', to: 'NDLS', departure: '20:00', arrival: '05:30',
        status: 'Running', delay: 8, speed: 100, lat: 17.4410, lon: 78.3742,
    },
    '12626': {
        trainNo: '12626', trainName: 'Kerala Express',
        from: 'TVC', to: 'NDLS', departure: '11:30', arrival: '06:30',
        status: 'Running', delay: 20, speed: 70, lat: 21.1458, lon: 79.0882,
    },
    '12904': {
        trainNo: '12904', trainName: 'Golden Temple Mail',
        from: 'BCT', to: 'ASR', departure: '21:35', arrival: '02:10',
        status: 'Running', delay: 0, speed: 95, lat: 28.6139, lon: 77.2090,
    },
    '11001': {
        trainNo: '11001', trainName: 'Udyan Express',
        from: 'CST', to: 'SBC', departure: '08:05', arrival: '06:05',
        status: 'Running', delay: 30, speed: 65, lat: 15.8497, lon: 74.4977,
    },
    '12009': {
        trainNo: '12009', trainName: 'Shatabdi Express (Mumbai-Ahmedabad)',
        from: 'MMCT', to: 'ADI', departure: '06:25', arrival: '13:00',
        status: 'Running', delay: 0, speed: 120, lat: 21.5222, lon: 70.4579,
    },
    '12650': {
        trainNo: '12650', trainName: 'Karnataka Sampark Kranti',
        from: 'YPR', to: 'NZM', departure: '21:40', arrival: '06:30',
        status: 'Running', delay: 15, speed: 90, lat: 23.2599, lon: 77.4126,
    },
};

// ─── Mock Schedules ────────────────────────────────────────────────────────────
const MOCK_SCHEDULES = {
    '12951': [
        { station: 'Mumbai Central', code: 'MMCT', arrival: '--', departure: '17:00', day: 1, distance: 0, lat: 18.9690, lon: 72.8205 },
        { station: 'Vadodara Junction', code: 'BRC', arrival: '21:05', departure: '21:10', day: 1, distance: 392, lat: 22.3003, lon: 73.2085 },
        { station: 'Ratlam Junction', code: 'RTM', arrival: '23:35', departure: '23:40', day: 1, distance: 579, lat: 23.3475, lon: 75.0376 },
        { station: 'Kota Junction', code: 'KOTA', arrival: '02:00', departure: '02:05', day: 2, distance: 851, lat: 25.1803, lon: 75.8560 },
        { station: 'Mathura Junction', code: 'MTJ', arrival: '06:00', departure: '06:05', day: 2, distance: 1260, lat: 27.4927, lon: 77.6737 },
        { station: 'New Delhi', code: 'NDLS', arrival: '08:35', departure: '--', day: 2, distance: 1385, lat: 28.6414, lon: 77.2194 },
    ],
    '12302': [
        { station: 'Howrah Junction', code: 'HWH', arrival: '--', departure: '14:05', day: 1, distance: 0, lat: 22.5839, lon: 88.3424 },
        { station: 'Dhanbad Junction', code: 'DHN', arrival: '17:40', departure: '17:45', day: 1, distance: 263, lat: 23.7988, lon: 86.4304 },
        { station: 'Gaya Junction', code: 'GAYA', arrival: '19:35', departure: '19:40', day: 1, distance: 403, lat: 24.7955, lon: 84.9994 },
        { station: 'Mughal Sarai Junction', code: 'MGS', arrival: '22:07', departure: '22:17', day: 1, distance: 630, lat: 25.2791, lon: 83.1183 },
        { station: 'Allahabad Junction', code: 'ALD', arrival: '00:15', departure: '00:20', day: 2, distance: 743, lat: 25.4358, lon: 81.8463 },
        { station: 'Kanpur Central', code: 'CNB', arrival: '02:22', departure: '02:25', day: 2, distance: 870, lat: 26.4641, lon: 80.3388 },
        { station: 'New Delhi', code: 'NDLS', arrival: '09:55', departure: '--', day: 2, distance: 1441, lat: 28.6414, lon: 77.2194 },
    ],
    '12009': [
        { station: 'Mumbai Central', code: 'MMCT', arrival: '--', departure: '06:25', day: 1, distance: 0, lat: 18.9690, lon: 72.8205 },
        { station: 'Borivali', code: 'BVI', arrival: '06:58', departure: '06:59', day: 1, distance: 31, lat: 19.2288, lon: 72.8543 },
        { station: 'Surat', code: 'ST', arrival: '08:48', departure: '08:53', day: 1, distance: 263, lat: 21.1702, lon: 72.8311 },
        { station: 'Vadodara Junction', code: 'BRC', arrival: '09:51', departure: '09:56', day: 1, distance: 392, lat: 22.3003, lon: 73.2085 },
        { station: 'Anand Junction', code: 'ANND', arrival: '10:22', departure: '10:24', day: 1, distance: 443, lat: 22.5479, lon: 72.9509 },
        { station: 'Ahmedabad Junction', code: 'ADI', arrival: '13:00', departure: '--', day: 1, distance: 491, lat: 23.0225, lon: 72.5714 },
    ],
};

// ─── Mock PNR Data ─────────────────────────────────────────────────────────────
const MOCK_PNR = {
    '1234567890': {
        pnrNo: '1234567890', trainNo: '12951', trainName: 'Mumbai Rajdhani Express',
        journeyDate: '25-Feb-2026', from: 'Mumbai Central', to: 'New Delhi', class: '2A',
        passengers: [
            { name: 'Passenger 1', bookingStatus: 'CNF', currentStatus: 'CNF/B2/23' },
            { name: 'Passenger 2', bookingStatus: 'CNF', currentStatus: 'CNF/B2/24' },
        ],
        chartStatus: 'Chart Prepared',
    },
    '9876543210': {
        pnrNo: '9876543210', trainNo: '12302', trainName: 'Howrah Rajdhani Express',
        journeyDate: '25-Feb-2026', from: 'Howrah Junction', to: 'New Delhi', class: '3A',
        passengers: [
            { name: 'Passenger A', bookingStatus: 'CNF', currentStatus: 'CNF/C4/41' },
        ],
        chartStatus: 'Chart Prepared',
    },
};

// ─── API Fetch Functions ───────────────────────────────────────────────────────
async function fetchTrainStatus(trainNo) {
    const cacheKey = `train_${trainNo}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    // Use mock if USE_MOCK_DATA=true or no real API key is provided
    const useMock =
        process.env.USE_MOCK_DATA === 'true' ||
        !process.env.INDIAN_RAIL_API_KEY ||
        process.env.INDIAN_RAIL_API_KEY === 'your_indianrailapi_key_here';

    if (!useMock) {
        try {
            const response = await axios.get(
                `https://indianrailapi.com/api/v2/TrainStatus/apikey/${process.env.INDIAN_RAIL_API_KEY}/TrainNumber/${trainNo}/`,
                { timeout: 8000 }
            );
            const data = transformIndianRailResponse(response.data, trainNo);
            cache.set(cacheKey, data);
            return data;
        } catch (err) {
            console.warn(`Live API failed for ${trainNo}: ${err.message}. Falling back to mock data.`);
        }
    }

    // Return simulated live mock data
    const base = MOCK_TRAINS[trainNo] || generateDynamicMock(trainNo);
    const result = simulateLivePosition(base);
    cache.set(cacheKey, result);
    return result;
}

async function fetchPNRStatus(pnrNo) {
    const cacheKey = `pnr_${pnrNo}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const useMock =
        process.env.USE_MOCK_DATA === 'true' ||
        !process.env.INDIAN_RAIL_API_KEY ||
        process.env.INDIAN_RAIL_API_KEY === 'your_indianrailapi_key_here';

    if (!useMock) {
        try {
            const response = await axios.get(
                `https://indianrailapi.com/api/v2/PNRStatus/apikey/${process.env.INDIAN_RAIL_API_KEY}/PNRNumber/${pnrNo}/`,
                { timeout: 8000 }
            );
            const data = response.data;
            cache.set(cacheKey, data, 30);
            return data;
        } catch (err) {
            console.warn(`PNR API failed for ${pnrNo}: ${err.message}. Falling back to mock.`);
        }
    }

    const mock = MOCK_PNR[pnrNo] || {
        error: 'PNR not found',
        pnrNo,
        note: 'Try PNR: 1234567890 or 9876543210 for demo data',
    };
    cache.set(cacheKey, mock, 30);
    return mock;
}

async function fetchSchedule(trainNo) {
    const schedule = MOCK_SCHEDULES[trainNo] || [
        { station: 'Source', code: 'SRC', arrival: '--', departure: '06:00', day: 1, distance: 0, lat: 20.0, lon: 78.0 },
        { station: 'Destination', code: 'DST', arrival: '18:00', departure: '--', day: 1, distance: 500, lat: 22.0, lon: 80.0 },
    ];
    return schedule;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
function transformIndianRailResponse(data, trainNo) {
    return {
        trainNo,
        trainName: data.TrainName || data.trainName || 'Unknown Train',
        status: data.TrainRunsOnDays || 'Running',
        currentStation: data.CurrentStation || '',
        delay: parseInt(data.Delay) || 0,
        lastUpdated: new Date().toISOString(),
        raw: data,
    };
}

function generateDynamicMock(trainNo) {
    return {
        trainNo,
        trainName: `Express Train ${trainNo}`,
        from: 'SRC', to: 'DST',
        status: 'Running',
        currentStation: 'En Route', currentStationCode: 'ENR',
        nextStation: 'Next Station', nextStationCode: 'NXT',
        delay: Math.floor(Math.random() * 20),
        speed: 90 + Math.floor(Math.random() * 40),
        lat: 20 + Math.random() * 10,
        lon: 76 + Math.random() * 8,
        lastUpdated: new Date().toISOString(),
        note: 'Mock data — train not in database',
    };
}

module.exports = { fetchTrainStatus, fetchPNRStatus, fetchSchedule, MOCK_TRAINS, MOCK_SCHEDULES };
