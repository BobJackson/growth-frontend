import React from 'react';
import {Button, Layout, Menu} from 'antd';
import {Link, useNavigate} from 'react-router-dom';
import {BookOutlined, DashboardOutlined, LogoutOutlined, MoonOutlined, SunOutlined} from '@ant-design/icons';

const {Sider} = Layout;

const SideMenu: React.FC<{ toggleTheme: () => void; themeMode: 'light' | 'dark' }> = ({toggleTheme, themeMode}) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        navigate('/login', {replace: true});
    };

    const items = [
        {
            key: '1',
            icon: <DashboardOutlined/>,
            label: <Link to="/">Dashboard</Link>,
        },
        {
            key: '2',
            icon: <BookOutlined/>,
            label: <Link to="/books">Books</Link>,
        },
        {
            key: '3',
            icon: <LogoutOutlined/>,
            label: <a onClick={handleLogout}>Logout</a>,
        },
    ];

    return (
        <Sider collapsible theme={themeMode}>
            <div className="logo" onClick={toggleTheme}>
                <Button type="link">
                    {themeMode === 'light' ? <SunOutlined/> : <MoonOutlined/>} Toggle Theme
                </Button>
            </div>
            <Menu
                theme={themeMode}
                mode="inline"
                items={items}
            />
        </Sider>
    );
};

export default SideMenu;
