import { apiUrlDormitory } from "./../../config/api";
import { request } from "../../utils/axios-utils";

export const LOGIN = async (values: { username: string; password: string }) => {
  try {
    const res = await request.post("/auth/login", values);
    return res.data;
  } catch (error: any) {
    return error.response;
  }
};

export const AUTH_VERIFY = async (token: String) => {
  try {
    const res = await fetch(`${apiUrlDormitory}/auth/verify`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();
    return json;
  } catch (error: any) {
    console.log(error);
    return {
      status: null,
      message: "Fecth Error",
    };
  }
};
