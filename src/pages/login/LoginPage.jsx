import React from 'react'
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <input type='text' placeholder='아이디' />
      <br />
      <input type='password' placeholder='비밀번호' />
      <br />
      <button>로그인</button>
      <br />
      <button onClick={() => navigate('/singup')}>회원가입</button>
    </div>
  )
}

export default LoginPage