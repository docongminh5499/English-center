import React from "react";
import styles from "./layout.module.css";

interface IProps {
  children?: React.ReactNode | React.ReactNode[];
}

const Layout = ({ children }: IProps) => {
  return (
    <React.Fragment>
      <div className="header"></div>
      {children}
      <div className="footer"></div>
    </React.Fragment>
  );
};

export default Layout;
