import { useEffect, useState } from "react";
import API from "../../api/axios";
import styles from "./ProductionList.module.css";
import { Link } from "react-router-dom";
import DataTable from "../../components/common/DataTable";

const ProductionList = () => {
  const [productions, setProductions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductions = async () => {
      try {
        const { data } = await API.get("/production");
        setProductions(data.data || []);
      } catch (error) {
        console.error("Error fetching production", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductions();
  }, []);

  const columns = [
    { key: "inputLotNumber", label: "Input Lot" },
    { key: "inputQuantity", label: "Input Qty" },
    { key: "outputLotNumber", label: "Output Lot" },
    { key: "outputQuantity", label: "Output Qty" },
    { key: "wastage", label: "Wastage" },
    { key: "wastagePercentage", label: "Wastage %" },
    { key: "efficiencyPercentage", label: "Efficiency %" },
  ];

  return (
    <div className="page-container">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Production Management</h2>
          <Link to="/production/add" className={styles.addBtn}>
            + Add Production
          </Link>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className={styles.tableWrapper}>
            <DataTable
              columns={columns}
              data={productions}
              searchField="inputLotNumber"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductionList;
