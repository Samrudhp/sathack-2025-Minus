import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useUserStore } from './store';
import Home from './pages/Home';
import Scan from './pages/Scan';
import Voice from './pages/Voice';
import Result from './pages/Result';
import Map from './pages/Map';
import Impact from './pages/Impact';

function App() {
  const { user, setUser } = useUserStore();

  useEffect(() => {
    // Ensure user is initialized (for testing without auth)
    if (!user || !user.id) {
      console.log('Initializing mock user...');
      setUser({
        id: '673fc7f4f1867ab46b0a8c01',  // Valid ObjectId from backend seeded data
        name: 'Test User',
        phone: '+919876543210'
      });
    }
  }, [user, setUser]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/voice" element={<Voice />} />
        <Route path="/result" element={<Result />} />
        <Route path="/map" element={<Map />} />
        <Route path="/impact" element={<Impact />} />
      </Routes>
    </Router>
  );
}

export default App;
