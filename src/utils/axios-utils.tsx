import { apiUrlDormitory } from "../config/api";
import axios from "axios";
import { userToken } from "./token";

export const request = axios.create({
  baseURL: apiUrlDormitory,
  headers: {
    Authorization: `Bearer ${userToken}`,
  },
});
