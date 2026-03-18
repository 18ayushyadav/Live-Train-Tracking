import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TrainStatus from './pages/TrainStatus';
import PNRStatus from './pages/PNRStatus';
import About from './pages/About';

export default function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/train/:no?" element={<TrainStatus />} />
                <Route path="/pnr/:no?" element={<PNRStatus />} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<Home />} />
            </Routes>
        </>
    );
}
