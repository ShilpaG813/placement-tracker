import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <div className="text-xl font-bold">🎯 Placement Tracker</div>
      <div className="flex gap-6 items-center">
        <Link to="/dashboard" className="hover:text-blue-200">Dashboard</Link>
        <Link to="/applications" className="hover:text-blue-200">Applications</Link>
        <Link to="/profile" className="hover:text-blue-200">Profile</Link>
        <Link to="/reminders" className="hover:text-blue-200">Reminders</Link>
        <span className="text-blue-200">Hi, {user?.name}!</span>
        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-3 py-1 rounded font-semibold hover:bg-blue-50"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;