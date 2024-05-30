import { Routes, Route } from 'react-router-dom';

import MainPage from './pages/MainPage'
import SiteDetailPage from './pages/SiteDetailPage';
import BookPage from './pages/BookPage';
import LoginPage from './pages/LoginPage';
import OwnerPage from './pages/OwnerPage';
import SignUpPage from './pages/SignUpPage';
import MyPage from './pages/MyPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/detail" element={<SiteDetailPage />} />
      <Route path="/book" element={<BookPage/>} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/owner" element={<OwnerPage/>} />
      <Route path="/signup" element={<SignUpPage/>} />
      <Route path="/mypage" element={<MyPage/>} />
    </Routes>
  );
}

export default App;
