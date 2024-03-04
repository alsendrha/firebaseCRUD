import { signOut } from "firebase/auth";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { userContext } from "../pages/login/UserContext";
import "./nav/NavBar.css";
const Dropdown = () => {
  const { setUserData } = useContext(userContext);
  const navigate = useNavigate();
  const handleLogOut = () => {
    signOut(auth)
      .then(() => {
        setUserData({});
        localStorage.removeItem("userData");
        navigate("/");
        window.location.reload();
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <div className="dropdown">
      <ul>
        <li>마이페이지</li>
        <li onClick={handleLogOut}>로그아웃</li>
      </ul>
    </div>
  );
};

export default Dropdown;
