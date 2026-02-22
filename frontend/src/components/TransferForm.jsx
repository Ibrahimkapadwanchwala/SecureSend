import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import api from "../services/api.js";

const TransferForm = ({ onTransferSuccess }) => {

  const [receiverId, setReceiverId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setMessage(null);

    const key = idempotencyKey || uuidv4();
    setIdempotencyKey(key);

    try {
      const res = await api.post("/wallet/transfer", {
        receiverId: Number(receiverId),
        amount: Number(amount),
        idempotencyKey: key,
      });

      setMessage("Transfer successful.");

    
      setReceiverId("");
      setAmount("");
      setIdempotencyKey(null);
      onTransferSuccess();
    

    } catch (err) {
      setError(
        err.response?.data?.message || "Transfer failed. Please retry."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 md:p-8">
      <h2 className="text-lg sm:text-xl font-semibold mb-6">
        Send Money
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="flex flex-col">
            <label className="text-sm text-gray-500 mb-1">
              Receiver ID
            </label>
            <input
              type="text"
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-black transition"
              required
              disabled={loading}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-500 mb-1">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-black transition"
              required
              min="1"
              disabled={loading}
            />
          </div>

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
          className={`w-full py-2.5 sm:py-3 rounded-xl text-white transition duration-150 flex items-center justify-center gap-2
            ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:opacity-90 active:scale-[0.99]"}
          `}
        >
          {loading && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          {loading ? "Processing..." : "Transfer"}
        </button>

      </form>
    </div>
  );
};

export default TransferForm;
