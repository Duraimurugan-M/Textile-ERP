import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import styles from "./AddInventory.module.css";

const AddInventory = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    materialType: "RawYarn",
    lotNumber: "",
    quantity: "",
    unit: "kg",
    location: "",
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

      await API.post("/inventory", formData);

      alert("Inventory added successfully");
      navigate("/inventory");
    } catch (error) {
      console.error(error);
      alert("Failed to add inventory");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Add Inventory</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
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
              <option value="meter">Meter</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? "Saving..." : "Add Inventory"}
        </button>
      </form>
    </div>
  );
};

export default AddInventory;
