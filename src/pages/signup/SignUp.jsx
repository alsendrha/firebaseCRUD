import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { collection, doc, getDocs, setDoc, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React, { useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../../firebase";
import "./SignUp.css";
const SignUp = () => {
  const navigate = useNavigate();
  const imageFile = useRef(null);
  const [file, setFile] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userPasswordCheck, setUserPasswordCheck] = useState("");
  const [userNickName, setUserNickName] = useState("");
  const [buttonClicked, setButtonClicked] = useState(false);
  const [nickCheck, setNickCheck] = useState(false);
  let imageUrl = null;
  const handleClick = () => {
    imageFile.current.click();
  };

  const fileUpload = (e) => {
    console.log("파일 업로드 시작");
    const file = e.target.files[0];
    if (!file) {
      console.log("파일이 없습니다.");
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
        console.log("이미지 업로드 성공");
      };
    });
  };

  const onClearImageFile = () => {
    imageFile.current.value = "";
    setFile(null);
  };

  const handleDoubleCheck = async () => {
    if (!userNickName) {
      alert("닉네임을 입력해주세요.");
      return;
    } else if (userNickName.length < 2) {
      alert("닉네임은 2자리 이상이어야 합니다.");
      return;
    }
    const nickName = await getDocs(
      collection(db, `users`),
      where("nickName", "==", userNickName)
    );
    let nickNameArray = nickName.docs.map((doc) => doc.data().nickName);
    if (!nickNameArray.includes(userNickName)) {
      setNickCheck(true);
      alert("사용 가능한 닉네임입니다.");
    } else {
      alert("이미 사용중인 닉네임입니다.");
    }
  };

  const signUp = async () => {
    setButtonClicked(true);
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(userEmail)) {
      alert("올바른 이메일 형식을 입력해주세요.");
      return;
    }
    try {
      if (!userEmail || !userPassword || !userPasswordCheck || !userNickName) {
        alert("모든 항목을 입력해주세요.");
        return;
      }
      if (userPassword !== userPasswordCheck) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }
      if (userPassword.length < 6) {
        alert("비밀번호는 6자리 이상이어야 합니다.");
        return;
      }

      if (!nickCheck) {
        alert("닉네임 중복확인을 해주세요.");
        return;
      }

      const auth = getAuth();
      const newUser = await createUserWithEmailAndPassword(
        auth,
        userEmail,
        userPassword
      );

      if (file) {
        const storageRef = ref(storage, `users/${newUser.user.uid}`);
        await uploadString(storageRef, file, "data_url");
        imageUrl = await getDownloadURL(
          ref(storage, `users/${newUser.user.uid}`)
        );
      }

      await setDoc(doc(collection(db, "users"), newUser.user.uid), {
        id: newUser.user.uid,
        email: userEmail,
        password: userPassword,
        nickName: userNickName,
        userProfile: imageUrl,
        date: new Date(),
      });

      alert("회원가입이 완료되었습니다.");
      navigate("/login");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("이미 사용중인 이메일입니다.");
        console.error("회원가입 에러코드", error);
      }
    }
  };

  return (
    <div>
      <div className="signup_container">
        <div>
          <h1>
            <span>배추마켓 </span>회원가입
          </h1>
          <div className="sign_images_container">
            {file ? (
              <img
                className="user_image"
                src={file}
                onClick={onClearImageFile}
                alt="유저 이미지"
              />
            ) : (
              <div className="image_container" onClick={handleClick}>
                <FaCamera className="sign_profile" />
                <p>프로필 사진</p>
              </div>
            )}
          </div>
          <div className="signup_input_container">
            <input
              ref={imageFile}
              type="file"
              style={{ display: "none" }}
              onChange={(e) => fileUpload(e)}
            />
            <label htmlFor="email">
              이메일&nbsp;
              {buttonClicked && !userEmail ? <span>*이메일 미입력</span> : null}
            </label>
            <input
              className="login_input input_block"
              type="email"
              id="email"
              value={userEmail}
              placeholder="이메일@example.com"
              onChange={(e) => setUserEmail(e.target.value)}
            />
            <label htmlFor="password">
              비밀번호&nbsp;
              {buttonClicked && !userPassword ? (
                <span>*비밀번호 미입력</span>
              ) : null}
            </label>
            <input
              className="login_input input_block"
              type="password"
              id="password"
              value={userPassword}
              placeholder="비밀번호"
              onChange={(e) => setUserPassword(e.target.value)}
            />
            <label htmlFor="password1">
              비밀번호 확인&nbsp;
              {buttonClicked && !userPasswordCheck ? (
                <span>*비밀번호 미입력</span>
              ) : userPassword !== userPasswordCheck ? (
                <span>*비밀번호 불일치</span>
              ) : null}
            </label>
            <input
              className="login_input input_block"
              type="password"
              id="password1"
              value={userPasswordCheck}
              placeholder="비밀번호 확인"
              onChange={(e) => setUserPasswordCheck(e.target.value)}
            />
            <label htmlFor="nickName">
              닉네임&nbsp;
              {buttonClicked && !userNickName ? (
                <span>*닉네임 미입력</span>
              ) : null}
            </label>
            <div className="nick_name_container">
              <input
                className="login_input input_block"
                type="text"
                id="nickName"
                value={userNickName}
                placeholder="닉네임"
                onChange={(e) => setUserNickName(e.target.value)}
              />
              <button className="double_check" onClick={handleDoubleCheck}>
                중복 확인
              </button>
            </div>
            <br />
          </div>
          <button className="signup_button" onClick={signUp}>
            회원가입
          </button>
          <button className="signup_button" onClick={() => navigate("/login")}>
            돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
