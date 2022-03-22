import { IQueryStringParcel } from "./../../types/pagination";
import { createQueryStringFromObject } from "../../utils/queryString";
import { request } from "../../utils/axios-utils";
import { apiVersion } from "../../config/api";

export const GET_PARCELS = async (filter?: IQueryStringParcel) => {
  const qstr = createQueryStringFromObject(filter);
  try {
    const res = await request.get(`${apiVersion}/parcel?${qstr}`);
    return res.data;
  } catch (error: any) {
    return error.response;
  }
};

export const GET_PARCELS_BY_ID = async (id: number) => {
  try {
    const res = await request.get(`${apiVersion}/parcel/${id}`);
    return res.data;
  } catch (error: any) {
    return error.response;
  }
};

export const CREATE_PARCEL = async (values: any) => {
  try {
    const res = await request.post(`${apiVersion}/parcel`, values);
    return res.data;
  } catch (error: any) {
    return error.response;
  }
};

export const CREATE_PARCEL_RECEIVE = async (values: any) => {
  try {
    const res = await request.post(`${apiVersion}/parcel/receive`, values);
    return res.data;
  } catch (error: any) {
    return error.response;
  }
};

export const DELETE_PARCELS = async (id: number) => {
  try {
    const res = await request.delete(`${apiVersion}/parcel/${id}`);
    return res.data;
  } catch (error: any) {
    return error.response;
  }
};
