import { collection, getDocs, orderBy, query } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { userContext } from "../login/UserContext";
import "./ListPage.css";
const ListPage = () => {
  const { userData } = useContext(userContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState([]);

  async function getItemsData() {
    const q = query(collection(db, "items"), orderBy("date", "desc"));
    const getData = await getDocs(q);
    console.log(getData.docs.map((doc) => doc.data()));
    if (getData.docs.length === 0) {
      setIsLoading(true);
    } else {
      setItems(getData.docs.map((doc) => doc.data()));

      setIsLoading(false);
    }
  }

  const loginCheck = () => {
    if (!userData) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    } else {
      navigate("/insert/1");
    }
  };

  useEffect(() => {
    getItemsData();
  }, []);

  return (
    <div>
      <div className="main_list_banner">
        <div className="main_list_banner_content">
          <div className="banner_title_container">
            <p className="banner_main_title">믿을만한</p>
            <p className="banner_main_title"> 이웃 간 중고거래</p>
            <p className="banner_sub_title">주민들과 가깝고 따뜻한 거래를</p>
            <p className="banner_sub_title">지금 경험해보세요.</p>
          </div>
          <img
            className="banner_image"
            src="/images/banner_image.png"
            alt="배너 이미지"
          />
        </div>
      </div>
      <div className="list_item_container">
        {isLoading ? (
          <div className="no-items-message">등록된 상품이 없어요!.</div>
        ) : (
          items.map((item) => (
            <div
              className="list_item"
              key={item.id}
              onClick={() => navigate("/detail", { state: item })}
            >
              <div className="list_image_container">
                <img
                  src={item.imageUrl ? item.imageUrl : "/images/no_image.png"}
                  alt="이미지"
                />
              </div>
              <div className="list_text_container">
                <p className="list_item_title">{item.title}</p>
                <p className="list_item_price">
                  {Number(item.price).toLocaleString()}원
                </p>
                <p className="list_item_address">{item.address}</p>
              </div>
            </div>
          ))
        )}
      </div>
      <button className="list_insert_button" onClick={loginCheck}>
        글쓰기
      </button>
    </div>
  );
};

export default ListPage;
