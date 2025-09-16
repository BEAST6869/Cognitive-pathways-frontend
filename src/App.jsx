import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Courses from './pages/Courses';
import Colleges from './pages/Colleges';
import Profile from './pages/Profile';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-white transition-colors duration-200">
          <Navbar />
          <main className="">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/colleges" element={<Colleges />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
