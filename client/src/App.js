// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import NoAccess from './pages/NoAccess';
import NotFound from './pages/NotFound';
import PrivateRouter from './components/PrivateRouter';
import Users from './pages/users';
import Delivery from './pages/dilevery/listDilevery';
import Vehicle from './pages/vehicle/listVehicle';
import AdminRouter from './components/AdminRouter';
import AllRouter from './components/AllRouter';
import TrackDelivery from './pages/suiviCommande';
function App() {
  // Récupérer le token et le rôle depuis localStorage
  const token = localStorage.getItem("jwt");
  const userRole = localStorage.getItem("userRole")
  //objet user
  const user = {
    isConnected: token !== null,
    role: userRole,
  };
  return (
    <Router>
      <Routes>
        {/* La route de login */}
        <Route path="/login" element={<Login />} />

        {/* La route de dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />


        {/* Routes protégées */}
        <Route path="/users" element={
          <AdminRouter user={user}>
            <Users />
          </AdminRouter>
        } />

        <Route path="/delivry" element={
          <AllRouter user={user}>
            <Delivery />
          </AllRouter>
        } />


        <Route path="/vehicle" element={
          <AdminRouter user={user}>
            <Vehicle />
          </AdminRouter>
        } />
        <Route path="/tracking-ordres" element={<TrackDelivery />} /> {/* Route publique */}


        <Route path="*" element={<NotFound />} />
        <Route path="/noaccess" element={<NoAccess />} />

      </Routes>
    </Router>
  );
}

export default App;
