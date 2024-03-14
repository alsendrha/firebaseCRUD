import { signOut } from "firebase/auth";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { userContext } from "../login/UserContext";
import "./MyPage.css";
const MyPage = () => {
  const { setUserData, user } = useContext(userContext);
  const navigate = useNavigate();

  if (!user) return null;

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
        {user ? (
          <div className="user_my_image_container">
            <img
              className="user_my_image"
              src={
                user?.userProfile ? user?.userProfile : "/images/no_profile.png"
              }
              alt="유저 이미지"
            />
            <div className="user_name_container">
              <p>
                {user?.nickName}
                <span>님</span>
              </p>
            </div>
          </div>
        ) : null}
        <div className="my_page_user_post">
          <div className="my_page_user_post_item">
            <p className="my_page_user_post_title">나의 게시물 수</p>
            <p className="my_page_title">1</p>
          </div>
          <div className="my_page_user_post_item2">
            <p className="my_page_user_post_title">준비중</p>
            <p className="my_page_title">2</p>
          </div>
          <div className="my_page_user_post_item">
            <p className="my_page_user_post_title">준비중</p>
            <p className="my_page_title">3</p>
          </div>
        </div>

        <div className="my_page_menu">
          <div className="my_menu_item">
            <p>나의 정보</p>
          </div>
          <div className="my_menu_item" onClick={() => navigate("/userinfo")}>
            <p>홈페이지 정보</p>
          </div>
          <div className="my_menu_item" onClick={handleLogOut}>
            <p>로그아웃</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
