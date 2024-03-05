import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { PageProvider } from "./pages/list/InsertContext";
import { UserProvider } from "./pages/login/UserContext";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <PageProvider>
    <UserProvider>
      <App />
    </UserProvider>
  </PageProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
