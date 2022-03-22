import { rest } from "msw";
import { queryStringToObject } from "../../utils/queryString";

type TMailParcel = {
  id: number;
  numberRoom: string;
  createdAt: Date;
  receiveStatus: boolean;
};

const parcels: TMailParcel[] = [
  {
    id: 1,
    numberRoom: "B0001",
    createdAt: new Date("2022-01-01"),
    receiveStatus: false,
  },
  {
    id: 2,
    numberRoom: "B0002",
    createdAt: new Date("2022-01-02"),
    receiveStatus: false,
  },
  {
    id: 3,
    numberRoom: "B0003",
    createdAt: new Date("2022-01-03"),
    receiveStatus: false,
  },
  {
    id: 4,
    numberRoom: "B0004",
    createdAt: new Date("2022-01-04"),
    receiveStatus: true,
  },
  {
    id: 5,
    numberRoom: "B0005",
    createdAt: new Date("2022-01-05"),
    receiveStatus: true,
  },
  {
    id: 6,
    numberRoom: "B0006",
    createdAt: new Date("2022-01-06"),
    receiveStatus: false,
  },
  {
    id: 7,
    numberRoom: "B0007",
    createdAt: new Date("2022-01-07"),
    receiveStatus: true,
  },
  {
    id: 8,
    numberRoom: "B0008",
    createdAt: new Date("2022-01-08"),
    receiveStatus: true,
  },
  {
    id: 9,
    numberRoom: "B0009",
    createdAt: new Date("2022-01-09"),
    receiveStatus: true,
  },
  {
    id: 10,
    numberRoom: "B0010",
    createdAt: new Date("2022-01-10"),
    receiveStatus: false,
  },
];

const repairHanlders = [
  rest.get("/repair", (req, res, ctx) => {
    const qstr = queryStringToObject(req.url.search) as {
      page: number;
      limit: number;
    };
    const { page, limit } = qstr;
    const offsetStart = page * limit - limit;
    const offsetEnd = limit * page;
    const tempParcels = parcels;
    const item = tempParcels.slice(offsetStart, offsetEnd);
    const total = parcels.length;
    return res(
      ctx.status(200),
      ctx.json({
        status: 200,
        message: "success",
        results: {
          item,
          total,
          page: Number(page),
        },
      })
    );
  }),
];

export default repairHanlders;
