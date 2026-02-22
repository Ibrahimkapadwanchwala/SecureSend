import { useEffect, useState } from "react";
import api from "../services/api.js";

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get("/wallet/transactions?page=1&limit=10");
        setTransactions(res.data.transactions);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return <div className="text-gray-400">Loading transactions...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-gray-500 border-b">
            <tr>
              <th className="text-left py-2">Type</th>
              <th className="text-left py-2">Amount</th>
              <th className="text-left py-2">Status</th>
              <th className="text-left py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b last:border-none">
                <td className="py-2">
                  {tx.direction === "DEBIT" ? (
                    <span className="text-red-500">Debit</span>
                  ) : (
                    <span className="text-green-600">Credit</span>
                  )}
                </td>

                <td className="py-2">
                  ₹ {Number(tx.amount).toLocaleString()}
                </td>

                <td className="py-2">{tx.status}</td>

                <td className="py-2">
                  {new Date(tx.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
