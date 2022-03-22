type TRoom = {
  id: number;
  roomNumber: string;
  rentalStatus: boolean;
};

export type TParcels = {
  id: number;
  createdAt?: Date;
  passCode: string;
  receiveStatus: boolean;
  parcelCode: string[];
  roomNumber: string;
  receivedAt?: string;
  receiverName?: string;
  room: TRoom;
};
