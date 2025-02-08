import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import BookForm from './BookForm.tsx';
import BookList from "./ BookList.tsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<BookForm/>}/>
                <Route path="/books" element={<BookList/>}/>
            </Routes>
        </Router>
    );
}

export default App;
