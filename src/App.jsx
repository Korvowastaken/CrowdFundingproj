import './App.css'
import { Routes, Route } from 'react-router-dom';
import Registration from "./pages/registration"
import Home from "./pages/home"
import AdminDashboard from "./pages/AdminDashboard"
import Navigation from "./components/Navigation"

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Registration />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </>
  )
}

export default App