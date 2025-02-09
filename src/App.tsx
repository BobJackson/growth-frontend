// App.tsx
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import './App.css';
import Dashboard from './Dashboard';
import SideMenu from './SideMenu';
import BookList from "./BookList";
import Login from "./Login"; // 导入登录组件
import {ConfigProvider, Layout, theme} from 'antd';
import {useEffect, useState} from 'react';

const {Content} = Layout;

function App() {
    const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // 从localStorage中获取登录状态
        const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
        setIsLoggedIn(storedIsLoggedIn === 'true');
    }, []);

    const toggleTheme = () => {
        setThemeMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
    };

    const currentTheme = themeMode === 'light' ? theme.defaultAlgorithm : theme.darkAlgorithm;

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };

    const handleLogoutSuccess = () => {
        setIsLoggedIn(false);
    };

    return (
        <ConfigProvider theme={{algorithm: currentTheme}}>
            <Router>
                <Layout style={{minHeight: '100vh'}}>
                    {isLoggedIn &&
                        <SideMenu toggleTheme={toggleTheme} themeMode={themeMode} onLogout={handleLogoutSuccess}/>}
                    <Layout>
                        <Content style={{margin: '24px 16px 0', overflow: 'initial'}}>
                            <div style={{padding: 24, textAlign: 'center'}}>
                                <Routes>
                                    <Route path="/login"
                                           element={isLoggedIn ? <Navigate to="/"/> :
                                               <Login onLoginSuccess={handleLoginSuccess}/>}/>
                                    <Route
                                        path="/"
                                        element={isLoggedIn ? <Dashboard/> : <Navigate to="/login"/>}
                                    />
                                    <Route
                                        path="/books"
                                        element={isLoggedIn ? <BookList/> : <Navigate to="/login"/>}
                                    />
                                </Routes>
                            </div>
                        </Content>
                    </Layout>
                </Layout>
            </Router>
        </ConfigProvider>
    );
}

export default App;
