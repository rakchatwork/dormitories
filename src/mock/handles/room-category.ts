import { rest } from "msw";
import { queryStringToObject } from "../../utils/queryString";

const roomCategories = [
  {
    id: 1,
    categoryName: "Class A",
    price: 1000,
    details: "up to you",
  },
  {
    id: 2,
    categoryName: "Class A",
    price: 1000,
    details: "up to you",
  },
  {
    id: 3,
    categoryName: "Class A",
    price: 1000,
    details: "up to you",
  },
  {
    id: 4,
    categoryName: "Class A",
    price: 1000,
    details: "up to you",
  },
  {
    id: 5,
    categoryName: "Class A",
    price: 1000,
    details: "up to you",
  },
  {
    id: 6,
    categoryName: "Class A",
    price: 1000,
    details: "up to you",
  },
  {
    id: 7,
    categoryName: "Class A",
    price: 1000,
    details: "up to you",
  },
  {
    id: 8,
    categoryName: "Class A",
    price: 1000,
    details: "up to you",
  },
  {
    id: 9,
    categoryName: "Class A",
    price: 1000,
    details: "up to you",
  },
  {
    id: 10,
    categoryName: "Class A",
    price: 1000,
    details: "up to you",
  },
  {
    id: 11,
    categoryName: "Class A",
    price: 1000,
    details: "up to you",
  },
  {
    id: 12,
    categoryName: "Class A",
    price: 1000,
    details: "up to you",
  },
  {
    id: 13,
    categoryName: "Class A",
    price: 1000,
    details: "up to you",
  },
];

const roomCategoryHandlers = [
  rest.get("/room-categories", (req, res, ctx) => {
    const qstr = queryStringToObject(req.url.search) as any;

    if (qstr.getAll && qstr.getAll.trim().toLowerCase() === "true") {
      return res(
        ctx.status(200),
        ctx.json({
          status: 200,
          results: roomCategories,
        })
      );
    }

    const { page, limit } = qstr;
    const offsetStart = page * limit - limit;
    const offsetEnd = limit * page;
    const tempRoomCategories = roomCategories;
    const total = roomCategories.length;
    const item = tempRoomCategories.slice(offsetStart, offsetEnd);
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
  // rest.post("/room-categories", (req, res, ctx) => {
  //   return res(ctx.status(200));
  // }),
  // rest.get("/room-categories/:id", (req, res, ctx) => {
  //   return res(ctx.status(200));
  // }),
  // rest.patch("/room-categories/:id", (req, res, ctx) => {
  //   return res(ctx.status(200));
  // }),
  // rest.delete("/room-categories:/id", (req, res, ctx) => {
  //   return res(ctx.status(200));
  // }),
];

export default roomCategoryHandlers;
