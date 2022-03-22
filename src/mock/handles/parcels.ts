import { rest } from "msw";
import { queryStringToObject } from "../../utils/queryString";

type TMailParcel = {
  id: number;
  passCode: string;
  createdAt: Date;
  receiveStatus: boolean;
  parcelCode: string[];
  room: string;
};

const parcels: TMailParcel[] = [
  {
    id: 1,
    passCode: "10000001",
    room: "U101",
    createdAt: new Date("2022-01-01"),
    receiveStatus: false,
    parcelCode: ["ASDSADASD"],
  },
  {
    id: 2,
    passCode: "10000002",
    room: "U102",
    createdAt: new Date("2022-01-02"),
    receiveStatus: false,
    parcelCode: ["ASDSADASD"],
  },
  {
    id: 3,
    passCode: "10000003",
    room: "U103",
    createdAt: new Date("2022-01-03"),
    receiveStatus: true,
    parcelCode: ["ASDSADASD"],
  },
  {
    id: 4,
    passCode: "10000002",
    room: "U102",
    createdAt: new Date("2022-01-02"),
    receiveStatus: false,
    parcelCode: ["ASDSADASD"],
  },
  {
    id: 5,
    passCode: "10000003",
    room: "U103",
    createdAt: new Date("2022-01-03"),
    receiveStatus: true,
    parcelCode: ["ASDSADASD"],
  },

  {
    id: 6,
    passCode: "10000002",
    room: "U102",
    createdAt: new Date("2022-01-02"),
    receiveStatus: false,
    parcelCode: ["ASDSADASD"],
  },
  {
    id: 7,
    passCode: "10000003",
    room: "U103",
    createdAt: new Date("2022-01-03"),
    receiveStatus: true,
    parcelCode: ["ASDSADASD"],
  },
  {
    id: 8,
    passCode: "10000002",
    room: "U102",
    createdAt: new Date("2022-01-02"),
    receiveStatus: false,
    parcelCode: ["ASDSADASD"],
  },
  {
    id: 9,
    passCode: "10000003",
    room: "U103",
    createdAt: new Date("2022-01-03"),
    receiveStatus: true,
    parcelCode: ["ASDSADASD"],
  },
  {
    id: 10,
    passCode: "10000003",
    room: "U103",
    createdAt: new Date("2022-01-03"),
    receiveStatus: true,
    parcelCode: ["ASDSADASD"],
  },
  {
    id: 11,
    passCode: "10000003",
    room: "U103",
    createdAt: new Date("2022-01-03"),
    receiveStatus: true,
    parcelCode: ["ASDSADASD"],
  },
  {
    id: 12,
    passCode: "10000003",
    room: "U103",
    createdAt: new Date("2022-01-03"),
    receiveStatus: true,
    parcelCode: ["ASDSADASD"],
  },
];

const mailparcelHanlders = [
  rest.get("/parcels", (req, res, ctx) => {
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

  rest.get("/parcels/:id", (req: any, res, ctx) => {
    const { id } = req.params;
    const findMailParcel = parcels.find((item: any) => item.id === Number(id));
    if (!findMailParcel) {
      return res(
        ctx.status(404),
        ctx.json({
          status: 404,
          message: "Not found mail parcels",
        })
      );
    }
    return res(
      ctx.status(200),
      ctx.json({
        status: 200,
        message: "success",
        results: findMailParcel,
      })
    );
  }),

  rest.post("/parcels", (req: any, res, ctx) => {
    const { passCode, room, parcelCode } = req.body;
    const id = parcels.length + 1;
    parcels.push({
      id: id as number,
      passCode: passCode as string,
      room: room as string,
      parcelCode: parcelCode as string[],
      createdAt: new Date(),
      receiveStatus: false,
    });
    return res(
      ctx.status(200),
      ctx.json({
        status: 200,
        message: "success",
      })
    );
  }),
  rest.delete("/parcels/:id", (req: any, res, ctx) => {
    const { id } = req.params;
    const findMailParcel = parcels.find((item: any) => item.id === Number(id));
    if (!findMailParcel) {
      return res(
        ctx.status(404),
        ctx.json({
          status: 404,
          message: "Not found mail parcels",
        })
      );
    }
    const findIndex = parcels.findIndex(
      (item: TMailParcel) => item.id === Number(id)
    );
    parcels.splice(findIndex, 1);
    return res(
      ctx.status(200),
      ctx.json({
        status: 200,
        message: "success",
      })
    );
  }),
];

export default mailparcelHanlders;
