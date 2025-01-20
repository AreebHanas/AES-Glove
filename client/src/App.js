import { useEffect, useState } from 'react'
import { Route, Routes, Navigate } from "react-router-dom"

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";

function App(){
    const [isAuthenticated,setIsAuthenticates] = useState(false)
    const token = localStorage.getItem("authToken")
    useEffect(()=>{
        token ? setIsAuthenticates(true):setIsAuthenticates(false)
    },[token])

    return (
        <Routes>
          <Route path="/admin/*" element={ isAuthenticated? <AdminLayout /> : <Navigate to='/auth/login'/>} />
          <Route path="/auth/*" element={  <AuthLayout />} />
          <Route path="*" element={<Navigate to="auth/login" replace />} />
        </Routes>
    )
}
export default App;