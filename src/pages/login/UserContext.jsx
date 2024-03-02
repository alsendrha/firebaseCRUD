import { createContext, useState } from "react";

export const userContext = createContext();

export function UserProvider(props) {
  const initialUserData = localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData"))
    : null;
  const [userData, setUserData] = useState(initialUserData);
  return <userContext.Provider value={{ userData, setUserData }} {...props} />
} 