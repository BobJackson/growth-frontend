import React from 'react';
import {Button, Layout, Menu, Tooltip} from 'antd';
import {Link, useNavigate} from 'react-router-dom';
import {BookOutlined, DashboardOutlined, LogoutOutlined, MoonOutlined, SunOutlined} from '@ant-design/icons';

const {Sider} = Layout;

const SideMenu: React.FC<{
    toggleTheme: () => void;
    themeMode: 'light' | 'dark';
    onLogout: () => void
}> = ({toggleTheme, themeMode, onLogout}) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        onLogout(); // 调用父组件的 onLogout 方法
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
    ];

    return (
        <Sider collapsible theme={themeMode}>
            <div className="logo" onClick={toggleTheme}>
                <Tooltip title="Toggle Theme" placement='right'>
                    <Button type="link">
                        {themeMode === 'light' ? <SunOutlined/> : <MoonOutlined/>}
                    </Button>
                </Tooltip>
            </div>
            <Menu
                theme={themeMode}
                mode="inline"
                items={items}
                defaultSelectedKeys={['1']}
            />
            <div style={{position: 'absolute', bottom: 80, width: '100%', textAlign: 'center'}}>
                <Tooltip title="Logout">
                    <Button type="link" danger={true} onClick={handleLogout} icon={<LogoutOutlined/>}>
                    </Button>
                </Tooltip>
            </div>
        </Sider>
    );
};

export default SideMenu;
