import React from 'react';
import {Layout, Menu} from 'antd';
import {Link} from 'react-router-dom';
import {BookOutlined, DashboardOutlined, HomeOutlined} from '@ant-design/icons';

const {Sider} = Layout;

const SideMenu: React.FC = () => {
    return (
        <Sider collapsible>
            <div className="logo text-info text-center">
                <HomeOutlined/>
            </div>
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                <Menu.Item key="1" icon={<DashboardOutlined/>}>
                    <Link to="/">Dashboard</Link>
                </Menu.Item>
                <Menu.Item key="2" icon={<BookOutlined/>}>
                    <Link to="/books">Book Management</Link>
                </Menu.Item>
            </Menu>
        </Sider>
    );
};

export default SideMenu;
