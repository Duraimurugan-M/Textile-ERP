import { useEffect, useState } from "react";
import API from "../../api/axios";
import styles from "./StockMovement.module.css";

const StockMovementList = () => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMovements = async () => {
    try {
      const { data } = await API.get("/stock-movement");
      setMovements(data.data);
    } catch (error) {
      console.error("Error fetching stock movement", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Stock Movement Ledger</h2>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Material</th>
                <th>Lot No</th>
                <th>Type</th>
                <th>Module</th>
                <th>Qty</th>
                <th>Previous</th>
                <th>New</th>
                <th>User</th>
              </tr>
            </thead>
            <tbody>
              {movements.length === 0 ? (
                <tr>
                  <td colSpan="10" className={styles.noData}>
                    No stock movements found
                  </td>
                </tr>
              ) : (
                movements.map((item) => (
                  <tr key={item._id}>
                    <td>{item.date}</td>
                    <td>{item.time}</td>
                    <td>{item.materialType}</td>
                    <td>{item.lotNumber}</td>
                    <td>
                      <span
                        className={
                          item.movementType === "IN"
                            ? styles.in
                            : styles.out
                        }
                      >
                        {item.movementType}
                      </span>
                    </td>
                    <td>{item.module}</td>
                    <td>{item.quantity}</td>
                    <td>{item.previousStock}</td>
                    <td>{item.newStock}</td>
                    <td>{item.performedBy?.name || "N/A"}</td>
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

export default StockMovementList;