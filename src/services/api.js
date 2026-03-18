import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const api = axios.create({ baseURL: BASE, timeout: 10000 });

export async function fetchTrainStatus(trainNo) {
    const { data } = await api.get(`/api/train/${trainNo}`);
    return data.data;
}

export async function fetchSchedule(trainNo) {
    try {
        const { data } = await api.get(`/api/train/${trainNo}/schedule`);
        return data.data || [];
    } catch { return []; }
}

export async function fetchPNRStatus(pnrNo) {
    const { data } = await api.get(`/api/pnr/${pnrNo}`);
    return data.data;
}

export async function searchStations(q) {
    try {
        const { data } = await api.get(`/api/stations?q=${encodeURIComponent(q)}`);
        return data.data || [];
    } catch { return []; }
}
