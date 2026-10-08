import { Outlet } from 'react-router'
import React, { useState } from 'react';
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { Button, Menu, Space, Switch } from 'antd';


function OrderLayout() {
    return <Outlet/>
}

export default OrderLayout