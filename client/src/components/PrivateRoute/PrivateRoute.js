import React from "react";
import { Outlet, Navigate, } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PrivateRoute() {
    const { email,name,id } = useSelector((state) => state.user);
    console.log(email)
    return (
      email != null ? <Outlet /> : <Navigate to="auth/login" replace/>
    )
  }