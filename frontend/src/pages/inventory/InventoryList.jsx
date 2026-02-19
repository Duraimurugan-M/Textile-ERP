import { useEffect, useState } from "react";
import API from "../../api/axios";
import styles from "./InventoryList.module.css";
import { useNavigate } from "react-router-dom";


const InventoryList = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    try {
      const { data } = await API.get("/inventory");
      setInventory(data.data);
    } catch (error) {
      console.error("Error fetching inventory", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const navigate = useNavigate();


  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Inventory Management</h2>
        <button
          className={styles.addButton}
          onClick={() => navigate("/inventory/add")}
        >
          + Add Inventory
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Material</th>
                <th>Lot Number</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>Status</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {inventory.length === 0 ? (
                <tr>
                  <td colSpan="6" className={styles.noData}>
                    No inventory records found
                  </td>
                </tr>
              ) : (
                inventory.map((item) => (
                  <tr key={item._id}>
                    <td>{item.materialType}</td>
                    <td>{item.lotNumber}</td>
                    <td>{item.quantity}</td>
                    <td>{item.unit}</td>
                    <td>
                      <span
                        className={`${styles.status} ${styles[item.status]}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>{item.location}</td>
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

export default InventoryList;
