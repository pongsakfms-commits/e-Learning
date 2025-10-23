import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScoresOverview from './components/ScoresOverview';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <h1>📚 E-Learning Admin - จัดการข้อมูลคะแนนสอบ</h1>
        </nav>
        <Routes>
          <Route path="/" element={<ScoresOverview />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
