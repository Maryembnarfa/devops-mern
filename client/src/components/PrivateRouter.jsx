import React from 'react'
import { Navigate } from 'react-router-dom';
const PrivateRoute = ({ user, children }) => {
    //const navigate = useNavigate();
    if (!user.isConnected) {
        return <Navigate to="/login" replace />
    }
    return children

}

export default PrivateRoute