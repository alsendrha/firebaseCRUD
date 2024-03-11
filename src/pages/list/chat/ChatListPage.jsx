import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../../../firebase";
import "./ChatListPage.css";
const ChatListPage = () => {
  const [chatUsers, setchatUsers] = useState([]);
  const navigate = useNavigate();
  const itemData = useLocation().state;

  useEffect(() => {
    getUserChatList();
  }, []);

  const getUserChatList = async () => {
    if (!itemData) return;
    const chatUserListRef = collection(db, `${itemData.itemId}`);
    const querySnapshot = await getDocs(chatUserListRef);
    const chatUserList = [];
    querySnapshot.forEach((doc) => {
      // 문서 데이터를 chatUserList 배열에 추가합니다.
      chatUserList.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    setchatUsers(chatUserList);
  };

  const chat = async (user) => {
    console.log(itemData.userEmail);
    const newchat = doc(db, `${itemData.itemId}`, `${user.email}`);
    await updateDoc(newchat, {
      newMessage: false,
    });
    navigate("/chat", {
      state: {
        userNickName: itemData.userNickName,
        itemId: itemData.itemId,
        userProfile: itemData.userProfile,
        collection: user.email,
        userEmail: itemData.userEmail,
      },
    });
  };

  if (!itemData) return;

  return (
    <div className="chat_list_container">
      <h1>채팅 목록</h1>
      <div>
        <div className="chat_list_user_items">
          {chatUsers.map((user) => (
            <div className="chat_list_user_item" key={user.id}>
              <div onClick={() => chat(user)}>
                <p>{user.userNickName}</p>
                {user.newMessage ? (
                  <span style={{ color: "red" }}>new</span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatListPage;
