import React, { ReactNode, useEffect } from "react";

import Header from "./Header";

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Header />
      <div className="layout">{props.children}</div>
      <div style={{ height: "100px" }}></div>
    </div>
  );
};

export default Layout;
