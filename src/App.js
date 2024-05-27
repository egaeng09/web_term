import { Routes, Route } from 'react-router-dom';

import MainPage from './pages/MainPage'
import SiteDetailPage from './pages/SiteDetailPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/detail" element={<SiteDetailPage />} />
    </Routes>
  );
}

export default App;
