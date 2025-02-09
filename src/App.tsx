import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import Dashboard from './Dashboard';
import SideMenu from './SideMenu';
import BookList from "./ BookList.tsx";
import {ConfigProvider, Layout, theme} from 'antd';
import {useState} from 'react';

const {Content} = Layout;

function App() {
    const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');

    const toggleTheme = () => {
        setThemeMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
    };

    const currentTheme = themeMode === 'light' ? theme.defaultAlgorithm : theme.darkAlgorithm;

    return (
        <ConfigProvider theme={{algorithm: currentTheme}}>
        <Router>
            <Layout style={{minHeight: '100vh'}}>
                <SideMenu toggleTheme={toggleTheme} themeMode={themeMode}/>
                <Layout>
                    <Content style={{margin: '24px 16px 0', overflow: 'initial'}}>
                        <div style={{padding: 24, textAlign: 'center'}}>
                            <Routes>
                                <Route path="/" element={<Dashboard/>}/>
                                <Route path="/books" element={<BookList/>}/>
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
