import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import SideMenu from './SideMenu';
import Dashboard from './Dashboard';
import BookList from "./ BookList.tsx";
import '@ant-design/v5-patch-for-react-19';
import {Layout} from 'antd';

const {Content} = Layout;

function App() {
    return (
        <Router>
            <Layout style={{minHeight: '100vh'}}>
                <SideMenu/>
                <Layout>
                    <Content style={{margin: '24px 16px 0', overflow: 'initial'}}>
                        <div className="site-layout-background" style={{padding: 24, textAlign: 'center'}}>
                            <Routes>
                                <Route path="/" element={<Dashboard/>}/>
                                <Route path="/books" element={<BookList/>}/>
                            </Routes>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </Router>
    );
}

export default App;
