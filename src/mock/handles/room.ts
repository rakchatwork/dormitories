import { rest } from "msw";
import { queryStringToObject } from "../../utils/queryString";

const rooms = [
  {
    id: 1,
    roomNumber: "1010",
    categoryName: "Class A",
    renterName: "John",
    status: true,
  },
  {
    id: 2,
    roomNumber: "1010",
    categoryName: "Class A",
    renterName: null,
    status: false,
  },
  {
    id: 3,
    roomNumber: "1010",
    categoryName: "Class A",
    renterName: null,
    status: false,
  },
  {
    id: 4,
    roomNumber: "1010",
    categoryName: "Class A",
    renterName: "John",
    status: true,
  },
  {
    id: 5,
    roomNumber: "1010",
    categoryName: "Class A",
    renterName: null,
    status: false,
  },
  {
    id: 6,
    roomNumber: "1010",
    categoryName: "Class A",
    renterName: null,
    status: false,
  },
  {
    id: 7,
    roomNumber: "1010",
    categoryName: "Class A",
    renterName: null,
    status: false,
  },
  {
    id: 8,
    roomNumber: "1010",
    categoryName: "Class A",
    renterName: null,
    status: false,
  },
  {
    id: 9,
    roomNumber: "1010",
    categoryName: "Class A",
    renterName: null,
    status: false,
  },
  {
    id: 10,
    roomNumber: "1010",
    categoryName: "Class A",
    renterName: null,
    status: false,
  },
  {
    id: 11,
    roomNumber: "1010",
    categoryName: "Class A",
    renterName: null,
    status: false,
  },
  {
    id: 12,
    roomNumber: "1010",
    categoryName: "Class A",
    renterName: null,
    status: false,
  },
];

const roomHandlers = [
  rest.get("/room", (req, res, ctx) => {
    const qstr = queryStringToObject(req.url.search) as any;
    const { page, limit } = qstr;
    const offsetStart = page * limit - limit;
    const offsetEnd = limit * page;
    const tempRooms = rooms;
    const total = rooms.length;
    const item = tempRooms.slice(offsetStart, offsetEnd);
    return res(
      ctx.status(200),
      ctx.json({
        status: 200,
        results: {
          item,
          total,
          page: Number(page),
        },
      })
    );
  }),
  // rest.post("/room", (req, res, ctx) => {
  //   return res(ctx.status(200));
  // }),
  // rest.get("/room/:id", (req, res, ctx) => {
  //   return res(ctx.status(200));
  // }),
  // rest.patch("/room/:id", (req, res, ctx) => {
  //   return res(ctx.status(200));
  // }),
  // rest.delete("/room:/id", (req, res, ctx) => {
  //   return res(ctx.status(200));
  // }),
];

export default roomHandlers;
