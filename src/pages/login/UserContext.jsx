import { doc, getDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../../firebase";

export const userContext = createContext();

export function UserProvider(props) {
  const initialUserData = localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData"))
    : null;
  const [userData, setUserData] = useState(initialUserData);
  const [user, setUser] = useState();
  const [loginUser, setLoginUser] = useState("");

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        setLoginUser(user.uid);
      } else {
        console.log("로그인하지 않은 사용자");
      }
    });
  }, []);

  useEffect(() => {
    if (!loginUser) return;
    if (userData === null) return;
    const fetchData = async () => {
      const getData = await getDoc(doc(db, "users", loginUser));
      console.log("여기 유저 정보 : ", getData.data());
      setUser(getData.data());
    };
    fetchData();
  }, [loginUser, userData]);

  return (
    <userContext.Provider value={{ userData, setUserData, user }} {...props} />
  );
}
