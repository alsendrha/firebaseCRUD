import { collection, getDocs } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../../firebase';
import { userContext } from '../login/UserContext';

const ListPage = () => {
  const { userData } = useContext(userContext);
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  let noData;

  const getItemsData = async () => {
    const getData = await getDocs(collection(db, 'items'));
    console.log(getData.docs.map(doc => doc.data()));
    if (getData.docs.length === 0) {
      return noData = <p>데이터가 없습니다.</p>;
    }
    setItems(getData.docs.map(doc => doc.data()));
  }

  useEffect(() => {
    getItemsData();
  }, [])

  return (
    <div>
      <div>
        {noData ? noData : items.map((item) => (
          <div key={item.id}>
            <p style={{ cursor: 'pointer', borderBottom: '1px solid black', width: '300px' }} onClick={() => navigate('/detail', { state: item })}>{item.title}</p>
          </div>
        ))}
      </div>
      <button onClick={() => navigate('/insert/1')} >글쓰기</button>
      {userData ? null : <button onClick={() => navigate('/login')} >
        로그인 페이지
      </button>}
    </div>
  )
}

export default ListPage