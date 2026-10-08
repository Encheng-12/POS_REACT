import { useLocation, useNavigate } from "react-router";
import { Menu } from "antd";
import POSlogo from "/src/assets/image/pos.png";
import {
  ProductFilled,
  HomeOutlined,
  PlusCircleOutlined,
  ShopOutlined,
  TeamOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  TagsFilled,
} from "@ant-design/icons";

function Navigation({ isCollapsed }) {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      key: "/home",
      icon: <HomeOutlined />,
      label: "Overview",
    },
    {
      key: "/users",
      icon: <UserOutlined />,
      label: "Users",
    },
    {
      key: "/products",
      icon: <ProductFilled />,
      label: "Products",
    },
    {
      key: "/categories",
      icon: <TagsFilled />,
      label: "Categories",
    },
    {
      key: 'orderlayout',
      icon: <ShoppingCartOutlined />,
      label: "Type of Order",
      children: [
        {
          key: '/orderlayout/orders',
          icon: <ShoppingCartOutlined />,
          label: "Order",
        },
        {
          key: '/orderlayout/manual-orders',
          icon: <ShoppingCartOutlined />,
          label: "Manual Order",
        },
      ],
    },

    {
      key: '/payments',
      icon: <ShoppingCartOutlined />,
      label: "Payment",
    },
    {
      key: "/stock-movement",
      icon: <ShopOutlined />,
      label: "Stock Movement",
    },

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
        onClick={() => navigate("/home")}
        style={{ cursor: "pointer" }}
      >
        {/* <img
          src={POSlogo}
          alt=""
          width="50px"
          height="50px"
          style={{ borderRadius: "10px" }}
        /> */}
        {!isCollapsed && <span className="nav-label">MyPOS</span>}
      </div>
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[activeKey]}
        defaultOpenKeys={["team-group"]}
        items={menuItems}
        onClick={handleMenuClick}
        style={{ borderRight: 0, background: "transparent" }}
      />
    </div>
  );
}

export default Navigation;
