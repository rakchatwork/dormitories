import { lazy } from "react";
import { TRouter } from "../../types/router";

const Admin = lazy(() => import("../../views/admin/Admin"));
const Dormitory = lazy(() => import("../../views/dormitory/Dormitory"));

const superAdminRoute: TRouter[] = [
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
];

export default superAdminRoute;
