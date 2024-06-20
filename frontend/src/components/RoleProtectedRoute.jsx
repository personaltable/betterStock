import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const RoleProtectedRoute = ({ allowedRoles }) => {
    const { userInfo } = useSelector((state) => state.auth);
    const userHasAccess = userInfo && (allowedRoles.includes(userInfo.role) || userInfo.role === 'admin');

    return userHasAccess ? <Outlet /> : <Navigate to="/welcome" />;
};

export default RoleProtectedRoute;
