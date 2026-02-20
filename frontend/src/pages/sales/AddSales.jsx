import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import styles from "./AddSales.module.css";

const AddSales = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);

  const [form, setForm] = useState({
    customer: "",
    materialType: "FinishedFabric",
    lotNumber: "",
    quantity: "",
    ratePerUnit: "",
  });


useEffect(() => {
  const loadCustomers = async () => {
    try {
      const { data } = await API.get("/customers");
      setCustomers(data.data);
    } catch (error) {
      console.error(error);
      console.log(error.response?.data || "Failed to load customers");
    }
  };

  loadCustomers();
}, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/sales", form);
      navigate("/sales");
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Failed to create sale");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Add Sale</h2>

      <form onSubmit={handleSubmit} className={styles.form}>

        <select
          name="customer"
          value={form.customer}
          onChange={handleChange}
          required
        >
          <option value="">Select Customer</option>
          {customers.map((cust) => (
            <option key={cust._id} value={cust._id}>
              {cust.customerName}
            </option>
          ))}
        </select>

        <input
          type="text"
          value="FinishedFabric"
          disabled
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

        <button type="submit">Create Sale</button>

      </form>
    </div>
  );
};

export default AddSales;