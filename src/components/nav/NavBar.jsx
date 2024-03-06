import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { pageContext } from "../../pages/list/InsertContext";
import { userContext } from "../../pages/login/UserContext";
import Dropdown from "../Dropdown";
import "./NavBar.css";
const NavBar = () => {
  const { user } = useContext(userContext);
  const { pageData, setPageData } = useContext(pageContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropDown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const goHome = () => {
    setPageData(null);
    navigate("/");
  };

  return (
    <div>
      <div className="nav_container nav_position">
        <div
          className="logo_main_container"
          style={{ cursor: "pointer" }}
          onClick={goHome}
        >
          <div className="logo_container">
            <img src="/images/logo.png" alt="로고" className="logo" />
          </div>
          <div>
            <p className="logo_title">
              {pageData === "1"
                ? "내 물건 팔기"
                : pageData === "2"
                ? "내 물건 수정하기"
                : "배추마켓"}{" "}
            </p>
          </div>
        </div>
        <div className="menu_list">
          <ul>
            <li onClick={() => navigate("/")}>중고거래</li>
            <li onClick={() => navigate("/mypage")}>마이페이지</li>
          </ul>
        </div>
        <div>
          {!user ? (
            <button className="login_button" onClick={() => navigate("/login")}>
              로그인
            </button>
          ) : (
            <div className="user_nav_image_container">
              <img
                className="user_nav_image"
                src={user.userProfile}
                alt="유저 이미지"
                onClick={dropDown}
              />
              {isDropdownOpen && <Dropdown />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
