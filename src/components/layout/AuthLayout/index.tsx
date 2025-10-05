
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const AuthLayout : React.FC = () => {
  const token = useSelector((state: any) => state.auth.token);
  const location = useLocation();
    return token? (
      <Navigate to="/home" state={{ from: location }} replace />
    ) : (
      <Outlet />
    );
};

export default AuthLayout;
