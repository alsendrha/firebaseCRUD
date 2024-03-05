import { collection, getDocs, orderBy, query } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { userContext } from "../login/UserContext";
import "./ListPage.css";
const ListPage = () => {
  const { userData } = useContext(userContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState([]);

  const getItemsData = async () => {
    const q = query(collection(db, "items"), orderBy("date", "desc"));
    const getData = await getDocs(q);
    console.log(getData.docs.map((doc) => doc.data()));
    if (getData.docs.length === 0) {
      setIsLoading(true);
    } else {
      setItems(getData.docs.map((doc) => doc.data()));
      setIsLoading(false);
    }
  };

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("로그인한 사용자", user);
      } else {
        console.log("로그인하지 않은 사용자");
      }
    })
  }, [])


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
