import { IQueryStringRepair } from "./../../types/pagination";

import { createQueryStringFromObject } from "../../utils/queryString";
import { request } from "../../utils/axios-utils";
import { apiVersion } from "../../config/api";

export const GET_REPAIR = async (filter?: IQueryStringRepair) => {
  const qstr = createQueryStringFromObject(filter);
  try {
    const res = await request.get(`${apiVersion}/repair?${qstr}`);
    return res.data;
  } catch (error: any) {
    return error.response;
  }
};

export const CREATE_REPAIR = async (values: any) => {
  try {
    const res = await request.post(`${apiVersion}/repair`, values, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error: any) {
    return error.response;
  }
};

export const GET_REPAIR_BY_ID = async (id: number) => {
  try {
    const res = await request.get(`${apiVersion}/repair/${id}`);
    return res.data;
  } catch (error) {}
};

export const POST_APPROVE_REPAIR = async (values: any) => {
  try {
    const res = await request.post(`${apiVersion}/repair/approve`, values);
    return res.data;
  } catch (error: any) {
    return error.response;
  }
};

export const POST_PROCESSING_REPAIR = async (values: any) => {
  try {
    const res = await request.post(`${apiVersion}/repair/processing`, values);
    return res.data;
  } catch (error: any) {
    return error.response;
  }
};

export const POST_DONE_REPAIR = async (values: any) => {
  try {
    const res = await request.post(`${apiVersion}/repair/done`, values);
    return res.data;
  } catch (error: any) {
    return error.response;
  }
};

export const DELETE_REPAIR = async (id: number) => {
  try {
    const res = await request.delete(`${apiVersion}/repair/${id}`);
    return res.data;
  } catch (error: any) {
    return error.response;
  }
};
