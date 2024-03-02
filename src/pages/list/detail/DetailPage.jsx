import { deleteDoc, doc } from 'firebase/firestore';
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { db } from '../../../firebase';
const DetailPage = () => {
  const navigate = useNavigate();
  const detailData = useLocation();
  const item = detailData.state;

  const deleteItem = async () => {
    const result = window.confirm('정말 삭제하시겠습니까?');
    if (result) {
      await deleteDoc(doc(db, 'items', item.id));
      alert('삭제되었습니다.');
      navigate('/');
    } else {
      return;
    }
  }

  return (
    <div>
      {item.imageUrl && (
        <img src={item.imageUrl} style={{ width: '100px' }} alt='이미지다!' />
      )}
      <h1>{item.title}</h1>
      <p>{item.content}</p>
      <button onClick={() => navigate('/insert/2', {
        state: {
          id: item.id
        }
      })}>수정</button>
      <button onClick={deleteItem}>삭제</button>
    </div>
  )
}

export default DetailPage