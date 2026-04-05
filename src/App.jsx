import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ItineraryPage from './pages/ItineraryPage';
import ExplorePage from './pages/ExplorePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/itinerary/:themeId" element={<ItineraryPage />} />
        <Route path="/explore" element={<ExplorePage />} />
      </Routes>
    </BrowserRouter>
  );
}
