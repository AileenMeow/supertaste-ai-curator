import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ItineraryPage from './pages/ItineraryPage';
import ExplorePage from './pages/ExplorePage';
import SavedPage from './pages/SavedPage';
import EscapeGameHome from './pages/EscapeGame/EscapeGameHome';
import GameStoryline from './pages/EscapeGame/GameStoryline';
import GameComplete from './pages/EscapeGame/GameComplete';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/itinerary/:themeId" element={<ItineraryPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/escape-game" element={<EscapeGameHome />} />
        <Route path="/escape-game/:city" element={<GameStoryline />} />
        <Route path="/escape-game/:city/complete" element={<GameComplete />} />
      </Routes>
    </BrowserRouter>
  );
}
