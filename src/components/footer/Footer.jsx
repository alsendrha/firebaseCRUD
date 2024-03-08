import React from "react";
import "./Footer.css";
const Footer = () => {
  return (
    <div>
      <div>
        <div className="footer_line"></div>
        <div className="footer_container">
          <div className="footer_flex_icon">
            <div className="footer_main_text">
              <strong>대표&nbsp;</strong>
              <span>김민영</span>
              <span className="footer_text_line">&nbsp;|&nbsp;</span>
              <strong>사업자번호&nbsp;</strong>
              <span>010-00-00001</span>
              <br />
              <strong>직업정보제공사업 신고번호&nbsp;</strong>
              <span> M1234567891011</span>
              <br />
              <strong>주소&nbsp;</strong>
              <span>서울시 서대문구 우리집로 1길 301호</span>
              <br />
              <strong>전화&nbsp;</strong>
              <span>010-1234-0001</span>
              <span className="footer_text_line">&nbsp;|&nbsp;</span>
              <strong>고객문의&nbsp;</strong>
              <span>minyoung@freshvege.com</span>
            </div>
            <div className="footer_icon_container">
              <div className="footer_icon">
                <img src="/images/facebook.svg" alt="페북 아이콘" />
              </div>
              <div className="footer_icon">
                <img src="/images/insta.svg" alt="인스타 아이콘" />
              </div>
              <div className="footer_icon">
                <img src="/images/youtube.svg" alt="유튜브 아이콘" />
              </div>
              <div className="footer_icon">
                <img src="/images/blog.svg" alt="블로그 아이콘" />
              </div>
              {/* <div className="footer_icon_last">
                <img
                  style={{ fill: "red" }}
                  src="/images/earth.svg"
                  alt="지구 아이콘"
                />
                <span style={{ marginLeft: "5px" }}>한국</span>
              </div> */}
            </div>
          </div>
          <br />
          <br />
          <div className="footer_last_one">
            <p>제휴 문의</p>
            <p>광고 문의</p>
            <p>PR 문의</p>
            <p>IR 문의</p>
          </div>
          <br />
          <div className="footer_last_two">
            <p>이용약관</p>
            <p>개인정보처리방침</p>
            <p>위치기반서비스 이용약관</p>
            <p>이용자보호 비전과 계획</p>
            <p>청소년보호정책</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
