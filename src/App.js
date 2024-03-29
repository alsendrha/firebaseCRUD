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
import HomePageInfo from "./pages/mypage/homeinfo/HomePageInfo";
import MyItem from "./pages/mypage/myitem/MyItem";
import SearchPage from "./pages/search/SearchPage";
import SignUp from "./pages/signup/SignUp";

const Layout = () => {
  const location = useLocation();
  const isChatPage =
    location.pathname === "/chat" || location.pathname === "/chat_list";

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
      <BrowserRouter>
        <ScrollTop />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<ListPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup/:userId" element={<SignUp />} />
            <Route path="/my_page" element={<MyPage />} />
            <Route path="/my_page/my_item" element={<MyItem />} />
            <Route path="/my_page/home_info" element={<HomePageInfo />} />
            <Route path="/insert/:itemId" element={<ListInsertPage />} />
            <Route path="/detail/:itemId" element={<DetailPage />} />
            <Route path="/chat_list" element={<ChatListPage />} />
            <Route path="/chat" element={<Chat />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
