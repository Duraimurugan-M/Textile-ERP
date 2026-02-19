import { useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import styles from "./AddSales.module.css";

const AddSale = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customerName: "",
    materialType: "",
    lotNumber: "",
    quantity: "",
    ratePerUnit: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/sales", form);
      navigate("/sales");
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Create Sale</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          name="customerName"
          placeholder="Customer Name"
          onChange={handleChange}
          required
        />
        <input
          name="materialType"
          placeholder="Material Type"
          onChange={handleChange}
          required
        />
        <input
          name="lotNumber"
          placeholder="Lot Number"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="ratePerUnit"
          placeholder="Rate Per Unit"
          onChange={handleChange}
          required
        />
        <button type="submit" className={styles.button}>
          Save Sale
        </button>
      </form>
    </div>
  );
};

export default AddSale;
