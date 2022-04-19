import Link from "next/link";
import { useRouter } from "next/router";
import { UserRole } from "../../../helpers/constants";
import { useAuth } from "../../../stores/Auth";
import { teacherSidebar } from "./links";
import styles from "./sidebar.module.css";

const Sidebar = () => {
  const [authState] = useAuth();
  const router = useRouter();

  return (
    <div
      className={`${styles.sidebarContainer} ${
        authState.role == UserRole.GUEST ? styles.hidden : ""
      }`}
    >
      {authState.role == UserRole.TEACHER &&
        teacherSidebar.map((sidebarItem, index) => {
          return (
            <Link key={index} href={sidebarItem.href} passHref>
              <div
                className={`${styles.sidebarItem} ${
                  router.asPath === sidebarItem.href ? styles.actived : ""
                }`}
              >
                <div className={styles.iconContainer}>
                  <img src={sidebarItem.src} alt="icon" />
                </div>
                <p>{sidebarItem.name}</p>
              </div>
            </Link>
          );
        })}
    </div>
  );
};

export default Sidebar;
