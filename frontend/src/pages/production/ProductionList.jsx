import { useEffect, useState } from "react";
import API from "../../api/axios";
import styles from "./ProductionList.module.css";
import { Link } from "react-router-dom";

const ProductionList = () => {
  const [productions, setProductions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductions = async () => {
      try {
        const { data } = await API.get("/production");
        setProductions(data.data || []);
      } catch (error) {
        console.error("Error fetching production", error);
      } finally {
        setLoading(false);
      }
    };

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
                  <th>Wastage</th>
                  <th>Wastage %</th>
                  <th>Efficiency %</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {productions.length === 0 ? (
                  <tr>
                    <td colSpan="8" className={styles.noData}>
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

                      {/* 🆕 Wastage */}
                      <td>{item.wastage}</td>

                      {/* 🆕 Wastage % */}
                      <td>
                        <span
                          className={
                            item.wastagePercentage > 10
                              ? styles.highWastage
                              : styles.normalWastage
                          }
                        >
                          {item.wastagePercentage}%
                        </span>
                      </td>

                      {/* 🆕 Efficiency */}
                      <td>
                        <span
                          className={
                            item.efficiencyPercentage < 90
                              ? styles.lowEfficiency
                              : styles.goodEfficiency
                          }
                        >
                          {item.efficiencyPercentage}%
                        </span>
                      </td>

                      <td>
                        <span className={styles.status}>{item.status}</span>
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
