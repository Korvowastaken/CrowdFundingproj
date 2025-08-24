import './App.css'
import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Registration from "./pages/registration"
import Home from "./pages/home"
import HomeEnhanced from "./pages/HomeEnhanced"
import HomeFinal from "./pages/HomeFinal"
import AdminDashboard from "./pages/AdminDashboard"
import Navigation from "./components/Navigation"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already authenticated (from localStorage)
  useEffect(() => {
    const authStatus = localStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (status) => {
    setIsAuthenticated(status);
    localStorage.setItem('adminAuthenticated', status);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
  };

  return (
    <>
      <Navigation isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Registration />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home-enhanced" element={<HomeEnhanced />} />
        <Route path="/home-final" element={<HomeFinal />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} onLogin={handleLogin}>
              <AdminDashboard onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </>
  )
}

export default App