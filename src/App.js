import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import WelcomePage from './views/WelcomePage';
import SignIn from './views/SignIn';
import SignUp from './views/SignUp';
import Warning from './views/Warning';
import HomePage from './views/HomePage';
import CategoriesPage from './views/CategoriesPage';
import GamesPage from './views/GamesPage';
import ProfilePage from './views/ProfilePage';

function BackgroundColorWrapper({ children }) {
  const location = useLocation();

  useEffect(() => {
    const darkPages = ['/', '/signup', '/signin', '/warning', '/profile'];
    if (darkPages.includes(location.pathname)) {
      document.body.style.backgroundColor = '#183059';
    } else {
      document.body.style.backgroundColor = '#E8E8E8';
    }
  }, [location]);

  return children;
}

function App() {
  return (
    <Router>
      <BackgroundColorWrapper>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/warning" element={<Warning />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/games" element={<GamesPage />} />

          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </BackgroundColorWrapper>
    </Router>
  );
}

export default App;
