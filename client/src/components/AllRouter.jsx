import React from 'react';
import { Navigate } from 'react-router-dom';

const AllRouter = ({ user, children }) => {
    if (!user.isConnected) {
        return <Navigate to="/login" replace />;
    } else {
        if (user.role !== "ADMIN" && user.role !== "EXPEDITEUR") {
            return <Navigate to="/noaccess" replace />;
        }
    }
    return children;
};

export default AllRouter;
