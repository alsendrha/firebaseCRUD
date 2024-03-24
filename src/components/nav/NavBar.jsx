import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userContext } from "../../pages/login/UserContext";
import "./NavBar.css";
const NavBar = () => {
  const { user } = useContext(userContext);
  const navigate = useNavigate();
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isSearchChecked, setIsSearchChecked] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1200) {
      console.log("일단 이렇게");
      setIsSearchChecked(false);
      setIsChecked(false);
    }
  });

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleSearCheckBoxChange = (event) => {
    setIsSearchChecked(event.target.checked);
  };

  // const dropDown = () => {
  //   setIsDropdownOpen(!isDropdownOpen);
  // };

  const goHome = () => {
    navigate("/");
  };

  const handleNavigate = (page) => {
    switch (page) {
      case "market":
        navigate("/");
        setIsChecked(false);
        break;
      case "my_page":
        user ? navigate("/my_page") : navigate("/login");
        setIsChecked(false);
        break;
      case "login":
        navigate("/login");
        setIsChecked(false);
        break;
      default:
        break;
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      navigate(`/search/`, { state: { searchValue } });
    }
  };

  return (
    <div>
      <div className="nav_container nav_position">
        <input
          type="checkbox"
          id="nav_search_small"
          className="nav_search_small"
          checked={isSearchChecked}
          onChange={handleSearCheckBoxChange}
        />
        <div className="logo_main_container" onClick={goHome}>
          <div className="logo_container">
            <img src="/images/logo1.png" alt="로고" className="logo" />
          </div>
          <div className="logo_title_container">
            <p className="logo_title">배추1마켓</p>
          </div>
        </div>

        {isChecked && (
          <div className="overlay" onClick={() => setIsChecked(false)}></div>
        )}

        <input
          type="checkbox"
          id="nav_menu_small"
          className="nav_menu_small"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <div className="menu_list">
          <ul>
            <li onClick={() => handleNavigate("market")}>중고거래</li>
            <li onClick={() => handleNavigate("my_page")}>마이페이지</li>
            {!user ? (
              <li
                className="nav_menu_list_login"
                onClick={() => handleNavigate("login")}
              >
                로그인
              </li>
            ) : null}
          </ul>
        </div>
        <div className="nav_search_container">
          <input
            className="nav_search_input"
            type="text"
            placeholder="상품을 검색해주세요"
            value={searchValue}
            onKeyDown={handleSearch}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <div className="icon_container">
          <label className="nav_search_label" htmlFor="nav_search_small">
            {!isSearchChecked ? (
              <img src="/images/search.svg" alt="검색" />
            ) : (
              <p className="nav_search_small_close">취소</p>
            )}
          </label>
          <label className="nav_checkbox_label" htmlFor="nav_menu_small">
            <img
              src={isChecked ? "/images/close.svg" : "/images/hamburger.svg"}
              alt="메뉴"
            />
          </label>
        </div>
        <div className="login_button2">
          {!user ? (
            <button className="login_button" onClick={() => navigate("/login")}>
              로그인
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
