import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Layout from "../components/layout/Layout";
import Dashboard from "../pages/dashboard/Dashboard";
import InventoryList from "../pages/inventory/InventoryList";
import AddInventory from "../pages/inventory/AddInventory";
import PurchaseList from "../pages/purchase/PurchaseList";
import AddPurchase from "../pages/purchase/AddPurchase";
import ProductionList from "../pages/production/ProductionList";
import AddProduction from "../pages/production/AddProduction";
import SalesList from "../pages/sales/SalesList";
import AddSales from "../pages/sales/AddSales";
import CustomerList from "../pages/customer/CustomerList";
import AddCustomer from "../pages/customer/AddCustomer";
import SupplierList from "../pages/supplier/SupplierList";
import AddSupplier from "../pages/supplier/AddSupplier";
import QCList from "../pages/qc/QCList";
import AddQC from "../pages/qc/AddQC";
import StockMovementList from "../pages/stockMovement/StockMovementList";
import YarnList from "../pages/yarn/YarnList";
import AddYarn from "../pages/yarn/AddYarn";

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

        <Route
          path="/production"
          element={
            <Layout>
              <ProductionList />
            </Layout>
          }
        />

        <Route
          path="/production/add"
          element={
            <Layout>
              <AddProduction />
            </Layout>
          }
        />

        <Route
          path="/sales"
          element={
            <Layout>
              <SalesList />
            </Layout>
          }
        />

        <Route
          path="/sales/add"
          element={
            <Layout>
              <AddSales />
            </Layout>
          }
        />

        <Route
          path="/customer"
          element={
            <Layout>
              <CustomerList />
            </Layout>
          }
        />

        <Route
          path="/customer/add"
          element={
            <Layout>
              <AddCustomer />
            </Layout>
          }
        />

        <Route
          path="/supplier"
          element={
            <Layout>
              <SupplierList />
            </Layout>
          }
        />

        <Route
          path="/supplier/add"
          element={
            <Layout>
              <AddSupplier />
            </Layout>
          }
        />

        <Route
          path="/qc"
          element={
            <Layout>
              <QCList />
            </Layout>
          }
        />

        <Route
          path="/qc/add"
          element={
            <Layout>
              <AddQC />
            </Layout>
          }
        />

        <Route
          path="/stock-movement"
          element={
            <Layout>
              <StockMovementList />
            </Layout>
          }
        />

        <Route
          path="/yarn"
          element={
            <Layout>
              <YarnList />
            </Layout>
          }
        />

        <Route
          path="/yarn/add"
          element={
            <Layout>
              <AddYarn />
            </Layout>
          }
        />
        
      </Routes>
    </BrowserRouter>

  );
};

export default AppRoutes;