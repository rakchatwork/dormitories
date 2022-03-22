import { IQueryStringManagerDormotory } from "./../../types/pagination";
import { createQueryStringFromObject } from "../../utils/queryString";
import { request } from "../../utils/axios-utils";
import { apiVersion } from "../../config/api";

// GET(READ)
export const GET_USER = async (filter?: IQueryStringManagerDormotory) => {
  const qstr = createQueryStringFromObject(filter);
  try {
    const res = await request.get(`${apiVersion}/user?${qstr}`);
    return res.data;
  } catch (error: any) {
    return error.response;
  }
};
// DETAIL ROOM
export const GET_USER_BY_ID_ROOM = async (id: number, values: any) => {
  const qstr = createQueryStringFromObject(values);
  try {
    const res = await request.get(`${apiVersion}/user/${id}?${qstr}`);
    return res.data;
  } catch (error: any) {
    return error.response;
  }
};
// DETAIL
export const GET_USER_BY_ID = async (id: number) => {
  try {
    const res = await request.get(`${apiVersion}/user/${id}`);
    return res.data;
  } catch (error: any) {
    return error.response;
  }
};
// POST(Creat or Add)
export const CREATE_USER = async (values: any) => {
  try {
    const res = await request.post(`${apiVersion}/user`, values);
    return res.data;
  } catch (error: any) {
    return error.response;
  }
};
// UPDATE(Creat or Add)
export const UPDATE_USER = async (id: number, values: any) => {
  try {
    const res = await request.patch(`${apiVersion}/user/${id}`, values);
    return res.data;
  } catch (error: any) {
    return error.response;
  }
};
// DELETE(Delete)
export const DELETE_USER = async (id: number) => {
  try {
    const res = await request.delete(`${apiVersion}/user/${id}`);
    return res.data;
  } catch (error: any) {
    return error.response;
  }
};
