import React, { useEffect, useState } from 'react';
import { Outlet,useLocation,useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite';
import { Layout, Menu, theme,Popconfirm } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import items from '../../config/index.jsx'
import useStore from '../../store'
import './index.scss'

const { Header, Sider, Content,Footer } = Layout;

const LayOut = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { token: { colorBgContainer }} = theme.useToken();
  // 拿到当前的路径
  const { pathname } = useLocation()
  const { UserStore,LoginStore,ChannelStore } = useStore()
  const navigate = useNavigate()
  useEffect(()=>{
    UserStore.getUserInfo()
    ChannelStore.localChannelList()
  },[UserStore,ChannelStore])

  // 退出登录的实现
  const onConfirm = () =>{ 
    // 删除token跳回登录
    LoginStore.loginOut()
    navigate('/login',{replace:true})
  }

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed} className='sider'>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[pathname]}
          selectedKeys={[pathname]}
          items={items}
        />
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: 0,background: colorBgContainer }}>
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed),
          })}
          <span className="user-name">{UserStore?.userInfo.name}</span>
          <span className="user-logout">
            <Popconfirm
              onConfirm={onConfirm}
              title="是否确认退出？" okText="退出" cancelText="取消">
              <LogoutOutlined /> 退出
            </Popconfirm>
          </span>
        </Header>
        <Content
          style={{
            margin: '24px 16px 0px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            overflowY: 'auto'
          }}
        >
          <Outlet />
        </Content>
        <Footer
            style={{
              textAlign: 'center',
            }}
          >
            Ant Design ©2023 Created by Ant UED
          </Footer>
      </Layout>
    </Layout>
  );
};
export default observer(LayOut);