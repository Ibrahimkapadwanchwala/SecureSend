import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashBoardLayout";
import AuditLogs from "./pages/AuditLogs";
import Admin from "./pages/Admin";
import RoleRedirect from "./components/RoleRedirect";
import Settings from "./components/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import TransactionTable from "./components/TransactionTable";
import AdminLayout from "./layouts/AdminLayout";
function App() {
  return (
    <BrowserRouter>
     <Routes>

  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  
  <Route
    path="/"
    element={
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<RoleRedirect />} />
    <Route path="transactions" element={<TransactionTable />} />
    <Route path="settings" element={<Settings />} />
  </Route>

  <Route
    path="/admin"
    element={
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    }
  >
    <Route index element={<Admin />} />
    <Route path="audit" element={<AuditLogs />} />
  </Route>

</Routes>

    </BrowserRouter>
  );
}

export default App;
