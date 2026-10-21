import { useLocation, useNavigate } from "react-router";
import { Menu } from "antd";
import {
  ProductFilled,
  HomeOutlined,
  ShopOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  TagsFilled,
  DollarOutlined
} from "@ant-design/icons";

function Navigation({ isCollapsed }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Get user role from localStorage
  const userRole = (localStorage.getItem("userRole") || "cashier").toLowerCase();
  const isAdmin = userRole === "admin";

  const allMenuItems = [
    {
      key: "/home",
      icon: <HomeOutlined />,
      label: "Overview",
      adminOnly: true,
    },
    {
      key: "/users",
      icon: <UserOutlined />,
      label: "Users",
      adminOnly: true,
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
      key: "orderlayout",
      icon: <span style={{ color: "#000" }}><ShoppingCartOutlined /></span>,
      label: <span style={{ color: "#000" }}>Type of Order</span>,
      children: [
        {
          key: "/orderlayout/orders",
          icon: <ShoppingCartOutlined />,
          label: "Order",
          adminOnly: true,
        },
        {
          key: "/orderlayout/manual-orders",
          icon: <ShoppingCartOutlined />,
          label: "Manual Order",
        },
      ],
    },
    {
      key: "/payments",
      icon: <DollarOutlined />,
      label: "Payment",
    },
    {
      key: "/stock-movement",
      icon: <ShopOutlined />,
      label: "Stock Movement",
      adminOnly: true,
    },
  ];

  // Filter out admin-only items if user is a cashier
  const filterMenuItems = (items) => {
    return items
      .filter((item) => isAdmin || !item.adminOnly)
      .map((item) => {
        if (item.children) {
          const filteredChildren = filterMenuItems(item.children);
          return filteredChildren.length > 0
            ? { ...item, children: filteredChildren }
            : null;
        }
        return item;
      })
      .filter(Boolean);
  };

  const menuItems = filterMenuItems(allMenuItems);
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
        onClick={() => navigate(isAdmin ? "/home" : "/products")}
        style={{ cursor: "pointer" }}
      >
        {!isCollapsed && <span className="nav-label">MyPOS</span>}
      </div>
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[activeKey]}
        defaultOpenKeys={["orderlayout"]}
        items={menuItems}
        onClick={handleMenuClick}
        style={{ borderRight: 0, background: "transparent" }}
      />
    </div>
  );
}

export default Navigation;