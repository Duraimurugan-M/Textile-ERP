import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import styles from "./PurchaseList.module.css";

const PurchaseList = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPurchases = async () => {
    try {
      const { data } = await API.get("/purchase");
      setPurchases(data.data);
    } catch (error) {
      console.error("Error fetching purchases", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Purchase Management</h2>
        <button
          className={styles.addButton}
          onClick={() => navigate("/purchase/add")}
        >
          + Add Purchase
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Material Type</th>
                <th>Lot Number</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>Purchase Date</th>
              </tr>
            </thead>
            <tbody>
              {purchases.length === 0 ? (
                <tr>
                  <td colSpan="6" className={styles.noData}>
                    No purchase records found
                  </td>
                </tr>
              ) : (
                purchases.map((item) => (
                  <tr key={item._id}>
                    <td>{item.supplier ? item.supplier.supplierName : "N/A"}</td>
                    <td>{item.materialType}</td>
                    <td>{item.lotNumber}</td>
                    <td>{item.quantity}</td>
                    <td>{item.unit}</td>
                    <td>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
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

export default PurchaseList;
