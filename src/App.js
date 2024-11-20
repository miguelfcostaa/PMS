import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import WelcomePage from './views/WelcomePage';
import SignIn from './views/SignIn';
import SignUp from './views/SignUp';
import Warning from './views/Warning';
import HomePage from './views/HomePage';
import CampaignsPage from './views/CampaignsPage';
import GamesPage from './views/GamesPage';
import ProfilePage from './views/ProfilePage';
import CreateCampaignPage from './views/CreateCampaignPage';
import CampaignSelectedPage from './views/CampaignSelectedPage';
import RoulettePage from './views/RoulettePage';
import Challenges from './views/Challenges';

function BackgroundColorWrapper({ children }) {
  const location = useLocation();

  useEffect(() => {
    const darkPages = ['/', '/signup', '/signin', '/warning'];
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
          <Route path="/campaign" element={<CampaignsPage />} />
          <Route path="/campaign/:id" element={<CampaignSelectedPage />} />
          <Route path='/challenges' element={<Challenges />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/roulette" element={<RoulettePage />}/>
          <Route path="/create-campaign" element={<CreateCampaignPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </BackgroundColorWrapper>
    </Router>
  );
}

export default App;
