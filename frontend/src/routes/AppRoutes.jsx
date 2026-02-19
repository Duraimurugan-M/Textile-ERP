import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Layout from "../components/layout/Layout";
import InventoryList from "../pages/inventory/InventoryList";
import AddInventory from "../pages/inventory/AddInventory";
import PurchaseList from "../pages/purchase/PurchaseList";
import AddPurchase from "../pages/purchase/AddPurchase";
import ProductionList from "../pages/production/ProductionList";
import AddProduction from "../pages/production/AddProduction";


const Dashboard = () => <h2>Dashboard</h2>;

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        <Route
          path="/inventory"
          element={
            <Layout>
              <InventoryList />
            </Layout>
          }
        />

        <Route
          path="/inventory/add"
          element={
            <Layout>
              <AddInventory />
            </Layout>
          }
        />

        <Route
          path="/purchase"
          element={
            <Layout>
              <PurchaseList />
            </Layout>
          }
        />

        <Route
          path="/purchase/add"
          element={
            <Layout>
              <AddPurchase />
            </Layout>
          }
        />
        {/* Production List */}
        <Route
          path="/production"
          element={
            <Layout>
              <ProductionList />
            </Layout>
          }
        />

        {/* Add Production */}
        <Route
          path="/production/add"
          element={
            <Layout>
              <AddProduction />
            </Layout>
          }
        />


      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
