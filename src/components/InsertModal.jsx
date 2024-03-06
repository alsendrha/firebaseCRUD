import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useRef, useState } from "react";
import { VscClose } from "react-icons/vsc";
import useOnclickOutside from "../pages/list/hooks/useOnclickOutside";
import "./InsertModal.css";
const center = { lat: 37.541, lng: 126.986 };

const InsertModal = ({ setIsModal, setPosition, setGetAddress }) => {
  const ref = useRef(null);
  useOnclickOutside(ref, () => {
    setIsModal(false);
  });
  const [markerPosition, setMarkerPosition] = useState(null);
  const geocoder = new window.kakao.maps.services.Geocoder();

  const handleMapClick = (e) => {
    setMarkerPosition({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
    geocoder.coord2Address(e.latLng.lng(), e.latLng.lat(), (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setGetAddress(result[0].address.address_name);
      } else {
        console.log("주소를 가져오지 못했습니다.");
      }
    });
  };

  const handleSelected = () => {
    setPosition(markerPosition);
    setIsModal(false);
  };
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.GOOGLE_API_KEY,
  });

  return (
    <div className="presentation">
      <div className="wrapper_modal">
        <div className="modal" ref={ref}>
          <div className="modal_content">
            <div>
              <div>
                <VscClose
                  className="modal_close"
                  onClick={() => setIsModal(false)}
                />
              </div>
              <h2 className="modal_title" style={{ whiteSpace: "pre-line" }}>
                <p>{"이웃과 만나서\n 거래하고 싶은 장소를 선택해주세요."}</p>
              </h2>
              <p className="modal_sub_title">
                만나서 거래할 때는 누구나 찾기 쉬운 공공장소가 좋아요.
              </p>
            </div>
          </div>
          <div>
            {!isLoaded ? (
              <div>Map을 불러오는 중입니다. 잠시만 기다려주세요.</div>
            ) : (
              <div className="google_map_container">
                <GoogleMap
                  center={center}
                  zoom={13}
                  mapContainerStyle={{ width: "700px", height: "600px" }}
                  options={{
                    zoomControl: false,
                    scrollwheel: true,
                  }}
                  onClick={handleMapClick}
                >
                  {markerPosition && (
                    <Marker
                      icon={{
                        url: "/images/marker.png",
                        scaledSize: new window.google.maps.Size(50, 65),
                      }}
                      position={{
                        lat: markerPosition.lat,
                        lng: markerPosition.lng,
                      }}
                    />
                  )}
                </GoogleMap>
                <div
                  className="google_map_select_button button_position"
                  onClick={handleSelected}
                >
                  <p>선택 완료</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsertModal;
