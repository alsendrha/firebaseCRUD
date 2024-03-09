import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/footer/Footer";
import NavBar from "./components/nav/NavBar";
import ListInsertPage from "./pages/list/ListInsertPage";
import ListPage from "./pages/list/ListPage";
import DetailPage from "./pages/list/detail/DetailPage";
import LoginPage from "./pages/login/LoginPage";
import MyPage from "./pages/mypage/MyPage";
import SignUp from "./pages/signup/SignUp";
import Chat from "./pages/list/chat/Chat";

const queryClient = new QueryClient();

const Layout = () => {
  return (
    <div className="layout-container">
      <NavBar />
      <div className="gap"></div>
      <Outlet />
      <Footer />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<ListPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/insert/:itemId" element={<ListInsertPage />} />
              <Route path="/detail" element={<DetailPage />} />
              <Route path="/chat" element={<Chat />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  );
}

export default App;
