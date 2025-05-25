import React from "react";
import { Outlet, Navigate, } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PrivateRoute({ allowedRoles }) {
    const { email, userRole } = useSelector((state) => state.user.user);
    console.log('privateRoute',userRole)
    const isAllowed = email && (!allowedRoles || allowedRoles.includes(userRole));
    return (
      isAllowed ? <Outlet /> : <Navigate to="/auth/login" replace />
    );
  }