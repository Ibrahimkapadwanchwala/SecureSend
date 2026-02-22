import { useEffect, useState } from "react";
import api from "../services/api";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [reason, setReason] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [freezeLoading, setFreezeLoading] = useState(false);
  const [unfreezeLoading, setUnfreezeLoading] = useState(null);

  const [toast, setToast] = useState(null);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/admin/get-users");
      setUsers(data.data);
    } catch {
      setToast("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openFreezeModal = (user) => {
    setSelectedUser(user);
    setReason("");
    setShowModal(true);
  };

  const confirmFreeze = async () => {
    if (!reason.trim()) {
      setToast("Freeze reason is required");
      return;
    }

    try {
      setFreezeLoading(true);
      await api.post(`/admin/freeze/${selectedUser.id}`, { reason });

      setToast("User frozen successfully");
      setShowModal(false);
      setSelectedUser(null);
      fetchUsers();
    } catch {
      setToast("Failed to freeze user");
    } finally {
      setFreezeLoading(false);
    }
  };

  const unfreeze = async (id) => {
    try {
      setUnfreezeLoading(id);
      await api.post(`/admin/unfreeze/${id}`);
      setToast("User unfrozen successfully");
      fetchUsers();
    } catch {
      setToast("Failed to unfreeze user");
    } finally {
      setUnfreezeLoading(null);
    }
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="p-4 sm:p-6 md:p-8 relative">
      <h1 className="text-xl sm:text-2xl font-semibold mb-6">
        Admin Panel
      </h1>

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 sm:top-6 sm:right-6 bg-black text-white px-5 py-3 rounded-xl shadow-lg z-50 text-sm">
          {toast}
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.role}</td>
                <td className="p-4 flex items-center gap-3">
                  {user.is_frozen ? (
                    <>
                      <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-600 font-medium">
                        Frozen
                      </span>

                      <button
                        onClick={() => unfreeze(user.id)}
                        disabled={unfreezeLoading === user.id}
                        className={`px-3 py-1 rounded-lg text-white transition
                          ${
                            unfreezeLoading === user.id
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-green-500 hover:bg-green-600"
                          }
                        `}
                      >
                        {unfreezeLoading === user.id
                          ? "Unfreezing..."
                          : "Unfreeze"}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => openFreezeModal(user)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                    >
                      Freeze
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 space-y-3"
          >
            <div className="flex justify-between text-sm">
              <span className="font-medium">Name</span>
              <span>{user.name}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="font-medium">Email</span>
              <span className="break-all">{user.email}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="font-medium">Role</span>
              <span>{user.role}</span>
            </div>

            <div className="flex justify-between items-center">
              {user.is_frozen ? (
                <>
                  <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-600 font-medium">
                    Frozen
                  </span>

                  <button
                    onClick={() => unfreeze(user.id)}
                    disabled={unfreezeLoading === user.id}
                    className={`px-3 py-1 rounded-lg text-white transition text-sm
                      ${
                        unfreezeLoading === user.id
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-600"
                      }
                    `}
                  >
                    {unfreezeLoading === user.id
                      ? "Unfreezing..."
                      : "Unfreeze"}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => openFreezeModal(user)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-sm"
                >
                  Freeze
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Freeze Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-5">
            <h2 className="text-lg font-semibold">
              Freeze {selectedUser?.name}
            </h2>

            <textarea
              placeholder="Enter freeze reason..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-black"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl border hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={confirmFreeze}
                disabled={freezeLoading}
                className={`px-4 py-2 rounded-xl text-white flex items-center gap-2 transition
                  ${
                    freezeLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  }
                `}
              >
                {freezeLoading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {freezeLoading ? "Freezing..." : "Confirm Freeze"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
