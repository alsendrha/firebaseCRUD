import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import ListPage from './pages/list/ListPage';
import ListInsertPage from './pages/list/ListInsertPage';
import DetailPage from './pages/list/detail/DetailPage';
import LoginPage from './pages/login/LoginPage';
import SignUp from './pages/signup/SignUp';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route>
            <Route path='/' element={<ListPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/singup' element={<SignUp />} />
            <Route path='/insert/:itemId' element={<ListInsertPage />} />
            <Route path='/detail' element={<DetailPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
