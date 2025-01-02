import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, allowedRoles, ...rest }) => {
  const userData = JSON.parse(localStorage.getItem('navigateState'));

  if (!userData || !userData.U_desig || !allowedRoles.includes(userData.U_desig)) {
    return <Navigate to="/" />;
  }

  return <Component {...rest} />;
};

export default ProtectedRoute;
