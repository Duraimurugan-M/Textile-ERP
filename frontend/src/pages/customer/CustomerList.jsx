import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import DataTable from "../../components/common/DataTable";
import styles from "./CustomerList.module.css";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchCustomers = async (params) => {
    try {
      const query = new URLSearchParams(params).toString();
      const { data } = await API.get(`/customers?${query}`);

      setCustomers(data.data);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching customers", error);
    }
  };

  const columns = [
    { key: "customerName", label: "Customer Name" },
    { key: "contactPerson", label: "Contact Person" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "address", label: "Address" },
  ];

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

        <DataTable
          columns={columns}
          data={customers}
          serverMode={true}
          totalPages={totalPages}
          onFetchData={fetchCustomers}
          searchField="customerName"
        />
      </div>
    </div>
  );
};

export default CustomerList;