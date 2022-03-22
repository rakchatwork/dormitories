import { apiVersion } from "../../config/api";
import { request } from "../../utils/axios-utils";
import { createQueryStringFromObject } from "../../utils/queryString";
import { IQueryStringRoom } from "./../../types/pagination";

// GET LIST
export const GET_ROOM = async (filter?: IQueryStringRoom) => {
  const qstr = createQueryStringFromObject(filter);
  try {
    const res = await request.get(`${apiVersion}/room?${qstr}`); // qstr = query string
    return res.data;
  } catch (error: any) {
    return error.response;
  }
};
// GET BY ID(DETAIL)
export const GET_ROOM_BY_ID = async (id: number) => {
  try {
    const res = await request.get(`${apiVersion}/room/${id}`); // id = parameter
    return res.data;
  } catch (error: any) {
    return error.response;
  }
};
// POST(Creat)
export const CREATE_ROOM = async (values: any) => {
  try {
    const res = await request.post(`${apiVersion}/room`, values); // values = ?object
    return res.data;
  } catch (error: any) {
    return error.response;
  }
};
// DELETE
export const DELETE_ROOM = async (id: number) => {
  try {
    const res = await request.delete(`${apiVersion}/room/${id}`); // id = parameter
    return res.data;
  } catch (error: any) {
    return error.response;
  }
};
// UPDATE(EDIT)
export const UPDATE_ROOM = async (id: number, values: any) => {
  try {
    const res = await request.patch(`${apiVersion}/room/${id}`, values); // id = parameter, values = ?object
    return res.data;
  } catch (error: any) {
    return error.response;
  }
};
