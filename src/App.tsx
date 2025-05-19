import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import s from './App.module.css';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import ParticlesContainer from './components/ParticlesContainer';

function App() {
  return (
    <Router>
      <div id="appBody" className={s.container}>
        <Header />
        <ParticlesContainer />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
