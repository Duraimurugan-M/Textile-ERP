import { useEffect, useState } from "react";
import API from "../../api/axios";
import styles from "./SalesList.module.css";
import { Link } from "react-router-dom";

const SalesList = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSales = async () => {
    try {
      const { data } = await API.get("/sales");
      setSales(data.data);
    } catch (error) {
      console.error("Error fetching sales", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Sales Management</h2>
        <Link to="/sales/add" className={styles.addBtn}>
          + Add Sale
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Material</th>
                <th>Lot</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {sales.length === 0 ? (
                <tr>
                  <td colSpan="6" className={styles.noData}>
                    No sales records found
                  </td>
                </tr>
              ) : (
                sales.map((item) => (
                  <tr key={item._id}>
                    <td>{item.customerName}</td>
                    <td>{item.materialType}</td>
                    <td>{item.lotNumber}</td>
                    <td>{item.quantity}</td>
                    <td>{item.ratePerUnit}</td>
                    <td>{item.totalAmount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SalesList;
