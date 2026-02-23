import { useEffect, useState } from "react";
import API from "../../api/axios";
import styles from "./Dashboard.module.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/dashboard");
      setData(res.data.data);
    } catch (error) {
      console.error("Dashboard error", error);
    }
  };

  if (!data) return <p>Loading dashboard...</p>;

  // 🔹 Monthly Sales Chart Data
  const chartData = {
    labels: data.monthlySales.map(
      (item) => `${item._id.month}/${item._id.year}`
    ),
    datasets: [
      {
        label: "Monthly Sales",
        data: data.monthlySales.map((item) => item.totalSales),
        backgroundColor: "#4f46e5",
      },
    ],
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Management Dashboard</h2>

      {/* KPI CARDS */}
      <div className={styles.cardGrid}>
        <div className={styles.card}>
          <h4>Total Stock Qty</h4>
          <p>{data.totalStockQuantity}</p>
        </div>

        <div className={styles.card}>
          <h4>Total Stock Value</h4>
          <p>₹ {data.totalStockValue}</p>
        </div>

        <div className={styles.card}>
          <h4>Today's Production</h4>
          <p>{data.todayProductionCount}</p>
        </div>

        <div className={styles.card}>
          <h4>Today's Sales</h4>
          <p>₹ {data.todaySalesAmount}</p>
        </div>

        <div className={styles.cardAlert}>
          <h4>Low Stock Alerts</h4>
          <p>{data.lowStockCount}</p>
        </div>

        <div className={styles.cardWarning}>
          <h4>QC Pending</h4>
          <p>{data.qcPendingCount}</p>
        </div>
      </div>

      {/* TOP CUSTOMERS */}
      <div className={styles.section}>
        <h3>Top Customers</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Total Purchase</th>
            </tr>
          </thead>
          <tbody>
            {data.topCustomers.map((cust, index) => (
              <tr key={index}>
                <td>{cust.customerName}</td>
                <td>₹ {cust.totalPurchase}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MONTHLY SALES GRAPH */}
      <div className={styles.section}>
        <h3>Monthly Sales Overview</h3>
        <Bar data={chartData} />
      </div>
    </div>
  );
};

export default Dashboard;