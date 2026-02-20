import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import styles from "./CustomerList.module.css";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data } = await API.get("/customers");
      setCustomers(data.data);
    } catch (error) {
      console.error("Error fetching customers", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.card}>

        <div className={styles.header}>
          <h2>Customer Management</h2>
          <button
            className={styles.addBtn}
            onClick={() => navigate("/customer/add")}
          >
            + Add Customer
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Contact Person</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className={styles.noData}>
                      No customers found
                    </td>
                  </tr>
                ) : (
                  customers.map((cust) => (
                    <tr key={cust._id}>
                      <td>{cust.customerName}</td>
                      <td>{cust.contactPerson}</td>
                      <td>{cust.phone}</td>
                      <td>{cust.email}</td>
                      <td>{cust.address}</td>
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

export default CustomerList;