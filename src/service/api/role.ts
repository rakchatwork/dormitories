import { createQueryStringFromObject } from "./../../utils/queryString";
import { apiUrlDormitory, apiVersion } from "./../../config/api";
import { request } from "../../utils/axios-utils";

export const GET_ROLE = async (filter?: object) => {
  const qstr = createQueryStringFromObject(filter);
  try {
    // const res = await request.get(`${apiUrlDormitory}/role?${qstr}`);
    const res = await request.get(`${apiVersion}/role?${qstr}`);
    return res.data;
  } catch (error: any) {
    return error.response;
  }
};
