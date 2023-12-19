import { Outlet, Navigate } from 'react-router-dom';
import { useAuthContext } from "../../hooks/useContexts";

export default function PrivateRoute() {
  const {authenticated} = useAuthContext();

  return authenticated ? <Outlet /> : <Navigate to='/'/>;
  
}