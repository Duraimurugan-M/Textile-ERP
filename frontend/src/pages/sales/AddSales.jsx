import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import styles from "./AddSales.module.css";

const AddSales = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [lots, setLots] = useState([]);
  const [availableQty, setAvailableQty] = useState(0);

  const [form, setForm] = useState({
    customer: "",
    materialType: "FinishedFabric",
    lotNumber: "",
    quantity: "",
    ratePerUnit: "",
  });

  // 🔹 Load customers
  useEffect(() => {
    const loadCustomers = async () => {
      const { data } = await API.get("/customers");
      setCustomers(data.data);
    };
    loadCustomers();
  }, []);

  // 🔹 Load finished fabric lots
  useEffect(() => {
    const loadLots = async () => {
      const { data } = await API.get("/inventory");
      const finishedLots = data.data.filter(
        (item) => item.materialType === "FinishedFabric" && item.quantity > 0,
      );
      setLots(finishedLots);
    };
    loadLots();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "lotNumber") {
      const selectedLot = lots.find((lot) => lot.lotNumber === value);
      setAvailableQty(selectedLot ? selectedLot.quantity : 0);
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Number(form.quantity) > availableQty) {
      alert("Quantity exceeds available stock!");
      return;
    }

    try {
      await API.post("/sales", form);
      navigate("/sales");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create sale");
    }
  };

  const total = form.quantity && form.ratePerUnit
    ? form.quantity * form.ratePerUnit
    : 0;

  return (
    <div className={styles.container}>
      <h2>Add Sale</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Customer */}
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

        {/* Material fixed */}
        <input type="text" value="FinishedFabric" disabled />

        {/* Lot dropdown */}
        <select
          name="lotNumber"
          value={form.lotNumber}
          onChange={handleChange}
          required
        >
          <option value="">Select Lot</option>
          {lots.map((lot) => (
            <option key={lot._id} value={lot.lotNumber}>
              {lot.lotNumber} (Available: {lot.quantity})
            </option>
          ))}
        </select>

        <input
          type="number"
          name="quantity"
          placeholder={`Available: ${availableQty}`}
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

        <div style={{ fontWeight: "bold" }}>
          Total: ₹{total}
        </div>

        <button type="submit" className={styles.button}>
          Create Sale
        </button>
      </form>
    </div>
  );
};

export default AddSales;