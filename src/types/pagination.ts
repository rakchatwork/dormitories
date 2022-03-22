import { STATUS_REPAIR } from "./../enums/repair";
export type TPagination = {
  limit?: number;
  total?: number;
  page?: number;
  order?: string;
  getAll?: boolean;
  role?: String;
  dormitoryId?: number;
};

export interface IQueryStringManagerDormotory extends TPagination {
  search?: string;
}

export interface IQueryStringDormotory extends TPagination {
  name?: string;
}

export interface IQueryStringParcel extends TPagination {
  status?: boolean;
  date?: string;
  passCode?: string;
  room?: number;
}

export interface IQueryStringRoom extends TPagination {
  status?: boolean;
  roomCategory?: string;
  roomNumber?: string;
}

export interface IQueryStringRoomCategory extends TPagination {
  categoryName?: string;
}

export interface IQueryStringRepair extends TPagination {
  createdAt?: string;
  convenientDate?: string;
  status?: STATUS_REPAIR;
  roomNumber?: string;
}

export type TFilterPagination = {
  limit?: number;
  page?: number;
  total?: number;
};

export const paginationDefult: TFilterPagination = {
  limit: 10,
  page: 1,
  total: 0,
};
