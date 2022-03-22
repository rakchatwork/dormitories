import React, { useEffect } from "react";

// Style
import "./../assets/css/main.css";

// Components
import PrivateContent from "./PrivateContent";
import PublicContent from "./PublicContent";

import { useAppDispatch, useAppSelector } from "../store/store";
import { AUTH_VERIFY } from "../service/api/auth";
import authSlice, { signout } from "../store/slices/authSlice";

const Main = () => {
  const { token } = useAppSelector((state) => state.auth);

  return <div>{token ? <PrivateContent /> : <PublicContent />}</div>;
};

export default Main;
