import { rest } from "msw";
// import { body } from "msw/lib/types/context";
import { queryStringToObject } from "../../utils/queryString";

export type TDormitorys = {
  id: number;
  name: string;
  address: string;
};

export const dormitorys: TDormitorys[] = [
  {
    id: 1,
    name: "S13",
    address: "University Suranaree Nakhon Ratchasima",
  },
  {
    id: 2,
    name: "S14",
    address: "Nongjabok Convan",
  },
  {
    id: 3,
    name: "S15",
    address: "Nakhonratchasima",
  },
];

const userHanlders = [
  // GET(READ)
  rest.get("/dormitories", (req, res, ctx) => {
    const qstr = queryStringToObject(req.url.search) as {
      page: number;
      limit: number;
    };
    const { page, limit } = qstr;
    const offsetStart = page * limit - limit;
    const offsetEnd = limit * page;
    const tempDormitorys = dormitorys;
    const item = tempDormitorys.slice(offsetStart, offsetEnd);
    const total = dormitorys.length;
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
  // DETAIL OR GET ID
  rest.get("/dormitories/:id", (req: any, res, ctx) => {
    const { id } = req.params;
    const findUser = dormitorys.find((item: any) => item.id === Number(id));
    if (!findUser) {
      return res(
        ctx.status(404),
        ctx.json({
          status: 404,
          message: "Not found mail User",
        })
      );
    }
    return res(
      ctx.status(200),
      ctx.json({
        status: 200,
        message: "success",
        results: findUser,
      })
    );
  }),
  // DELETE(Delete)
  rest.delete("/dormitories/:id", (req: any, res, ctx) => {
    const { id } = req.params;
    const findUser = dormitorys.find((item: any) => item.id === Number(id));
    if (!findUser) {
      return res(
        ctx.status(404),
        ctx.json({
          status: 404,
          message: "Not found mail User",
        })
      );
    }
    const findIndex = dormitorys.findIndex(
      (item: TDormitorys) => item.id === Number(id)
    );
    dormitorys.splice(findIndex, 1);
    return res(
      ctx.status(200),
      ctx.json({
        status: 200,
        message: "success",
      })
    );
  }),
  // POST(Creat or Add) CREATE_DORMITORY
  rest.post("/dormitories", (req: any, res, ctx) => {
    const { name, address } = req.body;
    const id = dormitorys.length + 1;
    dormitorys.push({
      id: id as number,
      name: name as string,
      address: address as string,
    });
    return res(
      ctx.status(200),
      ctx.json({
        status: 200,
        message: "success",
      })
    );
  }),
];

export default userHanlders;
