import React from "react";
import "./MyPage.css";
const MyPage = () => {
  return (
    <div>
      <div className="my_page_container">
        <div>
          <h1>마이페이지</h1>
        </div>
        <div>
          <div>
            <p>나의 정보</p>
          </div>
          <div>
            <p>홈페이지 정보</p>
          </div>
          <div>
            <p>로그아웃</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
