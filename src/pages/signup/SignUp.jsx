import React, { useRef, useState } from 'react'
import './SignUp.css'
import { useNavigate } from 'react-router-dom';
const SignUp = () => {
  const navigate = useNavigate();
  const imageFile = useRef(null);
  const [file, setFile] = useState(null);

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

  return (
    <div>
      {file ? <img className='user_image' src={file} onClick={onClearImageFile} alt='유저 이미지' /> : <div className='image_container' onClick={handleClick}>이미지 등록</div>}
      <input ref={imageFile} type='file' style={{ display: 'none' }} onChange={(e) => fileUpload(e)} />
      <input type='text' placeholder='아이디' />
      <br />
      <input type='password' placeholder='비밀번호' />
      <br />
      <input type='password' placeholder='비밀번호 확인' />
      <br />
      <input type='text' placeholder='닉네임' />
      <br />
      <button>회원가입</button>
      <br />
      <button onClick={() => navigate('/login')}>돌아가기</button>
    </div>
  )
}

export default SignUp