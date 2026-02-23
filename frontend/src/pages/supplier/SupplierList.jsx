import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import DataTable from "../../components/common/DataTable";
import styles from "./SupplierList.module.css";

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSuppliers = async (params) => {
    try {
      const query = new URLSearchParams(params).toString();
      const { data } = await API.get(`/suppliers?${query}`);

      setSuppliers(data.data);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching suppliers", error);
    }
  };

  const columns = [
    { key: "supplierName", label: "Supplier Name" },
    { key: "contactPerson", label: "Contact Person" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "address", label: "Address" },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Supplier Management</h2>
        <Link to="/supplier/add" className={styles.addBtn}>
          + Add Supplier
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={suppliers}
        serverMode={true}
        totalPages={totalPages}
        onFetchData={fetchSuppliers}
        searchField="supplierName"
      />
    </div>
  );
};

export default SupplierList;