import { NavLink } from "react-router-dom";
import { FaBox, FaShoppingCart, FaTachometerAlt } from "react-icons/fa";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>TEXTILE ERP</div>

      <NavLink to="/dashboard" className={styles.navItem}>
        <FaTachometerAlt /> Dashboard
      </NavLink>

      <NavLink to="/inventory" className={styles.navItem}>
        <FaBox /> Inventory
      </NavLink>

      <NavLink to="/purchase" className={styles.navItem}>
        <FaShoppingCart /> Purchase
      </NavLink>
    </div>
  );
};

export default Sidebar;
