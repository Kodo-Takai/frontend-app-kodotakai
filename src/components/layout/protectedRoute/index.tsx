import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";

const ProtectedRoute = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
