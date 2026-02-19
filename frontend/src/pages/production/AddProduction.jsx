import { useState } from "react";
import API from "../../api/axios";
import styles from "./AddProduction.module.css";
import { useNavigate } from "react-router-dom";

const AddProduction = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    inputMaterialType: "",
    inputLotNumber: "",
    inputQuantity: "",
    outputMaterialType: "",
    outputLotNumber: "",
    outputQuantity: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/production", form);
      navigate("/production");
    } catch (error) {
      console.error("Production error", error.response?.data || error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Create Production</h2>

      <form onSubmit={handleSubmit} className={styles.form}>

        <select name="inputMaterialType" onChange={handleChange} required>
          <option value="">Select Input Material</option>
          <option value="RawYarn">Raw Yarn</option>
          <option value="DyedYarn">Dyed Yarn</option>
          <option value="GreyFabric">Grey Fabric</option>
          <option value="FinishedFabric">Finished Fabric</option>
        </select>

        <input
          name="inputLotNumber"
          placeholder="Input Lot Number"
          onChange={handleChange}
          required
        />

        <input
          name="inputQuantity"
          type="number"
          placeholder="Input Quantity"
          onChange={handleChange}
          required
        />

        <select name="outputMaterialType" onChange={handleChange} required>
          <option value="">Select Output Material</option>
          <option value="RawYarn">Raw Yarn</option>
          <option value="DyedYarn">Dyed Yarn</option>
          <option value="GreyFabric">Grey Fabric</option>
          <option value="FinishedFabric">Finished Fabric</option>
        </select>

        <input
          name="outputLotNumber"
          placeholder="Output Lot Number"
          onChange={handleChange}
          required
        />

        <input
          name="outputQuantity"
          type="number"
          placeholder="Output Quantity"
          onChange={handleChange}
          required
        />

        <button type="submit">Save Production</button>
      </form>
    </div>
  );
};

export default AddProduction;
