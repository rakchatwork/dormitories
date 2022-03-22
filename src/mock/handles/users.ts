import { rest } from "msw";
import { body } from "msw/lib/types/context";
import { queryStringToObject } from "../../utils/queryString";

export type TUsers = {
  id: number;
  identityCard: string;
  firstName: string;
  lastName: string;
  gender: string;
  tel: string;
  address: string;
  username: string;
  mail: string;
  password: string;
};

export const users: TUsers[] = [
  {
    id: 1,
    identityCard: "1302156263026",
    firstName: "Sukjai",
    lastName: "Somjai",
    gender: "ชาย",
    tel: "0959580265",
    address: "433 หมู่ 7",
    username: "Username_Sukjai",
    mail: "test1@test.com",
    password: "asd",
  },
  {
    id: 2,
    identityCard: "1302156263026",
    firstName: "Arkom",
    lastName: "Mongkol",
    gender: "ชาย",
    tel: "0845965203",
    address: "433 หมู่ 7",
    username: "Username_Arkom",
    mail: "test2@test.com",
    password: "asd",
  },
  {
    id: 3,
    identityCard: "1302156263026",
    firstName: "Jhon",
    lastName: "Marata",
    gender: "ชาย",
    tel: "0879562630",
    address: "433 หมู่ 7",
    username: "Username_Jhon",
    mail: "test3@test.com",
    password: "asd",
  },
  {
    id: 4,
    identityCard: "1302156263026",
    firstName: "Karom",
    lastName: "Komkay",
    gender: "ชาย",
    tel: "0925805416",
    address: "433 หมู่ 7",
    username: "Username_Karom",
    mail: "test4@test.com",
    password: "asd",
  },
  {
    id: 5,
    identityCard: "1301703262503",
    firstName: "Suntorn",
    lastName: "Rakchat",
    gender: "ชาย",
    tel: "0908185641",
    address: "123 หมู่ 456",
    username: "admin",
    mail: "admin@admin.com",
    password: "asd",
  },
];

const userHanlders = [
  // GET(READ)
  rest.get("/users", (req, res, ctx) => {
    const qstr = queryStringToObject(req.url.search) as {
      page: number;
      limit: number;
    };
    const { page, limit } = qstr;
    const offsetStart = page * limit - limit;
    const offsetEnd = limit * page;
    const tempUsers = users;
    const item = tempUsers.slice(offsetStart, offsetEnd);
    const total = users.length;
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
  rest.get("/users/:id", (req: any, res, ctx) => {
    const { id } = req.params;
    const findUser = users.find((item: any) => item.id === Number(id));
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
  // POST(Creat or Add) CREATE_USER
  rest.post("/users", (req: any, res, ctx) => {
    const {
      identityCard,
      firstName,
      lastName,
      gender,
      tel,
      address,
      username,
      mail,
      password,
    } = req.body;

    const id = users.length + 1;
    users.push({
      id: id as number,
      identityCard: identityCard as string,
      firstName: firstName as string,
      lastName: lastName as string,
      gender: gender as string,
      tel: tel as string,
      address: address as string,
      username: username as string,
      mail: mail as string,
      password: password as string,
    });
    return res(
      ctx.status(200),
      ctx.json({
        status: 200,
        message: "success",
      })
    );
  }),
  // Add

  // PATCH
  rest.patch("/users/:id", (req: any, res, ctx) => {
    const { id } = req.params;
    const findIndex = users.findIndex((item) => item.id === id);
    users[findIndex] = req.body;
    return res(
      ctx.status(200),
      ctx.json({
        status: 200,
        message: "success",
      })
    );
  }),

  // ENDPATCH

  // DELETE(Delete)
  rest.delete("/users/:id", (req: any, res, ctx) => {
    const { id } = req.params;
    const findUser = users.find((item: any) => item.id === Number(id));
    if (!findUser) {
      return res(
        ctx.status(404),
        ctx.json({
          status: 404,
          message: "Not found mail User",
        })
      );
    }
    const findIndex = users.findIndex((item: TUsers) => item.id === Number(id));
    users.splice(findIndex, 1);
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
