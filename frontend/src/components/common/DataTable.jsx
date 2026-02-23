import { useState, useMemo } from "react";
import styles from "./DataTable.module.css";

const DataTable = ({ columns, data, searchField = "" }) => {
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  // 🔎 Filtering
  const filteredData = useMemo(() => {
    if (!searchField || !search) return data;

    return data.filter((item) =>
      item[searchField]
        ?.toString()
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [data, search, searchField]);

  // 🔽 Sorting
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // 📄 Pagination
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className={styles.container}>
      {/* 🔎 Search */}
      {searchField && (
        <input
          type="text"
          placeholder={`Search by ${searchField}`}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className={styles.search}
        />
      )}

      {/* 📋 Table */}
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => handleSort(col.key)}
                className={styles.sortable}
              >
                {col.label}
                {sortConfig.key === col.key &&
                  (sortConfig.direction === "asc" ? " 🔼" : " 🔽")}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {paginatedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={styles.noData}>
                No data found
              </td>
            </tr>
          ) : (
            paginatedData.map((row, index) => (
              <tr key={index}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 📄 Gmail Style Pagination */}
      <div className={styles.pagination}>
        <div>
          Rows per page:
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div>
          {currentPage} / {totalPages}
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            ◀
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
