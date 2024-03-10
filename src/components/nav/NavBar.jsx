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
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const dropDown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const goHome = () => {
    setPageData(null);
    navigate("/");
  };

  const handleNavigate = (page) => {
    switch (page) {
      case 'market':
        navigate("/");
        setIsChecked(false);
        break;
      case 'mypage':
        user ? navigate("/mypage") : navigate("/login");
        setIsChecked(false);
        break;
      default:
        break;
    }
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
              배추마켓
            </p>
          </div>
        </div>

        {isChecked && <div className="overlay" onClick={() => setIsChecked(false)}></div>}
        <label className="nav_checkbox_label" htmlFor="nav_menu_small"><img src={isChecked ? '/images/close.svg' : '/images/hamburger.svg'} /></label>
        <input
          type="checkbox"
          id="nav_menu_small"
          className="nav_menu_small"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <div className="menu_list">
          <ul>
            <li onClick={() => handleNavigate('market')}>중고거래</li>
            <li onClick={() => handleNavigate('mypage')}>마이페이지</li>
          </ul>
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
