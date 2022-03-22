import { apiVersion } from "../../config/api";
import { request } from "../../utils/axios-utils";

// POST(Creat)
export const CREATE_USER_DORMITORY = async (values: any) => {
  try {
    /*
      "user": 1,
      "dormitory": 1
    */
    const res = await request.post(`${apiVersion}/user-dormitory`, values); // values = ?object

    return res.data;
  } catch (error: any) {
    return error.response;
  }
};

// DELETE
export const DELETE_USER_DORMITORY = async (id: number) => {
  try {
    const res = await request.delete(`${apiVersion}/user-dormitory/${id}`);
    return res.data;
  } catch (error: any) {
    return error.response;
  }
};
