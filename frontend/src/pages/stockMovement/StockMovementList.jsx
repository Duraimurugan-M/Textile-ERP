import { useEffect, useState } from "react";
import API from "../../api/axios";
import styles from "./StockMovement.module.css";

const StockMovementList = () => {
  const [movements, setMovements] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    module: "",
    movementType: "",
    sortBy: "createdAt",
    order: "desc",
  });

  useEffect(() => {
    const fetchMovements = async () => {
      try {
        const query = new URLSearchParams({
          page,
          limit: 10,
          ...filters,
        }).toString();

        const { data } = await API.get(`/stock-movement?${query}`);

        setMovements(data.data || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching stock movement", error);
      }
    };

    fetchMovements();
  }, [page, filters]);

  const handleFilterChange = (e) => {
    setPage(1);
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className={styles.container}>
      <h2>Stock Movement Ledger</h2>

      {/* 🔎 FILTERS */}
      <div className={styles.filters}>
        <select name="module" onChange={handleFilterChange} value={filters.module}>
          <option value="">All Modules</option>
          <option value="Purchase">Purchase</option>
          <option value="Production">Production</option>
          <option value="Sale">Sale</option>
        </select>

        <select name="movementType" onChange={handleFilterChange} value={filters.movementType}>
          <option value="">All Types</option>
          <option value="IN">IN</option>
          <option value="OUT">OUT</option>
        </select>

        <select name="order" onChange={handleFilterChange} value={filters.order}>
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      {/* 📋 TABLE */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Material</th>
            <th>Lot</th>
            <th>Type</th>
            <th>Module</th>
            <th>Qty</th>
            <th>Previous</th>
            <th>New</th>
            <th>User</th>
          </tr>
        </thead>
        <tbody>
          {movements.length === 0 ? (
            <tr>
              <td colSpan="9" className={styles.noData}>
                No records found
              </td>
            </tr>
          ) : (
            movements.map((item) => (
              <tr key={item._id}>
                <td>{item.date}</td>
                <td>{item.materialType}</td>
                <td>{item.lotNumber}</td>
                <td>{item.movementType}</td>
                <td>{item.module}</td>
                <td>{item.quantity}</td>
                <td>{item.previousStock}</td>
                <td>{item.newStock}</td>
                <td>{item.performedBy?.name}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 📄 PAGINATION */}
      <div className={styles.pagination}>
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StockMovementList;