import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuthContext } from "./AuthProvider";
import { useEffect } from "react";

const PrivateRoute: React.FC = () => {
  const { user, isLoading, getToken } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!user || !getToken())) {
      navigate("/login");
    }

  }, [isLoading, navigate, getToken, user]);

  if (!getToken()) {
    return <Navigate to="/login" />;
  }
  

  return <Outlet />;
};

export default PrivateRoute;
