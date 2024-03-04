import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./components/nav/NavBar";
import ListInsertPage from "./pages/list/ListInsertPage";
import ListPage from "./pages/list/ListPage";
import DetailPage from "./pages/list/detail/DetailPage";
import LoginPage from "./pages/login/LoginPage";
import SignUp from "./pages/signup/SignUp";
const Layout = () => {
  return (
    <div className="layout-container">
      <NavBar />
      <Outlet />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<ListPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/singup" element={<SignUp />} />
            <Route path="/insert/:itemId" element={<ListInsertPage />} />
            <Route path="/detail" element={<DetailPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
