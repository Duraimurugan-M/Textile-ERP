import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import DataTable from "../../components/common/DataTable";
import styles from "./Vendor.module.css";

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const fetchVendors = async (params) => {
    try {
      const query = new URLSearchParams(params).toString();
      const { data } = await API.get(`/vendors?${query}`);

      setVendors(data.data);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching vendors", error);
    }
  };

  const columns = [
    { key: "vendorName", label: "Vendor Name" },
    { key: "contactPerson", label: "Contact Person" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "jobType", label: "Job Type" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`${styles.badge} ${
            row.status === "Active" ? styles.active : styles.inactive
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Vendor Management</h2>
        <Link to="/vendors/add" className={styles.addBtn}>
          + Add Vendor
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={vendors}
        serverMode={true}
        totalPages={totalPages}
        onFetchData={fetchVendors}
        searchField="vendorName"
      />
    </div>
  );
};

export default VendorList;