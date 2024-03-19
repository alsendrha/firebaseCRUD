import { GoogleMap, Marker } from "@react-google-maps/api";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  where,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../../firebase";
import { userContext } from "../../login/UserContext";
import "./DetailPage.css";

const DetailPage = () => {
  const navigate = useNavigate();
  const { userData, user } = useContext(userContext);
  const [newMessage, setNewMessage] = useState([]);
  const [detailItem, setDetailItem] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const getItemId = useParams();

  const getNewMessage = async () => {
    if (!getItemId) return;
    const messages = await getDocs(
      collection(db, `${getItemId.itemId}`),
      where("newMessage", "==", true)
    );
    setNewMessage(messages.docs.map((doc) => doc.data().newMessage));
  };

  const getItem = async () => {
    if (!getItemId) return;
    const itemData = await getDoc(doc(db, "items", getItemId.itemId));
    setDetailItem(itemData.data());
    setIsLoading(false);
  };

  useEffect(() => {
    getNewMessage();
    getItem();
  }, []);

  if (!getItemId) return;

  const deleteItem = async () => {
    const result = window.confirm("정말 삭제하시겠습니까?");
    if (result) {
      await deleteDoc(doc(db, "items", detailItem.id));
      alert("삭제되었습니다.");
      navigate("/");
    } else {
      return;
    }
  };
  const chat = async () => {
    if (!user) return navigate("/login");
    if (user.nickName !== detailItem.userNickName) {
      const chatUserListRef = doc(db, `${detailItem.id}`, user.email);
      await setDoc(chatUserListRef, {
        email: user.email,
        userNickName: user.nickName,
        collection: user.email,
        newMessage: false,
        createAt: new Date(),
      });
      navigate("/chat", {
        state: {
          userNickName: user.nickName,
          itemId: detailItem.id,
          userProfile: user.userProfile,
          collection: user.email,
          userEmail: user.email,
        },
      });
    } else {
      navigate("/chat_list", {
        state: {
          userNickName: user.nickName,
          itemId: detailItem.id,
          userProfile: user.userProfile,
          collection: user.email,
          userEmail: user.email,
        },
      });
    }
  };

  if (isLoading) return <div>로딩중...</div>;

  const center = { lat: detailItem.lat, lng: detailItem.lng };
  const givenDate = new Date(
    detailItem.date.seconds * 1000 + detailItem.date.nanoseconds / 1000000
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
        {detailItem.imageUrl && (
          <div className="detail_image_container">
            <img
              className="detail_main_image"
              src={detailItem.imageUrl}
              alt="이미지다!"
            />
          </div>
        )}
        <div className="detail_user_container">
          <div className="detail_user_main_container">
            <div className="detail_user_info">
              <img
                className="detail_user_profile_image"
                src={
                  detailItem.userProfile
                    ? detailItem.userProfile
                    : "/images/no_profile.png"
                }
                alt="userProfile"
              />
              <div className="detail_user_text">
                <p className="detail_user_nick_name">
                  {detailItem.userNickName}
                </p>
                <p className="detail_user_address">{detailItem.address}</p>
              </div>
            </div>
            <div className="detail_chat" onClick={chat}>
              {detailItem.user === userData?.user.uid &&
              newMessage.includes(true) ? (
                <p className="detail_new_chat">*</p>
              ) : null}
              <img src="/images/chat.svg" alt="chat" />
            </div>
          </div>
          <div className="bottom_line"></div>
        </div>
        <div className="detail_content_container">
          <p className="detail_item_title">{detailItem.title}</p>
          <p className="detail_item_date">{`${detailItem.trade} · ${timeAgo}`}</p>
          <p className="detail_item_price">
            {Number(detailItem.price).toLocaleString()}원
          </p>
          <p className="detail_item_content">{detailItem.content}</p>
          <div className="bottom_line"></div>
        </div>
        <div className="google_map_container">
          <GoogleMap
            center={center}
            zoom={17}
            mapContainerStyle={{ width: "100%", height: "100%" }}
            options={{
              zoomControl: false,
              scrollwheel: true,
            }}
          >
            <Marker
              icon={{
                url: "/images/logo1.png",
                scaledSize: new window.google.maps.Size(40, 55),
              }}
              position={center}
            />
          </GoogleMap>
        </div>
        <div className="button_container_main">
          <div className="detail_button" onClick={() => navigate("/")}>
            목록으로
          </div>
          {user && detailItem.user === user.id ? (
            <div className="button_container">
              <div
                className="detail_button"
                onClick={() =>
                  navigate("/insert/2", {
                    state: {
                      id: detailItem.id,
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
