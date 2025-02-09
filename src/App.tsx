import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import Dashboard from './Dashboard';
import BookList from "./ BookList.tsx";
import '@ant-design/v5-patch-for-react-19';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard/>}/>
                <Route path="/books" element={<BookList/>}/>
            </Routes>
        </Router>
    );
}

export default App;
