import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../../../../firebase";
import { userContext } from "../../../login/UserContext";
import "./Chat.css";
const Chat = () => {
  const itemData = useLocation().state;
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { user } = useContext(userContext);
  const messagesEndRef = useRef(null);

  const messagesRef = itemData
    ? collection(db, "items", itemData.itemId, `${itemData.collection}`)
    : null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    console.log("여긴 유즈이펙트");
    if (!itemData) return;
    const queryMessages = query(messagesRef, orderBy("createAt", "desc"));
    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, []);

  if (!itemData) return;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    await addDoc(messagesRef, {
      text: newMessage,
      createAt: serverTimestamp(),
      user: itemData.userNickName,
      userImage: itemData.userProfile,
      email: itemData.userEmail,
    });
    setNewMessage("");
    scrollToBottom();
    if (itemData.collection !== itemData.userEmail) return;
    const newChat = doc(db, `${itemData.itemId}`, `${itemData.userEmail}`);
    await updateDoc(newChat, {
      newMessage: true,
    });
  };

  return (
    <div className="chat-app">
      <div className="header">
        <h1>welcome to : {itemData.userNickName}</h1>
      </div>
      <div className="messages">
        <div ref={messagesEndRef} />
        {messages.map((message) => (
          <div
            style={{
              justifyContent: user.email === message.email ? "end" : "start",
            }}
            className="message message_flex"
            key={message.id}
          >
            {user.email === message.email ? (
              <div
                className="user_massage_container"
                style={{
                  justifyContent:
                    user.email === message.email ? "end" : "start",
                }}
              >
                <div className="massage_text_container">
                  <div className="massage_text">
                    <p>{message.text}</p>
                  </div>
                </div>
                <div className="massage_user_info">
                  <div>
                    <span className="user">{message.user}</span>
                  </div>
                  <img
                    className="user_profile"
                    src={
                      message.userImage
                        ? message.userImage
                        : "/images/no_profile.png"
                    }
                    alt="profile"
                  />
                </div>
              </div>
            ) : (
              <div
                className="user_massage_container"
                style={{
                  justifyContent:
                    user.email === message.email ? "end" : "start",
                }}
              >
                <div className="massage_user_info">
                  <img
                    className="user_profile"
                    src={
                      message.userImage
                        ? message.userImage
                        : "/images/no_profile.png"
                    }
                    alt="profile"
                  />
                  <div>
                    <span className="user">{message.user}</span>
                  </div>
                </div>
                <div className="massage_text_container">
                  <div className="massage_text1">
                    <p>{message.text}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="new_message-form">
        <input
          className="new-message-input"
          placeholder="내용을 입력해라"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit" className="send-button">
          send
        </button>
      </form>
    </div>
  );
};

export default Chat;
