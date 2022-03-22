import mailparcelHanlders from "./handles/parcels";
import roomHandlers from "./handles/room";
import roomCategoryHandlers from "./handles/room-category";
// Gun
import repairHanlders from "./handles/repair";
import userHanlders from "./handles/users";
import dormitorysHanlders from "./handles/dormitorys";

const combineHandlers = [
  ...mailparcelHanlders,
  ...roomCategoryHandlers,
  ...roomHandlers,
  ...repairHanlders,
  ...repairHanlders,
  ...userHanlders,
  ...dormitorysHanlders,
];

export default combineHandlers;
