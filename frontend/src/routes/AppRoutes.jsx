import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Layout from "../components/layout/Layout";
import InventoryList from "../pages/inventory/InventoryList";
import AddInventory from "../pages/inventory/AddInventory";
import PurchaseList from "../pages/purchase/PurchaseList";


// Temporary pages (until we build them properly)
const Dashboard = () => <h2>Dashboard</h2>;
const Purchase = () => <h2>Purchase</h2>;

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        {/* Inventory */}
        <Route
          path="/inventory"
          element={
            <Layout>
              <InventoryList />
            </Layout>
          }
        />

        {/* Add Inventory */}
        <Route
          path="/inventory/add"
          element={
            <Layout>
              <AddInventory />
            </Layout>
          }
        />


        {/* Purchase */}
        <Route
          path="/purchase"
          element={
            <Layout>
              <PurchaseList />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
