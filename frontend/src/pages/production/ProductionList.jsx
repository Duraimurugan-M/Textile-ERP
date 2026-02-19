import { useEffect, useState } from "react";
import API from "../../api/axios";
import Layout from "../../components/layout/Layout";
import styles from "./ProductionList.module.css";
import { Link } from "react-router-dom";

const ProductionList = () => {
  const [productions, setProductions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProductions = async () => {
    try {
      const { data } = await API.get("/production");
      setProductions(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching production", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductions();
  }, []);

  return (
    <div className="page-container">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Production Management</h2>
          <Link to="/production/add" className={styles.addBtn}>
            + Add Production
          </Link>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Input Lot</th>
                  <th>Input Qty</th>
                  <th>Output Lot</th>
                  <th>Output Qty</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {productions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className={styles.noData}>
                      No production records found
                    </td>
                  </tr>
                ) : (
                  productions.map((item) => (
                    <tr key={item._id}>
                      <td>{item.inputLotNumber}</td>
                      <td>{item.inputQuantity}</td>
                      <td>{item.outputLotNumber}</td>
                      <td>{item.outputQuantity}</td>
                      <td>
                        <span className={styles.status}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
);

};

export default ProductionList;
