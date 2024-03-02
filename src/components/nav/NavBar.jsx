import React, { useContext, useEffect, useState } from 'react'
import './NavBar.css'
import { userContext } from '../../pages/login/UserContext';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
const NavBar = () => {
  const { userData } = useContext(userContext);
  const [user, setUser] = useState(null);
  console.log(userData.user.uid);

  const userGetData = async () => {
    try {
      console.log('여기까진 나오나?');
      if (!userData) return;
      console.log('여기까진 나오나02');
      const getData = await getDoc(doc(db, 'users', userData.user.uid));
      setUser(getData.data());
    } catch (error) {
    }
  }

  useEffect(() => {
    userGetData();
  }, [])

  if (!user) return;

  return (
    <div>
      <div className='nav_container'>
        <div>네비바</div>
        <div style={{ paddingRight: '20px' }}>
          <img
            className='user_nav_image'
            src={user.userProfile}
          />
        </div>
      </div>
    </div>
  )
}

export default NavBar