import React from 'react';
import {Button, Layout, Menu} from 'antd';
import {Link} from 'react-router-dom';
import {BookOutlined, DashboardOutlined, MoonOutlined, SunOutlined} from '@ant-design/icons';

const {Sider} = Layout;

const SideMenu: React.FC<{ toggleTheme: () => void; themeMode: 'light' | 'dark' }> = ({toggleTheme, themeMode}) => {
    return (
        <Sider collapsible>
            <div className="logo" onClick={toggleTheme}>
                <Button type="link" style={{color: '#fff', fontSize: '16px', padding: '16px'}}>
                    {themeMode === 'light' ? <SunOutlined/> : <MoonOutlined/>} Toggle Theme
                </Button>
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
