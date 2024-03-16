import { signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { userContext } from "../login/UserContext";
import "./MyPage.css";
const MyPage = () => {
  const { setUserData, userData, user } = useContext(userContext);
  const navigate = useNavigate();
  const [userPostCount, setUserPostCount] = useState(0);

  const getPostData = async () => {
    if (!user) return;
    const response = await getDocs(
      query(collection(db, "items"), where("user", "==", userData.user.uid))
    );

    console.log(response.docs.map((doc) => doc.data()));
    setUserPostCount(response.docs.map((doc) => doc.data()));
    console.log("이건 그냥 유저", userData.user.uid);
  };

  useEffect(() => {
    getPostData();
  }, [userData, user]);

  if (!user) return;

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
          <div
            className="my_page_user_post_item"
            style={{ borderRadius: "0 0 0 8px" }}
          >
            <p className="my_page_user_post_title">나의 게시물 수</p>
            <p className="my_page_title1" onClick={() => navigate('my_item', {
              state: {
                userPostCount
              }
            })}>{userPostCount.valueOf().length}</p>
          </div>
          <div className="my_page_user_post_item2">
            <p className="my_page_user_post_title">준비중</p>
            <p className="my_page_title">0</p>
          </div>
          <div
            className="my_page_user_post_item"
            style={{ borderRadius: "0 0 8px 0" }}
          >
            <p className="my_page_user_post_title">준비중</p>
            <p className="my_page_title">0</p>
          </div>
        </div>

        <div className="my_page_menu">
          <div
            className="my_menu_item"
            onClick={() =>
              navigate("/signup/2", {
                state: { user },
              })
            }
          >
            <p>나의 정보</p>
          </div>
          <div className="my_menu_item" onClick={() => navigate("home_info")}>
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
