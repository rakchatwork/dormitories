export type TUsers = {
  id: number;
  identityCard: string;
  firstName: string;
  lastName: string;
  gender: string;
  tel: string;
  address: string;
  username: string;
  email: string;
  password: string;
  role: any;
};

type Room = {
  roomNumber: string;
};

export type TUserRoom = {
  id: number;
  identityCard: string;
  firstName: string;
  lastName: string;
  gender: string;
  tel: string;
  address: string;
  username: string;
  email: string;
  password: string;
  role: any;
  room: Room[];
};

/*
  "id": 9,
    "createdAt": "2022-02-14T18:18:10.546Z",
    "identityCard": "1325452102113",
    "email": "renter4@gmail.com",
    "username": "renter4",
    "firstName": "ปรีชา",
    "lastName": "ศีรีราช",
    "gender": "ชาย",
    "tel": "0908545147",
    "address": "55/7 ต.สุรนารี อ.เมืองนครราชสีมา จังหวัดนครราชสีมา",
    "role": {
      "title": "renter",
      "id": 4
    },
    "userDormitory": null,
    "dormitory": {},
    "room": [
      {
        "roomNumber": "สุรสวัสดิ์ E001"
      },
      {
        "roomNumber": "สุรสัมนาคาร A002"
      }
    ]
*/
