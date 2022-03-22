import { apiVersion } from "../../config/api";
import { request } from "../../utils/axios-utils";

// POST(Creat)
export const CREATE_USER_ROOM = async (values: any) => {
  try {
    const res = await request.post(`${apiVersion}/user-room`, values); // values = ?object
    return res.data;
  } catch (error: any) {
    return error.response;
  }
};

// DELETE(Delete)
export const DELETE_USER_ROOM = async (id: number) => {
  try {
    const res = await request.delete(`${apiVersion}/user-room/${id}`);
    return res.data;
  } catch (error: any) {
    return error.response;
  }
};
