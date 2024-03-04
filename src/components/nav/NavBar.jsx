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
      <div className="nav_container">
        <div style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          네비바
        </div>
        <div style={{ paddingRight: "20px" }}>
          {!user ? (
            <button className="login_button" onClick={() => navigate("/login")}>
              로그인
            </button>
          ) : (
            <div>
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
