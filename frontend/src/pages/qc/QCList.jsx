import { useEffect, useState } from "react";
import API from "../../api/axios";
import styles from "./QCList.module.css";
import { Link } from "react-router-dom";

const QCList = () => {
  const [qcList, setQcList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQC = async () => {
    try {
      const { data } = await API.get("/qc");
      setQcList(data.data);
    } catch (error) {
      console.error("Error fetching QC", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQC();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>QC Management</h2>
        <Link to="/qc/add" className={styles.addBtn}>
          + Add QC
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Lot</th>
                <th>GSM</th>
                <th>Width</th>
                <th>Defect %</th>
                <th>Grade</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {qcList.length === 0 ? (
                <tr>
                  <td colSpan="6" className={styles.noData}>
                    No QC records found
                  </td>
                </tr>
              ) : (
                qcList.map((item) => (
                  <tr key={item._id}>
                    <td>{item.lotNumber}</td>
                    <td>{item.gsm}</td>
                    <td>{item.width}</td>
                    <td>{item.defectPercentage}%</td>
                    <td>{item.grade}</td>
                    <td>
                      <span
                        className={
                          item.status === "Approved"
                            ? styles.statusApproved
                            : styles.statusRejected
                        }
                      >
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
  );
};

export default QCList;