import React from "react";
import "./HomePageInfo.css";
const HomePageInfo = () => {
  return (
    <div className="home_page_info_container">
      <img
        className="home_page_info_logo"
        src="/images/logo1.png"
        alt="로고 이미지"
      />
      <div className="home_page_info_item">생성일 : 2024.03.01</div>
      <div className="home_page_info_item">완성일 : 2024.03.18</div>
      <div className="home_page_info_item">제작자 : 김민영</div>
      <div className="home_page_info_item">제작툴 : react</div>
      <div className="home_page_info_item">버전 : 1.0.0v</div>
    </div>
  );
};

export default HomePageInfo;
