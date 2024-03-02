import React, { useRef, useState } from 'react'
import './SignUp.css'
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { db, storage } from '../../firebase';
const SignUp = () => {
  const navigate = useNavigate();
  const imageFile = useRef(null);
  const [file, setFile] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userPasswordCheck, setUserPasswordCheck] = useState('');
  const [userNickName, setUserNickName] = useState('');
  let imageUrl = null;
  const handleClick = () => {
    imageFile.current.click();
  }

  const fileUpload = (e) => {
    console.log('파일 업로드 시작')
    const file = e.target.files[0];
    if (!file) {
      console.log('파일이 없습니다.')
      return;
    }
    // Blob 객체인지 확인
    if (!(file instanceof Blob)) {
      console.error("파일이 유효하지 않습니다.");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    return new Promise((resolve) => {
      reader.onload = () => {
        setFile(reader.result);
        resolve();
        console.log('이미지 업로드 성공')
      }
    })
  }

  const onClearImageFile = () => {
    imageFile.current.value = '';
    setFile(null);
  };

  const signUp = async () => {
    try {
      if (!userEmail || !userPassword || !userPasswordCheck || !userNickName) {
        alert('모든 항목을 입력해주세요.');
        return;
      };
      if (userPassword !== userPasswordCheck) {
        alert('비밀번호가 일치하지 않습니다.')
        return;
      }


      const auth = getAuth();
      const newUser = await createUserWithEmailAndPassword(auth, userEmail, userPassword)

      if (file) {
        const storageRef = ref(storage, `users/${newUser.user.uid}`);
        await uploadString(storageRef, file, 'data_url')
        imageUrl = await getDownloadURL(ref(storage, `users/${newUser.user.uid}`));
      }

      await setDoc(doc(collection(db, "users"), newUser.user.uid), {
        id: newUser.user.uid,
        email: userEmail,
        password: userPassword,
        nickName: userNickName,
        userProfile: imageUrl,
        date: new Date(),
      })


      alert('회원가입이 완료되었습니다.');
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <h1>회원가입 페이지</h1>
      {file ? <img className='user_image' src={file} onClick={onClearImageFile} alt='유저 이미지' /> : <div className='image_container' onClick={handleClick}>이미지 등록</div>}
      <input ref={imageFile} type='file' style={{ display: 'none' }} onChange={(e) => fileUpload(e)} />
      <input
        type='email'
        value={userEmail}
        placeholder='이메일'
        onChange={(e) => setUserEmail(e.target.value)}
      />
      <br />
      <input
        type='password'
        value={userPassword}
        placeholder='비밀번호'
        onChange={(e) => setUserPassword(e.target.value)}
      />
      <br />
      <input
        type='password'
        value={userPasswordCheck}
        placeholder='비밀번호 확인'
        onChange={(e) => setUserPasswordCheck(e.target.value)}
      />
      <br />
      <input
        type='text'
        value={userNickName}
        placeholder='닉네임'
        onChange={(e) => setUserNickName(e.target.value)}
      />
      <br />
      <button onClick={signUp}>회원가입</button>
      <br />
      <button onClick={() => navigate('/login')}>돌아가기</button>
    </div>
  )
}

export default SignUp