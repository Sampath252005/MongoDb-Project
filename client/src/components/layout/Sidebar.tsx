import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button, Layout, Menu } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { sidebarItems } from '../../constant/sidebarItems';
import { useAppDispatch } from '../../redux/hooks';
import { logoutUser } from '../../redux/services/authSlice';

const { Content, Sider } = Layout;

const Sidebar = () => {
  const [showLogoutBtn, setShowLogoutBtn] = useState(true);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleClick = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  return (
    <Layout className="app-layout">
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onCollapse={(collapsed, type) => {
          if (type === 'responsive') {
            setShowLogoutBtn(!collapsed);
          }
          if (type === 'clickTrigger') {
            setShowLogoutBtn(!collapsed);
          }
        }}
        width="240px"
        className="app-sidebar"
      >
        <div className="sidebar-logo">
          <h1>Inventory</h1>
          <p>Management</p>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          className="sidebar-menu"
          defaultSelectedKeys={['Dashboard']}
          items={sidebarItems}
        />

        {showLogoutBtn && (
          <div className="logout-wrapper">
            <Button type="primary" className="logout-btn" onClick={handleClick}>
              <LogoutOutlined />
              Logout
            </Button>
          </div>
        )}
      </Sider>

      <Layout>
        <Content className="app-content">
          <div className="content-card">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Sidebar;