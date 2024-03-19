import { useLocation, useNavigate } from "react-router-dom";

const MyItem = () => {
  const myItemData = useLocation().state;
  const navigate = useNavigate();

  if (!myItemData) return;
  return (
    <div className="list_item_container">
      {myItemData.userPostCount.map((item) => (
        <div
          className="list_item"
          key={item.id}
          onClick={() => navigate(`/detail/${item.id}`)}
        >
          <div className="list_image_container">
            <img src={item.imageUrl} alt="이미지" />
          </div>
          <div className="list_text_container">
            <p className="list_item_title">{item.title}</p>
            <p className="list_item_price">
              {Number(item.price).toLocaleString()}원
            </p>
            <p className="list_item_address">{item.address}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyItem;
