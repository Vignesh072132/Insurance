import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Policies from './pages/Policies';
import Claims from './pages/Claims';
import SubmitClaim from './pages/SubmitClaim';
import Admin from './pages/Admin';
import CreatePolicy from './pages/CreatePolicy';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/policies" element={<PrivateRoute><Policies /></PrivateRoute>} />
            <Route path="/create-policy" element={<PrivateRoute><CreatePolicy /></PrivateRoute>} />
            <Route path="/claims" element={<PrivateRoute><Claims /></PrivateRoute>} />
            <Route path="/submit-claim" element={<PrivateRoute><SubmitClaim /></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
