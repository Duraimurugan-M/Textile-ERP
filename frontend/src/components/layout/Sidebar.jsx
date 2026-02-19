import { NavLink } from "react-router-dom";
import { FaBox, FaShoppingCart, FaTachometerAlt } from "react-icons/fa";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>TEXTILE ERP</div>

      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `${styles.navItem} ${isActive ? styles.active : ""}`
        }
      >
        <FaTachometerAlt />
        Dashboard
      </NavLink>

      <NavLink
        to="/inventory"
        className={({ isActive }) =>
          `${styles.navItem} ${isActive ? styles.active : ""}`
        }
      >
        <FaBox />
        Inventory
      </NavLink>

      <NavLink
        to="/purchase"
        className={({ isActive }) =>
          `${styles.navItem} ${isActive ? styles.active : ""}`
        }
      >
        <FaShoppingCart />
        Purchase
      </NavLink>
    </div>
  );
};

export default Sidebar;
