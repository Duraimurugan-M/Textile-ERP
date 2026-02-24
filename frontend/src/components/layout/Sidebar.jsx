import { NavLink } from "react-router-dom";
import {
  FaBox,
  FaShoppingCart,
  FaTachometerAlt,
  FaTruck,
  FaTruckLoading,
  FaIndustry,
  FaUserFriends,
} from "react-icons/fa";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      
      {/* Fixed Logo */}
      <div className={styles.logo}>TEXTILE ERP</div>

      {/* Scrollable Menu */}
      <div className={styles.menu}>
        <NavLink to="/dashboard" className={({ isActive }) =>
          `${styles.navItem} ${isActive ? styles.active : ""}`
        }>
          <FaTachometerAlt />
          Dashboard
        </NavLink>

        <NavLink to="/purchase" className={({ isActive }) =>
          `${styles.navItem} ${isActive ? styles.active : ""}`
        }>
          <FaShoppingCart />
          Purchase
        </NavLink>

        <NavLink to="/inventory" className={({ isActive }) =>
          `${styles.navItem} ${isActive ? styles.active : ""}`
        }>
          <FaBox />
          Inventory
        </NavLink>

        <NavLink to="/production" className={({ isActive }) =>
          `${styles.navItem} ${isActive ? styles.active : ""}`
        }>
          <FaIndustry />
          Production
        </NavLink>

        <NavLink to="/sales" className={({ isActive }) =>
          `${styles.navItem} ${isActive ? styles.active : ""}`
        }>
          <FaShoppingCart />
          Sales
        </NavLink>

        <NavLink to="/customer" className={({ isActive }) =>
          `${styles.navItem} ${isActive ? styles.active : ""}`
        }>
          <FaUserFriends />
          Customer
        </NavLink>

        <NavLink to="/supplier" className={({ isActive }) =>
          `${styles.navItem} ${isActive ? styles.active : ""}`
        }>
          <FaTruckLoading />
          Suppliers
        </NavLink>

        <NavLink to="/qc" className={({ isActive }) =>
          `${styles.navItem} ${isActive ? styles.active : ""}`
        }>
          <FaIndustry />
          QC
        </NavLink>

        <NavLink to="/stock-movement" className={({ isActive }) =>
          `${styles.navItem} ${isActive ? styles.active : ""}`
        }>
          <FaTruckLoading />
          Stock Movement
        </NavLink>

        <NavLink to="/yarn" className={({ isActive }) =>
          `${styles.navItem} ${isActive ? styles.active : ""}`
        }>
          <FaBox />
          Yarn
        </NavLink>

        <NavLink to="/vendors" className={({ isActive }) =>
          `${styles.navItem} ${isActive ? styles.active : ""}`
        }>
          <FaTruck />
          Vendors
        </NavLink>
      </div>

    </div>
  );
};

export default Sidebar;