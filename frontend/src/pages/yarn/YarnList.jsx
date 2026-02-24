import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import DataTable from "../../components/common/DataTable";
import styles from "./Yarn.module.css";

const YarnList = () => {
  const [yarns, setYarns] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const fetchYarns = async (params) => {
    try {
      const query = new URLSearchParams(params).toString();
      const { data } = await API.get(`/yarn?${query}`);

      setYarns(data.data);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching yarns", error);
    }
  };

  const columns = [
    { key: "yarnName", label: "Yarn Name" },
    { key: "count", label: "Count" },
    { key: "composition", label: "Composition" },
    { key: "shade", label: "Shade" },
    { key: "lotNumber", label: "Lot Number" },
    { key: "quantity", label: "Quantity" },
    { key: "unit", label: "Unit" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`${styles.badge} ${
            row.status === "Available"
              ? styles.available
              : row.status === "SentToJobWork"
              ? styles.inProcess
              : styles.consumed
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
        <h2>Yarn Management</h2>
        <Link to="/yarn/add" className={styles.addBtn}>
          + Add Yarn
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={yarns}
        serverMode={true}
        totalPages={totalPages}
        onFetchData={fetchYarns}
        searchField="lotNumber"
      />
    </div>
  );
};

export default YarnList;