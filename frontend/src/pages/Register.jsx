import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from '../services/api.js';

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");

  const navigate = useNavigate();

  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setEmailError("");


    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      setLoading(false);
      navigate("/login");

    } catch (err) {
      setLoading(false);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">

        <h1 className="text-2xl font-semibold text-center">
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-black"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

        
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
            />

            {emailError && (
              <p className="text-sm text-red-500 mt-1">
                {emailError}
              </p>
            )}
          </div>

      
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 pr-16 focus:outline-none focus:ring-2 focus:ring-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 pr-16 focus:outline-none focus:ring-2 focus:ring-black"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {error && (
            <div className="text-sm text-red-500">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-xl text-white transition
              ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:opacity-90"}
            `}
          >
            {loading ? "Creating..." : "Register"}
          </button>

        </form>

        <p className="text-sm text-center text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-black font-medium">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
