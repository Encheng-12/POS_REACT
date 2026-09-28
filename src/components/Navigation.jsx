import { useLocation, useNavigate } from "react-router";
import { ConfigProvider, Menu } from "antd";
import {
  AppstoreOutlined,
  HomeOutlined,
  PlusCircleOutlined,
  ShopOutlined,
  TeamOutlined,
  UserOutlined,
  PlusSquareFilled,
  TagsFilled,
} from "@ant-design/icons";

function Navigation({ isCollapsed }) {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "Overview",
    },
    {
      key: "/products",
      icon: <AppstoreOutlined />,
      label: "Products",
    },
    {
      key: "/categories",
      icon: <TagsFilled />,
      label: "Categories",
    },
    {
      key: "/add-product",
      icon: <PlusCircleOutlined />,
      label: "Add product",
    },
    {
      key: "/order",
      icon: <PlusSquareFilled />,
      label: "Order",
    },
    {
      key: "/users",
      icon: <UserOutlined />,
      label: "Users",
    },
    {
      key: "/shop",
      icon: <ShopOutlined />,
      label: "Shop",
    },
    // {
    //   key: 'team-group',
    //   icon: <TeamOutlined />,
    //   label: 'Team',
    //   children: [
    //     {
    //       key: '/team/team-1',
    //       icon: <UserOutlined />,
    //       label: 'Team 1',
    //     },
    //     {
    //       key: '/team/team-2',
    //       icon: <UserOutlined />,
    //       label: 'Team 2',
    //     },
    //   ],
    // },
  ];

  // Find active key based on current pathname
  const activeKey = location.pathname;

  const handleMenuClick = ({ key }) => {
    if (key.startsWith("/")) {
      navigate(key);
    }
  };

  return (
    <div className="nav-container">
      <div
        className="brand"
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}
      >
        <span className="brand-mark">S</span>
        {!isCollapsed && <span className="nav-label">Stock Starter</span>}
      </div>
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              darkItemSelectedBg: "#FFF8CF", // Selected background (e.g. Red)
              darkItemSelectedColor: "#000", // Selected text/icon color
              darkItemColor: "#000",
            },
          },
        }}
      >
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[activeKey]}
          defaultOpenKeys={["team-group"]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0, background: "transparent" }}
        />
      </ConfigProvider>
    </div>
  );
}

export default Navigation;
