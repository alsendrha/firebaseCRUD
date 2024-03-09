import React, { useContext } from "react";
import "./MyPage.css";
import { userContext } from "../login/UserContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
const MyPage = () => {
  const { setUserData, user } = useContext(userContext);
  const navigate = useNavigate();
  console.log('여기는 마이페이지', user);

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
    <div>
      <div className="my_page_container">
        <div>
          <h1>마이페이지</h1>
        </div>
        <div className="user_info_container">
          {user ? <div className="user_my_image_container">
            <img
              className="user_my_image"
              src={user?.userProfile ? user?.userProfile : '/images/no_profile.png'}
              alt="유저 이미지"
            />
            <div className="user_name_container">
              <p>{user?.nickName}<span>님</span></p>
            </div>
          </div> : null}
        </div>
        <div className="my_page_menu">
          <div className="my_menu_item">
            <p>나의 정보</p>
          </div>
          <div className="my_menu_item">
            <p>홈페이지 정보</p>
          </div>
          <div className="my_menu_item">
            <p style={{ cursor: 'pointer' }} onClick={handleLogOut}>로그아웃</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
