import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import s from './App.module.css';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import { Header, ParticlesContainer } from '@/components';

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
