import { Route, Routes, Navigate } from "react-router-dom";
import AdminLayout from "layouts/Admin.js";
import UserLayout from "layouts/User.js";
import AuthLayout from "layouts/Auth.js";
import PrivateRoute from 'components/PrivateRoute/PrivateRoute';

function App(){
    return (
        <Routes>
          <Route element={<PrivateRoute/>}>
            <Route path="/admin/*" element={<AdminLayout /> } />
          </Route>
          <Route element={<PrivateRoute/>}>
            <Route path="/user/*" element={<UserLayout /> } />
          </Route>
          <Route path="/auth/*" element={  <AuthLayout />} />
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
    )
}
export default App;