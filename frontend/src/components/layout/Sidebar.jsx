import { NavLink } from "react-router-dom";
import { FaBox, FaShoppingCart, FaTachometerAlt } from "react-icons/fa";
import styles from "./Sidebar.module.css";
import { FaIndustry } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";


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
        to="/purchase"
        className={({ isActive }) =>
          `${styles.navItem} ${isActive ? styles.active : ""}`
        }
      >
        <FaShoppingCart />
        Purchase
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
        to="/production"
        className={({ isActive }) =>
          `${styles.navItem} ${isActive ? styles.active : ""}`
        }
      >
        <FaIndustry />
        Production
      </NavLink>

        <NavLink
        to="/sales"
        className={({ isActive }) =>
          `${styles.navItem} ${isActive ? styles.active : ""}`
        }
      >
        <FaShoppingCart />
        Sales
      </NavLink>

      <NavLink
        to="/customer"
        className={({ isActive }) =>
          `${styles.navItem} ${isActive ? styles.active : ""}`
        }
      >
        <FaUserFriends />
        Customer
      </NavLink>

    </div>
  );
};

export default Sidebar;
