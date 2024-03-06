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
    const result = window.confirm("로그아웃 하시겠습니까?");
    if (result) {
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
    } else {
      return;
    }
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
