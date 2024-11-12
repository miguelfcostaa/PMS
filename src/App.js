import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './views/WelcomePage';
import SignIn from './views/SignIn';
import SignUp from './views/SignUp';
import Warning from './views/Warning';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/warning" element={<Warning />} />
      </Routes>
    </Router>
  );
}

export default App;
