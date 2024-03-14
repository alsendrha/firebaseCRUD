import { collection, getDocs, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import "./SearchPage.css";

const SearchPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const searchValue = useLocation().state.searchValue.trim();
  async function getItemsData() {
    const q = query(collection(db, "items"), orderBy("date", "desc"));
    const getData = await getDocs(q);
    if (getData.docs.length === 0) {
      setIsLoading(true);
    } else {
      setItems(getData.docs.map((doc) => doc.data()));
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getItemsData();
  }, [searchValue]);
  if (isLoading) {
    return (
      <div className="no_search">
        <div>로딩중...</div>
      </div>
    );
  }
  return (
    <div className="list_item_container">
      {items.filter((item) => item.title.includes(searchValue)).length > 0 &&
      searchValue !== "" ? (
        items
          .filter((item) => item.title.includes(searchValue))
          .map((item) => (
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
      ) : (
        <div className="no_search">
          <div>검색결과가 없습니다.</div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
