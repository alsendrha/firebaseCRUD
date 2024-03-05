import { createContext, useState } from "react";

export const pageContext = createContext();

export function PageProvider(props) {
  const [pageData, setPageData] = useState();
  return <pageContext.Provider value={{ pageData, setPageData }} {...props} />;
}
