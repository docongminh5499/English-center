import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { UserRole } from "../../../helpers/constants";
import { teacherSidebar } from "./links";
import styles from "./sidebar.module.css";

interface IProps {
  userRole?: UserRole
}

const Sidebar = (props: IProps) => {
  const router = useRouter();

  const sidebarSelector = useCallback(() => {
    if (props.userRole === UserRole.TEACHER)
      return teacherSidebar;

    // TODO: another user role

  }, [props.userRole]);


  const sideBarList = useMemo(() => sidebarSelector(), [props.userRole]);

  return (
    <div className={`${styles.sidebarContainer} 
          ${props.userRole === UserRole.GUEST || props.userRole === undefined ? styles.hidden : ""}`}>
      {sideBarList && sideBarList.length > 0 && sideBarList.map((sidebarItem, index) => {
        return (
          <Link key={index} href={sidebarItem.href} passHref>
            <div className={`${styles.sidebarItem} ${router.asPath === sidebarItem.href ? styles.actived : ""}`}>
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
