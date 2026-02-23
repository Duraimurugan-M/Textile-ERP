import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import DataTable from "../../components/common/DataTable";
import styles from "./SalesList.module.css";

const SalesList = () => {
  const [sales, setSales] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSales = async (params) => {
    try {
      const query = new URLSearchParams(params).toString();
      const { data } = await API.get(`/sales?${query}`);

      setSales(data.data);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching sales", error);
    }
  };

  const columns = [
    {
      key: "customer",
      label: "Customer",
      render: (row) => row.customer?.customerName || "N/A",
    },
    { key: "materialType", label: "Material" },
    { key: "lotNumber", label: "Lot" },
    { key: "quantity", label: "Qty" },
    {
      key: "ratePerUnit",
      label: "Rate",
      render: (row) => `₹${row.ratePerUnit}`,
    },
    {
      key: "totalAmount",
      label: "Total",
      render: (row) => `₹${row.totalAmount}`,
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Sales Management</h2>
        <Link to="/sales/add" className={styles.addBtn}>
          + Add Sale
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={sales}
        serverMode={true}
        totalPages={totalPages}
        onFetchData={fetchSales}
        searchField="lotNumber"
      />
    </div>
  );
};

export default SalesList;