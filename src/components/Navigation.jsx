import { useLocation, useNavigate } from 'react-router'
import { Menu } from 'antd'
import POSlogo from '/src/assets/image/pos.png'
import {
  AppstoreOutlined,
  HomeOutlined,
  PlusCircleOutlined,
  ShopOutlined,
  TeamOutlined,
  UserOutlined,
  PlusSquareFilled,
  TagsFilled
} from '@ant-design/icons'

function Navigation({ isCollapsed }) {
  const location = useLocation()
  const navigate = useNavigate()

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Overview',
    },
    {
      key: '/products',
      icon: <AppstoreOutlined />,
      label: 'Products',
    },
    {
      key: '/categories',
      icon: <TagsFilled/>,
      label: 'Categories',
    },
    {
      key: '/add-product',
      icon: <PlusCircleOutlined />,
      label: 'Add product',
    },
    {
      key: '/order',
      icon: <PlusSquareFilled />,
      label: 'Order'
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: 'Users',
    },
    {
      key: '/shop',
      icon: <ShopOutlined />,
      label: 'Shop',
    },
    {
      key: 'team-group',
      icon: <TeamOutlined />,
      label: 'Team',
      children: [
        {
          key: '/team/team-1',
          icon: <UserOutlined />,
          label: 'Team 1',
        },
        {
          key: '/team/team-2',
          icon: <UserOutlined />,
          label: 'Team 2',
        },
      ],
    },
  ]

  // Find active key based on current pathname
  const activeKey = location.pathname

  const handleMenuClick = ({ key }) => {
    if (key.startsWith('/')) {
      navigate(key)
    }
  }

  return (
    <div className="nav-container">
      <div className="brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <img src={POSlogo} alt="" width='50px' height='50px' />
        {!isCollapsed && <span className="nav-label">Stock Starter</span>}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[activeKey]}
        defaultOpenKeys={['team-group']}
        items={menuItems}
        onClick={handleMenuClick}
        style={{ borderRight: 0, background: 'transparent' }}
      />
    </div>
  )
}

export default Navigation
