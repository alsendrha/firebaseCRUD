import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React, { useContext, useEffect, useRef, useState } from "react";

import imageCompression from "browser-image-compression";
import { FaCamera } from "react-icons/fa";
import { GoChevronRight } from "react-icons/go";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import uuid from "react-uuid";
import styled from "styled-components";
import InsertModal from "../../components/InsertModal";
import { db, storage } from "../../firebase";
import { pageContext } from "./InsertContext";

import { userContext } from "../login/UserContext";
import "./ListInsertPage.css";
const ListInsertPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [price, setPrice] = useState(0);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSelect, setIsSelect] = useState(1);
  const [isModal, setIsModal] = useState(false);
  const [position, setPosition] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(userContext);
  const params = useParams();
  const itemId = useLocation();
  const fileInput = useRef(null);
  const [getAddress, setGetAddress] = useState("거래장소");

  let imageUrl = null;
  const { setPageData } = useContext(pageContext);

  const getItem = async () => {
    if (!itemId.state) return null;
    const docRef = doc(db, "items", itemId.state.id);
    const item = (await getDoc(docRef)).data();

    if (params.itemId === "2") {
      setTitle(item.title);
      setContent(item.content);
      setFile(item.imageUrl);
      setIsSelect(item.trade === "판매하기" ? 1 : 2);
      setPrice(item.price);
      setPosition({ lat: item.lat, lng: item.lng });
      setGetAddress(item.address);
    } else {
      return null;
    }
  };

  const handleClick = (e) => {
    fileInput.current.click();
  };

  const fileUpload = async (e) => {
    const file = e.target.files[0];
    const options = {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    if (!file) {
      return;
    }

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
      };
    });
  };

  const onClearAttachment = (e) => {
    fileInput.current.value = "";
    setFile(null);
  };

  useEffect(() => {
    setPageData(params.itemId);
    if (params.itemId === "2") {
      getItem();
    }
  }, []);

  const itemInsert = async () => {
    const id = uuid().replace(/-/g, "").substring(0, 8);
    if (!file) {
      alert("이미지를 업로드해주세요.");
      return;
    }

    if (title === "" || content === "") {
      alert("제목과 내용을 입력해주세요.");
      return;
    }
    if (isSelect !== 2) {
      if (price === undefined || price === "" || price === null) {
        alert("가격을 입력해주세요.");
        return;
      }
    }
    if (getAddress === "거래장소") {
      alert("거래장소를 선택해주세요.");
      return;
    }
    if (position.length === 0) {
      alert("거래장소를 선택해주세요.");
      return;
    }

    setIsLoading(true);
    if (file) {
      const storageRef = ref(storage, `images/${id}`);
      await uploadString(storageRef, file, "data_url");
      imageUrl = await getDownloadURL(ref(storage, `images/${id}`));
    }

    await setDoc(doc(collection(db, "items"), id), {
      id: id,
      user: user.id,
      userNickName: user.nickName,
      userProfile: user.userProfile,
      imageUrl: imageUrl,
      title: title,
      content: content,
      trade: isSelect === 1 ? "판매하기" : "나눔하기",
      price: isSelect === 2 ? price === 0 : price,
      lat: position.lat,
      lng: position.lng,
      address: getAddress,
      date: new Date(),
    });
    setIsLoading(false);
    setPageData(null);
    navigate("/");
  };

  const itemUpdate = async () => {
    if (!itemId) return null;
    try {
      if (title === "" || content === "") {
        alert("제목과 내용을 입력해주세요.");
        return;
      }

      if (!itemId.state.id) return;
      const validDataUrlRegex =
        /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+)?(?:;base64)?,(.*)$/;
      let newImageUrl = null;
      setIsLoading(true);
      if (validDataUrlRegex.test(file)) {
        if (file) {
          const storageRef = ref(storage, `images/${itemId.state.id}`);
          await uploadString(storageRef, file, "data_url");
          newImageUrl = await getDownloadURL(
            ref(storage, `images/${itemId.state.id}`)
          );
        }
      }
      const updateData = {
        userNickName: user.nickName,
        userProfile: user.userProfile,
        title: title,
        content: content,
        trade: isSelect === 1 ? "판매하기" : "나눔하기",
        price: isSelect === 2 ? price === 0 : price,
        lat: position.lat,
        lng: position.lng,
        address: getAddress,
      };
      if (
        newImageUrl !== null &&
        newImageUrl !== "" &&
        newImageUrl !== undefined
      ) {
        updateData.imageUrl = newImageUrl;
      }

      await updateDoc(doc(db, "items", itemId.state.id), updateData);
      setIsLoading(false);
      setPageData(null);
      navigate("/");
    } catch (error) {
      console.log("error", error);
    }
  };

  if (params.itemId === "2") {
    if (!itemId.state) return null;
  }
  return (
    <div className="list_insert_main_container">
      {isLoading ? (
        <div>로딩중...</div>
      ) : (
        <div>
          <input
            ref={fileInput}
            style={{ display: "none" }}
            type="file"
            onChange={fileUpload}
          />
          <div>
            {file ? (
              <img
                className="insert_image"
                onClick={onClearAttachment}
                src={file}
                alt="이미지"
              />
            ) : (
              <div className="insert_no_image_click" onClick={handleClick}>
                <FaCamera className="image_icon" />
                <div>
                  <p>Click Here</p>
                </div>
              </div>
            )}
            <label htmlFor="title">제목</label>
            <input
              className="insert_title_input"
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력해주세요."
            />
            <label>거래 방식</label>
            <div className="trade">
              <TradeButton
                onClick={() => setIsSelect(1)}
                style={{
                  backgroundColor: isSelect === 1 ? "rgba(0, 0, 0, 0.7)" : null,
                  color: isSelect === 1 ? "white" : null,
                }}
              >
                판매하기
              </TradeButton>
              <TradeButton
                onClick={() => setIsSelect(2)}
                style={{
                  backgroundColor: isSelect === 2 ? "rgba(0, 0, 0, 0.7)" : null,
                  color: isSelect === 2 ? "white" : null,
                }}
              >
                나눔하기
              </TradeButton>
            </div>
            <input
              className="insert_title_input"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="가격을 입력해주세요."
              disabled={isSelect === 2}
            />
            <label htmlFor="content">자세한 설명</label>
            <textarea
              className="insert_content_input"
              type="text"
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`${isSelect === 1 ? "판매" : "나눔"
                }할 물품에 대한 내용을 작성해 주세요.\n(${isSelect === 1 ? "판매" : "나눔"
                } 금지 물품은 게시가 제한될 수 있어요.)\n\n신뢰할 수 있는 거래를 위해 자세히 적어주세요.`}
            />
          </div>
          <label>거래 희망 장소</label>
          <div id="trade_location" onClick={() => setIsModal(true)}>
            <div>{getAddress}</div>
            <GoChevronRight className="location_icon" />
          </div>
          {isModal && (
            <InsertModal
              setIsModal={setIsModal}
              setPosition={setPosition}
              setGetAddress={setGetAddress}
            />
          )}

          <button
            className="insert_button"
            onClick={params.itemId === "2" ? itemUpdate : itemInsert}
          >
            {params.itemId === "1" ? "작성 완료" : "수정 완료"}
          </button>
        </div>
      )}
    </div>
  );
};

const TradeButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  width: 85px;
  height: 35px;
  border: 0.5px solid rgba(0, 0, 0, 0.5);
  border-radius: 40px;
  cursor: pointer;
`;

export default ListInsertPage;
