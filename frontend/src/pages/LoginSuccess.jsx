import { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const LoginSuccess = () => {
  const { setUserFromToken } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      // Store token and update user state
      setUserFromToken(token);
      navigate("/"); // redirect to home or dashboard
    } else {
      navigate("/login"); // fallback
    }
  }, [searchParams, navigate, setUserFromToken]);

  return <div className="text-center mt-20">Logging in...</div>;
};

export default LoginSuccess;
