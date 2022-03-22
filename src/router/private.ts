import { lazy } from "react";

import { TRouter } from "./../types/router";

const Dashboard = lazy(() => import("../views/dashboard/Dashboard"));
const Repair = lazy(() => import("../views/repair/Repair"));
const Room = lazy(() => import("../views/rooms/room/Room"));
const RoomCategory = lazy(
  () => import("../views/rooms/room-category/RoomCategory")
);
const Parcels = lazy(() => import("../views/parcels/Parcels"));
const Admin = lazy(() => import("../views/admin/Admin"));
const Dormitory = lazy(() => import("../views/dormitory/Dormitory"));
const User = lazy(() => import("../views/user/users"));
const Staff = lazy(() => import("../views/staff/Staff"));
const DormitorySetting = lazy(
  () => import("../views/settings/dormitory/DormitorySetting")
);
const ProfileSetting = lazy(
  () => import("../views/settings/profile/ProfileSetting")
);

const privateRoute: TRouter[] = [
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
    name: "Staff",
    path: "/staff",
    exact: true,
    ContentComponent: Staff,
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
    name: "Domitory",
    path: "/dormitory",
    exact: true,
    ContentComponent: Dormitory,
  },
  {
    name: "Admin",
    path: "/admin",
    exact: true,
    ContentComponent: Admin,
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

export default privateRoute;
