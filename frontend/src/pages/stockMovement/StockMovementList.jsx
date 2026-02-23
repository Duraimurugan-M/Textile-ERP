import { useState } from "react";
import API from "../../api/axios";
import DataTable from "../../components/common/DataTable";
import styles from "../../components/common/DataTable.module.css";

const StockMovementList = () => {
  const [movements, setMovements] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMovements = async (params) => {
    try {
      const query = new URLSearchParams(params).toString();
      const { data } = await API.get(`/stock-movement?${query}`);

      setMovements(data.data);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error);
    }
  };

const columns = [
  {
    key: "createdAt",
    label: "Date & Time",
    render: (row) => new Date(row.createdAt).toLocaleString(),
  },
  { key: "materialType", label: "Material" },
  { key: "lotNumber", label: "Lot" },
  {
    key: "movementType",
    label: "Type",
    render: (row) => (
      <span
        className={row.movementType === "IN" ? styles.inBadge : styles.outBadge}
      >
        {row.movementType}
      </span>
    ),
  },
  { key: "module", label: "Module" },
  { key: "quantity", label: "Qty" },
  { key: "previousStock", label: "Previous" },
  { key: "newStock", label: "New" },
  {
    key: "performedBy",
    label: "User",
    render: (row) => row.performedBy?.name,
  },
];

  return (
    <DataTable
      columns={columns}
      data={movements}
      serverMode={true}
      totalPages={totalPages}
      onFetchData={fetchMovements}
      searchField="lotNumber"
    />
  );
};

export default StockMovementList;
