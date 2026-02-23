import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import styles from "./AddSupplier.module.css";

const AddSupplier = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    supplierName: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/suppliers", form);
      navigate("/supplier");
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Failed to create supplier");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Add Supplier</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          name="supplierName"
          placeholder="Supplier Name"
          onChange={handleChange}
          required
        />

        <input
          name="contactPerson"
          placeholder="Contact Person"
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <input
          name="address"
          placeholder="Address"
          onChange={handleChange}
          required
        />

        <button type="submit">Create Supplier</button>
      </form>
    </div>
  );
};

export default AddSupplier;