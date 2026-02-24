import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import DataTable from "../../components/common/DataTable";
import styles from "./QCList.module.css";

const QCList = () => {
  const [qcList, setQcList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const fetchQC = async (params) => {
    try {
      const query = new URLSearchParams(params).toString();
      const { data } = await API.get(`/qc?${query}`);

      setQcList(data.data);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching QC", error);
    }
  };

  const columns = [
    {
      key: "lotNumber",
      label: "Lot",
    },
    {
      key: "gsm",
      label: "GSM",
      render: (row) => row.gsm ?? "-",
    },
    {
      key: "width",
      label: "Width",
      render: (row) => row.width ?? "-",
    },
    {
      key: "defectPercentage",
      label: "Defect %",
      render: (row) =>
        row.defectPercentage != null
          ? `${row.defectPercentage}%`
          : "-",
    },
    {
      key: "grade",
      label: "Grade",
      render: (row) => row.grade ?? "-",
    },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        let color = "gray";

        if (row.status === "Approved") color = "green";
        else if (row.status === "Rejected") color = "red";
        else if (row.status === "Pending") color = "orange";

        return (
          <span
            style={{
              color,
              fontWeight: "600",
            }}
          >
            {row.status}
          </span>
        );
      },
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>QC Management</h2>
        <Link to="/qc/add" className={styles.addBtn}>
          + Add QC
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={qcList}
        serverMode={true}
        totalPages={totalPages}
        onFetchData={fetchQC}
        searchField="lotNumber"
      />
    </div>
  );
};

export default QCList;