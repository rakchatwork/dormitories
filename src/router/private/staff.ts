import { lazy } from "react";
import { TRouter } from "../../types/router";

const Dashboard = lazy(() => import("../../views/dashboard/Dashboard"));
const Repair = lazy(() => import("../../views/repair/Repair"));
const Room = lazy(() => import("../../views/rooms/room/Room"));
const RoomCategory = lazy(
  () => import("../../views/rooms/room-category/RoomCategory")
);
const Parcels = lazy(() => import("../../views/parcels/Parcels"));
const User = lazy(() => import("../../views/user/users"));
const DormitorySetting = lazy(
  () => import("../../views/settings/dormitory/DormitorySetting")
);
const ProfileSetting = lazy(
  () => import("../../views/settings/profile/ProfileSetting")
);

const staffRoute: TRouter[] = [
  {
    name: "Dashboard",
    path: "/dashboard",
    exact: true,
    ContentComponent: Dashboard,
  },
  {
    name: "Repair",
    path: "/repair",
    exact: true,
    ContentComponent: Repair,
  },
  {
    name: "User",
    path: "/user",
    exact: true,
    ContentComponent: User,
  },
  {
    name: "Room",
    path: "/room",
    exact: true,
    ContentComponent: Room,
  },
  {
    name: "Room Category",
    path: "/room-category",
    exact: true,
    ContentComponent: RoomCategory,
  },
  {
    name: "Mail Parcels",
    path: "/parcels",
    exact: true,
    ContentComponent: Parcels,
  },
  {
    name: "Setting Dormitory",
    path: "/setting/dormitory",
    exact: true,
    ContentComponent: DormitorySetting,
  },
  {
    name: "Setting Profile",
    path: "/setting/profile",
    exact: true,
    ContentComponent: ProfileSetting,
  },
];

export default staffRoute;
