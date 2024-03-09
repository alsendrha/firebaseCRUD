import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { userContext } from './UserContext';
import './LoginPage.css';
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
        console.log('로그인 에러입니다.', error);
      }
    }
  }

  const handleOnKeyPress = (e) => {
    if (e.key === 'Enter') {
      login();
    }
  };

  return (
    <div>
      <div className='login_container'>
        <h1><span>배추마켓</span> 로그인</h1>
        <div className='login_input_container'>
          <input
            className='login_input'
            type='text'
            value={email}
            placeholder='login@example.com'
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <input
            className='login_input'
            type='password'
            value={password}
            placeholder='비밀번호'
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleOnKeyPress}
          />
        </div>
        <br />
        <button className='login_page_button' onClick={login}>로그인</button>
        <br />
        <div className='login_page_signup'>
          <p>아직 회원이 아니시라면 <span onClick={() => navigate('/signup')}>회원가입하기</span></p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage