import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api.js";

const Settings = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await api.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      setMessage("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");

    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update password"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">

      <h1 className="text-2xl font-semibold">Settings</h1>

      {/* Account Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="text-lg font-medium">Account Information</h2>

        <div className="text-sm text-gray-600 space-y-1">
          <p>
            <span className="font-medium text-gray-800">Name:</span>{" "}
            {user?.name}
          </p>
          <p>
            <span className="font-medium text-gray-800">Email:</span>{" "}
            {user?.email}
          </p>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-medium mb-6">Change Password</h2>

        <form onSubmit={handleChangePassword} className="space-y-5">

          <div className="flex flex-col">
            <label className="text-sm text-gray-500 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-black"
              required
              disabled={loading}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-500 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-black"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="text-sm text-red-500">
              {error}
            </div>
          )}

          {message && (
            <div className="text-sm text-green-600">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2.5 rounded-xl text-white transition flex items-center gap-2
              ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:opacity-90"}
            `}
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {loading ? "Updating..." : "Update Password"}
          </button>

        </form>
      </div>

      {/* Logout */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium">Logout</h2>
          <p className="text-sm text-gray-500">
            Sign out from your account securely.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-6 py-2.5 rounded-xl hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

    </div>
  );
};

export default Settings;
