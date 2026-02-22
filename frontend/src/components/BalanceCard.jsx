import { useEffect, useState } from "react";
import api from "../services/api";
const BalanceCard = ({ refreshKey }) => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setLoading(true);
        const res = await api.get("/wallet/balance");
        setBalance(res.data.balance);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [refreshKey]);   

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-gray-500 text-sm">Available Balance</h2>

      {loading ? (
        <div className="mt-2 text-gray-400">Loading...</div>
      ) : (
        <div className="text-3xl font-semibold mt-2">
          ₹ {Number(balance).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default BalanceCard;
