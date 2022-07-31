import { Outlet } from "react-router-dom";

interface ILayoutProps {}

const Layout: React.FunctionComponent<ILayoutProps> = () => {
  return <Outlet />;
};

export default Layout;
