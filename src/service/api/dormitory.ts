import { IQueryStringDormotory } from "./../../types/pagination";
import { createQueryStringFromObject } from "../../utils/queryString";
import { request } from "../../utils/axios-utils";
import { apiVersion } from "../../config/api";

// GET(READ)
export const GET_DORMITORY = async (filter?: IQueryStringDormotory) => {
  const qstr = createQueryStringFromObject(filter);
  try {
    const res = await request.get(`${apiVersion}/dormitories?${qstr}`);
    return res.data;
  } catch (error: any) {
    return error.response;
  }
};
// DETAIL
export const GET_DORMITORY_BY_ID = async (id: number) => {
  try {
    const res = await request.get(`${apiVersion}/dormitories/${id}`);
    return res.data;
  } catch (error: any) {
    return error.response;
  }
};
// Delete
export const DELETE_DORMITORY = async (id: number) => {
  try {
    const res = await request.delete(`${apiVersion}/dormitories/${id}`);
    return res.data;
  } catch (error: any) {
    return error.response;
  }
};
// Create
export const CREATE_DORMITORY = async (values: any) => {
  try {
    const res = await request.post(`${apiVersion}/dormitories`, values);
    return res.data;
  } catch (error: any) {
    return error.response;
  }
};

// Update
export const UPDATE_DORMITORY = async (id: number, values: any) => {
  try {
    const res = await request.patch(
      `${apiVersion}/dormitories/${id}`,
      values,
      {}
    );
    return res.data;
  } catch (error: any) {
    return error.response;
  }
};

// Update
export const UPDATE_DORMITORY_WITH_FORMDATA = async (
  id: number,
  values: any
) => {
  try {
    const res = await request.patch(`${apiVersion}/dormitories/${id}`, values, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error: any) {
    return error.response;
  }
};
