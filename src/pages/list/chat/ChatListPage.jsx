import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../../../firebase';
import { useLocation, useNavigate } from 'react-router-dom';
import Chat from './Chat';

const ChatListPage = () => {
  const [chatUsers, setchatUsers] = useState([]);
  const navigate = useNavigate();
  const itemData = useLocation().state;
  const getUserChatList = async () => {
    const chatUserListRef = collection(db, 'chatUserList');
    const querySnapshot = await getDocs(chatUserListRef);
    const chatUserList = [];
    querySnapshot.forEach((doc) => {
      // 문서 데이터를 chatUserList 배열에 추가합니다.
      chatUserList.push({
        id: doc.id,
        ...doc.data()
      });
    });
    setchatUsers(chatUserList);
  }

  console.log(itemData);

  useEffect(() => {
    getUserChatList();
  }, [])

  console.log('채팅 유저 목록', chatUsers);



  return (
    <div>
      <h1>채팅 목록</h1>
      <div className='chat_list_container'>
        <div style={{ cursor: 'pointer' }}>
          {chatUsers.map((user) => (
            <div key={user.id}>
              <div onClick={() => navigate('/chat', {
                state: {
                  userNickName: user.id,
                  itemId: itemData.itemId,
                  userProfile: itemData.userProfile,
                  email: itemData.email,
                }
              }
              )}>{user.userNickName}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ChatListPage