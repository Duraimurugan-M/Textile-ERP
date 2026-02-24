import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import styles from "./Dashboard.module.css";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [range, setRange] = useState("monthly");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get(`/dashboard?range=${range}`);
        setData(res.data.data || res.data);
      } catch (err) {
        console.error("Dashboard Error:", err);
      }
    };

    fetchDashboard();
  }, [range]);

  if (!data) return <p>Loading dashboard...</p>;

  /* ---------------- CHART DATA ---------------- */

  const chartData = {
    labels:
      data.monthlySales?.map((item) => {
        if (range === "yearly") return item._id.year;
        if (range === "weekly") return `W${item._id.week}`;
        if (range === "daily")
          return `${item._id.day}/${item._id.month}`;
        return `${item._id.month}/${item._id.year}`;
      }) || [],
    datasets: [
      {
        label: "Sales",
        data:
          data.monthlySales?.map((item) => item.totalSales) || [],
        backgroundColor: "#4f46e5",
      },
    ],
  };

  /* ---------------- UI ---------------- */

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Management Dashboard</h1>

      {/* ================= KPI CARDS ================= */}
      <div className={styles.kpiGrid}>
        <div className={styles.card}>
          <h4>Total Stock Qty</h4>
          <p>{data.totalStockQuantity ?? 0}</p>
        </div>

        <div className={styles.card}>
          <h4>Total Stock Value</h4>
          <p>₹ {data.totalStockValue ?? 0}</p>
        </div>

        <div className={styles.card}>
          <h4>Today's Production</h4>
          <p>{data.todayProductionCount ?? 0}</p>
        </div>

        <div className={styles.card}>
          <h4>Today's Sales</h4>
          <p>₹ {data.todaySalesAmount ?? 0}</p>
        </div>

        {/* ✅ LOW STOCK */}
        <div
          className={`${styles.card} ${styles.alertCard}`}
          onClick={() => navigate("/inventory?lowStock=true")}
        >
          <h4>Low Stock Alerts</h4>
          <p>{data.lowStockCount ?? 0}</p>
        </div>

        {/* ✅ QC PENDING FIXED */}
        <div
          className={`${styles.card} ${styles.warningCard}`}
          onClick={() => navigate("/qc?status=Pending")}
        >
          <h4>QC Pending</h4>
          <p>{data.qcPendingCount ?? 0}</p>
        </div>
      </div>

      {/* ================= BOTTOM SECTION ================= */}
      <div className={styles.bottomGrid}>
        {/* -------- TOP CUSTOMERS -------- */}
        <div className={styles.tableSection}>
          <h3>Top Customers</h3>
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Total Purchase</th>
                <th>Orders</th>
                <th>Last Purchase</th>
                <th>Main Product</th>
              </tr>
            </thead>
            <tbody>
              {data.topCustomers?.length > 0 ? (
                data.topCustomers.map((cust) => (
                  <tr key={cust.customerName}>
                    <td>{cust.customerName}</td>
                    <td>₹ {cust.totalPurchase}</td>
                    <td>{cust.totalOrders}</td>
                    <td>
                      {cust.lastPurchase
                        ? new Date(cust.lastPurchase).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>{cust.mostProduct}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No customer data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* -------- SALES CHART -------- */}
        <div className={styles.chartSection}>
          <div className={styles.chartHeader}>
            <h3>Sales Overview</h3>

            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <Bar data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;