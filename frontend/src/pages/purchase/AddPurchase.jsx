import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import styles from "./AddPurchase.module.css";

const AddPurchase = () => {
  const navigate = useNavigate();

 const [formData, setFormData] = useState({
   supplierName: "",
   materialType: "RawYarn",
   lotNumber: "",
   quantity: "",
   unit: "kg",
   ratePerUnit: "",
 });


  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.post("/purchase", formData);

      alert("Purchase created successfully");
      navigate("/purchase");
    } catch (error) {
      console.error(error);
      alert("Failed to create purchase");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Add Purchase</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Supplier Name</label>
          <input
            type="text"
            name="supplierName"
            value={formData.supplierName}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Material Type</label>
          <select
            name="materialType"
            value={formData.materialType}
            onChange={handleChange}
          >
            <option value="RawYarn">Raw Yarn</option>
            <option value="DyedYarn">Dyed Yarn</option>
            <option value="GreyFabric">Grey Fabric</option>
            <option value="FinishedFabric">Finished Fabric</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Lot Number</label>
          <input
            type="text"
            name="lotNumber"
            value={formData.lotNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Unit</label>
            <select name="unit" value={formData.unit} onChange={handleChange}>
              <option value="kg">kg</option>
              <option value="meter">meter</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Rate Per Unit</label>
            <input
              type="number"
              name="ratePerUnit"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? "Saving..." : "Create Purchase"}
        </button>
      </form>
    </div>
  );
};

export default AddPurchase;
