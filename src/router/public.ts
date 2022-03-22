import { lazy } from "react";
import { TRouter } from "./../types/router";

const Login = lazy(() => import("../views/auth/Login"));

const publicRoute: TRouter[] = [
  {
    name: "Login",
    path: "/login",
    ContentComponent: Login,
    exact: true,
  },
];

export default publicRoute;
