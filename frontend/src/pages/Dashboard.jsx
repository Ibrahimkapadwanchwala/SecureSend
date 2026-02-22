import BalanceCard from "../components/BalanceCard";
import TransferForm from "../components/TransferForm";
import TransactionTable from "../components/TransactionTable";
import { useState } from "react";
const Dashboard = () => {
  const [refreshKey, setRefreshKey] = useState(0);
const [refreshBalance, setRefreshBalance] = useState(0);

  const refreshData = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-8">
     <BalanceCard refreshKey={refreshBalance} />

<TransferForm onTransferSuccess={() => {
  setRefreshBalance(prev => prev + 1);
}} />

     
      <TransactionTable key={refreshKey} />
    </div>
  );
};
export default Dashboard;