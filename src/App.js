import { Routes, Route } from 'react-router-dom';

import MainPage from './pages/MainPage'
import SiteDetailPage from './pages/SiteDetailPage';
import BookPage from './pages/BookPage';
import LoginPage from './pages/LoginPage';
import OwnerPage from './pages/OwnerPage';
import SignUpPage from './pages/SignUpPage';
import MyPage from './pages/MyPage';
import FindPasswordPage from './pages/FindPasswordPage';
import BookResultPage from './pages/BookResultPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/detail" element={<SiteDetailPage />} />
      <Route path="/book" element={<BookPage/>} />
      <Route path="/book/result" element={<BookResultPage/>} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/owner" element={<OwnerPage/>} />
      <Route path="/signup" element={<SignUpPage/>} />
      <Route path="/mypage" element={<MyPage/>} />
      <Route path="/findpassword" element={<FindPasswordPage/>} />
    </Routes>
  );
}

export default App;
