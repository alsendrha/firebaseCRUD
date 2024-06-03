import imageCompression from "browser-image-compression";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
  const [onChanged, setOnChanged] = useState(false);
  const [oldNickName, setOldNickName] = useState("");
  const params = useParams();
  const getUserData = useLocation();
  let imageUrl = null;

  const getUser = async () => {
    if (!getUserData.state) return;
    const userData = await getDoc(doc(db, "users", getUserData.state.user.id));
    console.log("이건 유저데이터", userData.data());
    setUserEmail(userData.data().email);
    setUserNickName(userData.data().nickName);
    setOldNickName(userData.data().nickName);
    setFile(userData.data().userProfile);
  };

  useEffect(() => {
    if (params.userId === "2") {
      getUser();
    }
  }, []);

  if (params.userId === "2" && !getUserData.state) return;
  const handleClick = () => {
    if (params.userId === "2") {
      if (!onChanged) return;
    }
    imageFile.current.click();
  };

  const fileUpload = async (e) => {
    console.log("파일 업로드 시작");
    const file = e.target.files[0];

    const options = {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    if (!file) return;
    const compressedFile = await imageCompression(file, options);
    // Blob 객체인지 확인
    if (!(compressedFile instanceof Blob)) {
      console.error("파일이 유효하지 않습니다.");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(compressedFile);
    return new Promise((resolve) => {
      reader.onload = () => {
        setFile(reader.result);
        resolve();
        console.log("이미지 업로드 성공");
      };
    });
  };

  const onClearImageFile = () => {
    if (!onChanged) return;
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
  console.log("aaas", getUserData.state.user.id);
  const userUpdate = async () => {
    console.log(nickCheck);
    if (!userNickName) {
      alert("닉네임을 입력해주세요.");
      return;
    } else if (userNickName.length < 2) {
      alert("닉네임은 2자리 이상이어야 합니다.");
      return;
    } else if (oldNickName !== userNickName && !nickCheck) {
      alert("닉네임 중복확인을 해주세요.");
      return;
    }
    try {
      const validDataUrlRegex =
        /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+)?(?:;base64)?,(.*)$/;
      let newUserUrl = null;
      if (validDataUrlRegex.test(file)) {
        if (file) {
          const storageRef = ref(storage, `users/${getUserData.state.user.id}`);
          await uploadString(storageRef, file, "data_url");
          newUserUrl = await getDownloadURL(
            ref(storage, `users/${getUserData.state.user.id}`)
          );
        }
      }
      const updateData = {
        // password: userPassword,
      };
      if (
        newUserUrl !== null &&
        newUserUrl !== "" &&
        newUserUrl !== undefined
      ) {
        updateData.userProfile = newUserUrl;
      }
      if (oldNickName !== userNickName) {
        updateData.nickName = userNickName;
      }

      const response = query(
        collection(db, "items"),
        where("user", "==", getUserData.state.user.id)
      );

      if (oldNickName !== userNickName) {
        const postUserNick = await getDocs(response);
        postUserNick.forEach(async (doc) => {
          await updateDoc(doc.ref, {
            userNickName: userNickName,
          });
        });
      }

      await updateDoc(doc(db, "users", getUserData.state.user.id), updateData);

      window.location.reload();
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div>
      <div className="signup_container">
        <div>
          <h1>
            <span>배추마켓 </span>
            {params.userId === "1" ? "회원가입" : "회원정보"}
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
              disabled={params.userId === "2" ? true : false}
              placeholder="이메일@example.com"
              onChange={(e) => setUserEmail(e.target.value)}
            />
            {params.userId === "1" && (
              <div>
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
              </div>
            )}
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
                disabled={params.userId === "1" || onChanged ? false : true}
                placeholder="닉네임"
                onChange={(e) => setUserNickName(e.target.value)}
              />
              {params.userId === "1" || onChanged ? (
                <button className="double_check" onClick={handleDoubleCheck}>
                  중복 확인
                </button>
              ) : null}
            </div>
            <br />
          </div>
          {params.userId === "1" || onChanged ? (
            <div>
              <button
                className="signup_button"
                onClick={params.userId === "1" ? signUp : userUpdate}
              >
                {params.userId === "1" ? "회원가입" : "수정하기"}
              </button>
              <button
                className="signup_button"
                onClick={() =>
                  navigate(params.userId === "1" ? "/login" : "/my_page")
                }
              >
                돌아가기
              </button>
            </div>
          ) : (
            <button
              className="signup_button"
              onClick={() => setOnChanged(true)}
            >
              수정하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
