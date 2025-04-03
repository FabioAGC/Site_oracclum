import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Questions from './pages/Questions';
import SeeQuestions from './pages/SeeQuestions';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/see-questions" element={<SeeQuestions />} />
      </Routes>
    </div>
  );
}

export default App;
