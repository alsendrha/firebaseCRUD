import { GoogleMap, Marker } from "@react-google-maps/api";
import { deleteDoc, doc } from "firebase/firestore";
import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../../../firebase";
import { userContext } from "../../login/UserContext";
import "./DetailPage.css";

const DetailPage = () => {
  const navigate = useNavigate();
  const detailData = useLocation();
  const item = detailData.state;
  const { user } = useContext(userContext);
  const deleteItem = async () => {
    const result = window.confirm("정말 삭제하시겠습니까?");
    if (result) {
      await deleteDoc(doc(db, "items", item.id));
      alert("삭제되었습니다.");
      navigate("/");
    } else {
      return;
    }
  };
  const center = { lat: item.lat, lng: item.lng };
  console.log(item);
  const givenDate = new Date(
    item.date.seconds * 1000 + item.date.nanoseconds / 1000000
  );
  // 현재 시간
  const currentDate = new Date();
  // 주어진 시간과 현재 시간 사이의 시간 차이 계산 (밀리초 단위)
  const timeDifference = currentDate - givenDate;
  // 밀리초를 분 단위로 변환
  const minutesDifference = Math.floor(timeDifference / (1000 * 60));
  // 몇 시간 전 또는 몇 분 전인지 판단
  let timeAgo;
  if (minutesDifference < 60) {
    timeAgo = `${minutesDifference}분 전`;
  } else {
    const hoursDifference = Math.floor(minutesDifference / 60);
    if (hoursDifference < 24) {
      timeAgo = `${hoursDifference}시간 전`;
    } else {
      const daysDifference = Math.floor(hoursDifference / 24);
      timeAgo = `${daysDifference}일 전`;
    }
  }

  console.log("주어진 시간으로부터 " + timeAgo);
  return (
    <div>
      <div className="detail_container">
        {item.imageUrl && (
          <div className="detail_image_container">
            <img
              className="detail_main_image"
              src={item.imageUrl}
              alt="이미지다!"
            />
          </div>
        )}
        <div className="detail_user_container">
          <div className="detail_user_main_container">
            <img
              className="detail_user_profile_image"
              src={item.userProfile}
              alt="userProfile"
            />
            <div className="detail_user_text">
              <p className="detail_user_nick_name">{item.userNickName}</p>
              <p className="detail_user_address">{item.address}</p>
            </div>
          </div>
          <div className="bottom_line"></div>
        </div>
        <div className="detail_content_container">
          <p className="detail_item_title">{item.title}</p>
          <p className="detail_item_date">{`${item.trade} · ${timeAgo}`}</p>
          <p className="detail_item_price">
            {Number(item.price).toLocaleString()}원
          </p>
          <p className="detail_item_content">{item.content}</p>
          <div className="bottom_line"></div>
        </div>
        <div className="google_map_container">
          <GoogleMap
            center={center}
            zoom={17}
            mapContainerStyle={{ width: "100vw" }}
            options={{
              zoomControl: false,
              scrollwheel: true,
            }}
          >
            <Marker
              icon={{
                url: "/images/marker.png",
                scaledSize: new window.google.maps.Size(50, 65),
              }}
              position={center}
            />
          </GoogleMap>
        </div>
        <div className="button_container_main">
          <div className="detail_button" onClick={() => navigate("/")}>
            목록으로
          </div>
          {user && item.user === user.id ? (
            <div className="button_container">
              <div
                className="detail_button"
                onClick={() =>
                  navigate("/insert/2", {
                    state: {
                      id: item.id,
                    },
                  })
                }
              >
                수정하기
              </div>
              <div className="detail_button" onClick={deleteItem}>
                삭제
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
