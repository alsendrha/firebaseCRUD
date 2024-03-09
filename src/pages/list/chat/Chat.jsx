import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { db } from '../../../firebase';
import './Chat.css'
const Chat = () => {
  const userNickName = useLocation().state;
  console.log('이건 안나오나', userNickName);
  const [newMessage, setnewMessage] = useState('');
  const [messages, setmessages] = useState([]);

  const messagesRef = collection(db, 'messages');

  useEffect(() => {
    const queryMessages = query(messagesRef, where('room', '==', userNickName.userNickName), orderBy('createAt'));
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
      user: userNickName.userNickName,
      room: userNickName.userNickName,
    });

    setnewMessage('');
  }
  console.log('채팅 내용', messages);
  return (
    <div className='chat-app'>
      <div className='header'><h1>welcome to : {userNickName.userNickName}</h1></div>
      <div className='messages'>{messages.map((message) => (<div className='message' key={message.id}><span className='user'>{message.user}</span>{message.text}</div>))}</div>
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