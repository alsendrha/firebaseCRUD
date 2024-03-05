import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { userContext } from './UserContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUserData } = useContext(userContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = async () => {
    try {
      if (!email || !password) {
        alert('모든 항목을 입력해주세요.');
        return;
      }
      const auth = getAuth();
      const user = await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("userData", JSON.stringify(user));
      setUserData(user);
      alert('로그인 성공');
      navigate('/');
    } catch (error) {
      if (error.code === 'invalid-credential') {
        alert('존재하지 않는 사용자입니다.');
      } else if (error.code === 'auth/invalid-email') {
        alert('이메일 형식이 잘못되었습니다.');
      } else if (error.code === 'auth/too-many-requests') {
        alert('너무 많은 요청이 들어왔습니다. 나중에 시도해주세요.');
      } else {
        console.log(error);
      }
    }
  }

  return (
    <div>
      <h1>로그인 페이지</h1>
      <input
        type='text'
        value={email}
        placeholder='아이디'
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input
        type='password'
        value={password}
        placeholder='비밀번호'
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button onClick={login}>로그인</button>
      <br />
      <button onClick={() => navigate('/signup')}>회원가입</button>
    </div>
  )
}

export default LoginPage