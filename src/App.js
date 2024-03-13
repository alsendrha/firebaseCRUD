import { QueryClient, QueryClientProvider } from "react-query";
import {
  BrowserRouter,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "./App.css";
import ScrollTop from "./components/ScrollTop";
import Footer from "./components/footer/Footer";
import NavBar from "./components/nav/NavBar";
import ListInsertPage from "./pages/list/ListInsertPage";
import ListPage from "./pages/list/ListPage";
import DetailPage from "./pages/list/detail/DetailPage";
import Chat from "./pages/list/detail/chat/Chat";
import ChatListPage from "./pages/list/detail/chat/ChatListPage";
import LoginPage from "./pages/login/LoginPage";
import MyPage from "./pages/mypage/MyPage";
import SignUp from "./pages/signup/SignUp";

const queryClient = new QueryClient();

const Layout = () => {
  const location = useLocation();
  const isChatPage = location.pathname === "/chat";

  return (
    <div className="layout-container">
      <NavBar />
      <div className="gap"></div>
      <Outlet />
      {!isChatPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ScrollTop />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<ListPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/insert/:itemId" element={<ListInsertPage />} />
              <Route path="/detail" element={<DetailPage />} />
              <Route path="/chatlist" element={<ChatListPage />} />
              <Route path="/chat" element={<Chat />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  );
}

export default App;
