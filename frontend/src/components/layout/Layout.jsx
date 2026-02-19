import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import styles from "./Layout.module.css";

const Layout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>

      <div className={styles.main}>
        <div className={styles.navWrapper}>
          <Navbar />
        </div>

        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
