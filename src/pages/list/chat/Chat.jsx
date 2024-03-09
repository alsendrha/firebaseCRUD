import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { db } from '../../../firebase';
import './Chat.css'
import { userContext } from '../../login/UserContext';
const Chat = () => {
  const itemData = useLocation().state;
  console.log('이건 안나오나', itemData);
  const [newMessage, setnewMessage] = useState('');
  const [messages, setmessages] = useState([]);
  const { user } = useContext(userContext);
  const messagesRef = collection(db, 'items', itemData.itemId, `${itemData.userNickName}`);

  useEffect(() => {
    const queryMessages = query(messagesRef, orderBy('createAt', 'desc'));
    const unsuscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      })
      setmessages(messages);
    });

    return () => unsuscribe();

  }, [])


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage === '') return;

    await addDoc(messagesRef, {
      text: newMessage,
      createAt: serverTimestamp(),
      user: itemData.userNickName,
      userImage: itemData.userProfile,
      email: itemData.email
    });

    setnewMessage('');
  }
  console.log('채팅 내용', messages);
  return (
    <div className='chat-app'>
      <div className='header'><h1>welcome to : {itemData.userNickName}</h1></div>
      <div className='messages'>
        {messages.map((message) => (
          <div style={{ justifyContent: user.email === message.email ? 'end' : 'start' }} className='message message_flex' key={message.id}>
            <img className='user_profile' src={message.userImage ? message.userImage : '/images/no_profile.png'} alt='profile' />
            <span className='user'>
              {message.user}
            </span>
            <p>{message.text}</p>
          </div>
        )
        )}
      </div>
      <form onSubmit={handleSubmit} className='new_message-form'>
        <input
          className='new-message-input'
          placeholder='내용을 입력해라'
          value={newMessage}
          onChange={(e) => setnewMessage(e.target.value)}
        />
        <button type='submit' className='send-button'>send</button>
      </form>
    </div>
  )
}

export default Chat