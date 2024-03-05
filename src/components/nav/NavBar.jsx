import { doc, getDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { userContext } from "../../pages/login/UserContext";
import Dropdown from "../Dropdown";
import "./NavBar.css";
const NavBar = () => {
  const { userData } = useContext(userContext);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const userGetData = async () => {
    try {
      if (!userData) return;
      const getData = await getDoc(doc(db, "users", userData.user.uid));
      console.log(getData.data());
      setUser(getData.data());
    } catch (error) {}
  };

  const dropDown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    userGetData();
  }, [userData]);
  return (
    <div>
      <div className="nav_container nav_position">
        <div
          className="logo_main_container"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          <div className="logo_container">
            <img src="/images/logo.png" alt="로고" className="logo" />
          </div>
          <div>
            <p className="logo_title">배추마켓</p>
          </div>
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
