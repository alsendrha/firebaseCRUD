import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import ListPage from './pages/ListPage';
import ListInsertPage from './pages/ListInsertPage';
import DetailPage from './pages/DetailPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route>
            <Route path='/' element={<ListPage />} />
            <Route path='/insert/:itemId' element={<ListInsertPage />} />
            <Route path='/detail' element={<DetailPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
