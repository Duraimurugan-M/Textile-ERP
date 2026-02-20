import { useEffect, useState } from "react";
import API from "../../api/axios";
import styles from "./SupplierList.module.css";
import { Link } from "react-router-dom";

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSuppliers = async () => {
    try {
      const { data } = await API.get("/suppliers");
      setSuppliers(data.data);
    } catch (error) {
      console.error("Error fetching suppliers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Supplier Management</h2>
        <Link to="/supplier/add" className={styles.addBtn}>
          + Add Supplier
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact Person</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.length === 0 ? (
                <tr>
                  <td colSpan="5" className={styles.noData}>
                    No suppliers found
                  </td>
                </tr>
              ) : (
                suppliers.map((item) => (
                  <tr key={item._id}>
                    <td>{item.supplierName}</td>
                    <td>{item.contactPerson}</td>
                    <td>{item.phone}</td>
                    <td>{item.email}</td>
                    <td>{item.address}</td>
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

export default SupplierList;