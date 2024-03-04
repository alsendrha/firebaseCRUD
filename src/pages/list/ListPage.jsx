import { collection, query, orderBy, getDocs } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { userContext } from "../login/UserContext";
import "./ListPage.css";
const ListPage = () => {
  const { userData } = useContext(userContext);
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  let noData;

  const getItemsData = async () => {
    const q = query(collection(db, "items"), orderBy("date", "desc"));
    const getData = await getDocs(q);
    console.log(getData.docs.map((doc) => doc.data()));
    if (getData.docs.length === 0) {
      return (noData = <p>데이터가 없습니다.</p>);
    }
    setItems(getData.docs.map((doc) => doc.data()));
  };

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
        {noData
          ? noData
          : items.map((item) => (
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
                <h4 className="list_item_title">{item.title}</h4>
              </div>
            ))}
      </div>
      <button className="list_insert_button" onClick={loginCheck}>
        글쓰기
      </button>
    </div>
  );
};

export default ListPage;
