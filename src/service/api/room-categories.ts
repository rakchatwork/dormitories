import { apiVersion } from "../../config/api";
import { request } from "../../utils/axios-utils";
import { createQueryStringFromObject } from "../../utils/queryString";
import { IQueryStringRoomCategory } from "./../../types/pagination";

// GET LIST
export const GET_ROOM_CATEGORIES = async (
  filter?: IQueryStringRoomCategory
) => {
  const qstr = createQueryStringFromObject(filter);
  try {
    const res = await request.get(`${apiVersion}/room-category?${qstr}`); // qstr = query string
    return res.data;
  } catch (error: any) {
    return error.response;
  }
};
// GET BY ID(DETAIL)
export const GET_ROOM_CATEFORIES_BY_ID = async (id: number) => {
  try {
    const res = await request.get(`${apiVersion}/room-category/${id}`); // id = parameter
    return res.data;
  } catch (error: any) {
    return error.response;
  }
};
// POST(Creat)
export const CREATE_ROOM_CATEGORIES = async (values: any) => {
  try {
    const res = await request.post(`${apiVersion}/room-category`, values); // values = ?object
    return res.data;
  } catch (error: any) {
    return error.response;
  }
};
// DELETE
export const DELETE_ROOM_CATEGORIES = async (id: number) => {
  try {
    const res = await request.delete(`${apiVersion}/room-category/${id}`); // id = parameter
    return res.data;
  } catch (error: any) {
    return error.response;
  }
};
// UPDATE(EDIT)
export const UPDATE_ROOM_CATEGORIES = async (id: number, values: any) => {
  try {
    const res = await request.patch(
      `${apiVersion}/room-category/${id}`,
      values
    ); // id = parameter, values = ?object
    return res.data;
  } catch (error: any) {
    return error.response;
  }
};
