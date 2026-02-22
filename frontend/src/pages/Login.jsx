import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api.js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isRateLimited, setIsRateLimited] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useAuth();
  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setEmailError("");
    setIsRateLimited(false);

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/login", {
        email,
        password,
      });

      const { data } = await api.get("/auth/me");
      console.log(data.user.role);
      
      setUser(data.user);

      if (data.user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }

      navigate("/");
    } catch (err) {
      const status = err.response?.status;

      if (status === 429) {
        setError("Too many login attempts. Try again after 10 minutes.");
        setIsRateLimited(true);
      } else if (status === 400) {
        setError("Invalid email or password.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
        <h1 className="text-2xl font-semibold text-center">SecureSend Login</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
        
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError("");
              }}
              onBlur={() => {
                if (email && !validateEmail(email)) {
                  setEmailError("Please enter a valid email address");
                }
              }}
              className={`w-full border rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 transition
                ${
                  emailError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-black"
                }
              `}
              required
              disabled={loading || isRateLimited}
            />

            {emailError && (
              <p className="text-sm text-red-500 mt-1">{emailError}</p>
            )}
          </div>

       
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 pr-16 focus:outline-none focus:ring-2 focus:ring-black"
              required
              disabled={loading || isRateLimited}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {error && <div className="text-sm text-red-500">{error}</div>}

          <button
            type="submit"
            disabled={loading || isRateLimited}
            className={`w-full py-2.5 rounded-xl text-white transition
              ${
                loading || isRateLimited
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:opacity-90"
              }
            `}
          >
            {loading
              ? "Logging in..."
              : isRateLimited
              ? "Temporarily Locked"
              : "Login"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500">
          Don’t have an account?{" "}
          <Link to="/register" className="text-black font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
