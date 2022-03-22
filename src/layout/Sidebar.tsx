import { Fragment, memo, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { AiFillCaretRight, AiFillCaretDown } from "react-icons/ai";
import useWindowDimensions from "./../utils/useWindowDimensions";
// Redux
import { useAppSelector, useAppDispatch } from "../store/store";
import { GET_DORMITORY_BY_ID } from "../service/api/dormitory";
import { apiUrlDormitory } from "../config/api";
import { editInfo } from "../store/slices/dormitorySlice";

import homeIcon from "../assets/images/icon/home.png";
import roomIcon from "../assets/images/icon/room.png";
import parcelIcon from "../assets/images/icon/parcel.png";
import repairIcon from "../assets/images/icon/repair.png";
import userIcon from "../assets/images/icon/user.png";
import roomCateIcon from "../assets/images/icon/room-category.png";
import roomsIcon from "../assets/images/icon/rooms.png";
import renterIcon from "../assets/images/icon/renter.png";
import staffIcon from "../assets/images/icon/staff.png";
import settingIcon from "../assets/images/icon/setting.png";
import dormitoryIcon from "../assets/images/icon/dormitory.png";
import profileIcon from "../assets/images/icon/profile.png";
import managerIcon from "../assets/images/icon/manager.png";
import { AUTH_VERIFY } from "../service/api/auth";
import { signout } from "../store/slices/authSlice";
import { setUserToken, userToken } from "../utils/token";

type TChildMenu = {
  id: number;
  name: string;
  to: string;
  child: boolean;
  icon: any;
};

interface SidebarDown {
  id: number;
  name: string;
  child: boolean;
  callapse: boolean;
  childMenu: TChildMenu[];
  icon: any;
}

const sidebarTopMenu = [
  {
    id: 1,
    name: "หน้าหลัก",
    to: "/dashboard",
    child: false,
    icon: homeIcon,
  },
  {
    id: 2,
    name: "ห้องพัก",
    child: true,
    callapse: false,
    icon: roomIcon,
    childMenu: [
      {
        id: 1,
        name: "ประเภทห้อง",
        to: "/room-category",
        child: false,
        icon: roomCateIcon,
      },
      {
        id: 2,
        name: "ห้อง",
        to: "/room",
        child: false,
        icon: roomsIcon,
      },
    ],
  },
  {
    id: 3,
    name: "พัสดุ",
    to: "/parcels",
    child: false,
    icon: parcelIcon,
  },
  {
    id: 4,
    name: "แจ้งซ่อม",
    to: "/repair",
    child: false,
    icon: repairIcon,
  },
];

const sideBarDownForManager: SidebarDown[] = [
  {
    id: 1,
    name: "ผู้ใช้",
    child: true,
    callapse: false,
    icon: userIcon,
    childMenu: [
      {
        id: 1,
        name: "ผู้เช่า",
        to: "/user",
        child: false,
        icon: renterIcon,
      },
      {
        id: 2,
        name: "ผู้ดูแล",
        to: "/staff",
        child: false,
        icon: staffIcon,
      },
    ],
  },
  {
    id: 2,
    name: "ตั้งค่า",
    child: true,
    callapse: false,
    icon: settingIcon,
    childMenu: [
      {
        id: 1,
        name: "หอพัก",
        to: "/setting/dormitory",
        child: false,
        icon: dormitoryIcon,
      },
      {
        id: 2,
        name: "โปรไฟล์",
        to: "/setting/profile",
        child: false,
        icon: profileIcon,
      },
    ],
  },
];

const sideBarDownForStaff: SidebarDown[] = [
  {
    id: 1,
    name: "ผู้ใช้",
    child: true,
    callapse: false,
    icon: userIcon,
    childMenu: [
      {
        id: 1,
        name: "ผู้เช่า",
        to: "/user",
        child: false,
        icon: renterIcon,
      },
    ],
  },
  {
    id: 2,
    name: "ตั้งค่า",
    child: true,
    callapse: false,
    icon: settingIcon,
    childMenu: [
      {
        id: 1,
        name: "หอพัก",
        to: "/setting/dormitory",
        child: false,
        icon: dormitoryIcon,
      },
      {
        id: 2,
        name: "โปรไฟล์",
        to: "/setting/profile",
        child: false,
        icon: profileIcon,
      },
    ],
  },
];

const sideBarSuperAdmin = [
  {
    id: 1,
    name: "หอพัก",
    to: "/dormitory",
    child: false,
    icon: dormitoryIcon,
  },
  {
    id: 2,
    name: "ผู้จัดการหอพัก",
    to: "/admin",
    child: false,
    icon: managerIcon,
  },
];

const Sidebar = () => {
  const [callapseId, setCallapseId] = useState<number>();
  const [callapseMenuDownId, setCallapseMenuDownId] = useState<number>();
  const [menuSidebar, setMenuSidebar] = useState<any[]>(sidebarTopMenu);
  const [menuSidebarDown, setMenuSidebarDown] = useState<SidebarDown[]>([]);
  const { height } = useWindowDimensions();

  const dispatch = useAppDispatch();
  const { role, dormitoryId } = useAppSelector((state) => state.auth);
  const { srcLogo, dormitoryName } = useAppSelector((state) => state.dormitory);

  useEffect(() => {
    getDormitoryById();
  }, []);

  const verifyToken = async () => {
    try {
      const res = await AUTH_VERIFY(userToken as string);
      console.log("RES", res);
      if (res.status === 200) {
        return;
      } else {
        localStorage.removeItem("token");
        setUserToken("");
        dispatch(signout());
      }
      console.log("auth::", false);
    } catch (error) {}
  };

  const handleToggleCallapse = (index?: number) => {
    setCallapseId(index);
    const cloneMenu = menuSidebar;
    if (callapseId !== undefined) {
      if (cloneMenu[index || callapseId].callapse === true) {
        cloneMenu[index || callapseId].callapse = false;
      } else {
        cloneMenu[callapseId].callapse = true;
      }
      setMenuSidebar(cloneMenu);
    } else {
      setMenuSidebar(sidebarTopMenu);
    }
  };

  const handleToggleMenuDownCallapse = (index?: number) => {
    setCallapseMenuDownId(index);
    const cloneMenu =
      role === "manager" ? sideBarDownForManager : sideBarDownForStaff;
    if (callapseMenuDownId !== undefined) {
      if (cloneMenu[index || callapseMenuDownId].callapse === true) {
        cloneMenu[index || callapseMenuDownId].callapse = false;
      } else {
        cloneMenu[callapseMenuDownId].callapse = true;
      }
      setMenuSidebar(cloneMenu);
    } else {
      setMenuSidebar(sidebarTopMenu);
    }
  };

  useEffect(() => {
    handleToggleCallapse();
  }, [callapseId]);

  useEffect(() => {
    handleToggleMenuDownCallapse();
  }, [callapseMenuDownId]);

  const setBg = (callapse: boolean) => {
    if (callapse) {
      return { backgroundColor: "#51bbfd" };
    }
    return {};
  };

  const getDormitoryById = async () => {
    const res = await GET_DORMITORY_BY_ID(Number(dormitoryId));
    if (res.status === 200) {
      let payload = { dormitoryName: "", srcLogo: "" };
      payload = { ...payload, dormitoryName: res.results.name };
      if (res.results.image !== null) {
        payload = {
          ...payload,
          srcLogo: `${apiUrlDormitory}/images/${res.results.image.filename}`,
        };
      }
      dispatch(editInfo(payload));
    }
  };

  return (
    <section className="sidebar-container">
      <div className="sidebar-brand">
        {role === "superAdmin" ? (
          <div>
            <img
              src={require("./../assets/images/icon/Logo.png").default}
              alt="logo"
              width="100%"
            />
          </div>
        ) : (
          <NavLink onClick={verifyToken} to="/dashboard">
            <img
              src={
                srcLogo.length > 0
                  ? srcLogo
                  : require("./../assets/images/icon/Logo.png").default
              }
              alt="logo"
              width="140px"
            />
          </NavLink>
        )}
      </div>
      {role === "superAdmin" ? null : (
        <div
          style={{
            textAlign: "center",
            wordWrap: "break-word",
            marginInline: 16,
          }}
        >
          <h3>{dormitoryName}</h3>
        </div>
      )}

      <hr
        style={{
          border: "1px solid #484848",
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          opacity: 0.5,
        }}
      />
      <div className="sidebare-overflow" style={{ height: height - 170 }}>
        {role === "superAdmin" ? (
          <div className="sidebar-list">
            {sideBarSuperAdmin &&
              sideBarSuperAdmin.map((menu: any, index) => {
                return (
                  <Fragment key={index}>
                    {menu.child ? (
                      <div className="sidebar-list-item sidebar-expand-list">
                        <button
                          style={{
                            border: "none",
                            position: "relative",
                            ...setBg(menu.callapse),
                          }}
                          className="btn-item"
                          onClick={() => {
                            handleToggleCallapse(index);
                          }}
                        >
                          <img
                            src={menu.icon}
                            alt={menu.name}
                            style={{ marginRight: 8 }}
                          />
                          {menu.name && menu.name}
                          {!menu.callapse ? (
                            <AiFillCaretRight
                              style={{
                                position: "absolute",
                                top: "30%",
                                right: "5%",
                              }}
                            />
                          ) : (
                            <AiFillCaretDown
                              style={{
                                position: "absolute",
                                top: "30%",
                                right: "5%",
                              }}
                            />
                          )}
                        </button>
                        {menu.callapse && (
                          <div className="sidebar-list sidebar-expand-child-list">
                            {menu.childMenu &&
                              menu.childMenu.map(
                                (childMenu: any, indexChild: number) => (
                                  <div
                                    className="sidebar-list sidebar-expand-child-list"
                                    key={indexChild}
                                  >
                                    <div className="sidebar-list-item">
                                      <NavLink
                                        onClick={verifyToken}
                                        to={childMenu.to && childMenu.to}
                                        className="btn-item"
                                        activeStyle={{
                                          background: "#FFF",
                                          borderRadius: "40px 0px 0px 40px",
                                        }}
                                      >
                                        <img
                                          src={childMenu.icon}
                                          alt={childMenu.name}
                                          style={{ marginRight: 8 }}
                                        />
                                        {childMenu.name && childMenu.name}
                                      </NavLink>
                                    </div>
                                  </div>
                                )
                              )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="sidebar-list-item">
                        <NavLink
                          onClick={verifyToken}
                          to={menu.to && menu.to}
                          className="btn-item"
                          activeStyle={{
                            background: "#FFF",
                            borderRadius: "40px 0px 0px 40px",
                          }}
                        >
                          <img
                            src={menu.icon}
                            alt={menu.name}
                            style={{ marginRight: 8 }}
                          />
                          {menu.name && menu.name}
                        </NavLink>
                      </div>
                    )}
                  </Fragment>
                );
              })}
          </div>
        ) : (
          <>
            <div className="sidebar-list">
              {menuSidebar &&
                menuSidebar.map((menu: any, index) => {
                  return (
                    <Fragment key={index}>
                      {menu.child ? (
                        <div className="sidebar-list-item sidebar-expand-list">
                          <button
                            style={{
                              border: "none",
                              position: "relative",
                              ...setBg(menu.callapse),
                            }}
                            className="btn-item"
                            onClick={() => {
                              handleToggleCallapse(index);
                            }}
                          >
                            <img
                              src={menu.icon}
                              alt={menu.name}
                              style={{ marginRight: 8 }}
                            />
                            {menu.name && menu.name}
                            {!menu.callapse ? (
                              <AiFillCaretRight
                                style={{
                                  position: "absolute",
                                  top: "30%",
                                  right: "5%",
                                }}
                              />
                            ) : (
                              <AiFillCaretDown
                                style={{
                                  position: "absolute",
                                  top: "30%",
                                  right: "5%",
                                }}
                              />
                            )}
                          </button>
                          {menu.callapse && (
                            <div className="sidebar-list sidebar-expand-child-list">
                              {menu.childMenu &&
                                menu.childMenu.map(
                                  (childMenu: any, indexChild: number) => (
                                    <div
                                      className="sidebar-list sidebar-expand-child-list"
                                      key={indexChild}
                                    >
                                      <div className="sidebar-list-item">
                                        <NavLink
                                          onClick={verifyToken}
                                          to={childMenu.to && childMenu.to}
                                          className="btn-item"
                                          activeStyle={{
                                            background: "#FFF",
                                            borderRadius: "40px 0px 0px 40px",
                                          }}
                                        >
                                          <img
                                            src={childMenu.icon}
                                            alt={childMenu.name}
                                            style={{ marginRight: 8 }}
                                          />
                                          {childMenu.name && childMenu.name}
                                        </NavLink>
                                      </div>
                                    </div>
                                  )
                                )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="sidebar-list-item">
                          <NavLink
                            onClick={verifyToken}
                            to={menu.to && menu.to}
                            className="btn-item"
                            activeStyle={{
                              background: "#FFF",
                              borderRadius: "40px 0px 0px 40px",
                            }}
                          >
                            <img
                              src={menu.icon}
                              alt={menu.name}
                              style={{ marginRight: 8 }}
                            />
                            {menu.name && menu.name}
                          </NavLink>
                        </div>
                      )}
                    </Fragment>
                  );
                })}
            </div>
            <hr
              style={{
                border: "1px solid #484848",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                opacity: 0.5,
              }}
            />
            <div className="sidebar-list">
              {role === "manager"
                ? sideBarDownForManager &&
                  sideBarDownForManager.map((menu: any, index) => {
                    return (
                      <Fragment key={index}>
                        {menu.child ? (
                          <div className="sidebar-list-item sidebar-expand-list">
                            <button
                              style={{
                                border: "none",
                                position: "relative",
                                ...setBg(menu.callapse),
                              }}
                              className="btn-item"
                              onClick={() => {
                                handleToggleMenuDownCallapse(index);
                              }}
                            >
                              <img
                                src={menu.icon}
                                alt={menu.name}
                                style={{ marginRight: 8 }}
                              />
                              {menu.name && menu.name}
                              {!menu.callapse ? (
                                <AiFillCaretRight
                                  style={{
                                    position: "absolute",
                                    top: "30%",
                                    right: "5%",
                                  }}
                                />
                              ) : (
                                <AiFillCaretDown
                                  style={{
                                    position: "absolute",
                                    top: "30%",
                                    right: "5%",
                                  }}
                                />
                              )}
                            </button>
                            {menu.callapse && (
                              <div className="sidebar-list sidebar-expand-child-list">
                                {menu.childMenu &&
                                  menu.childMenu.map(
                                    (childMenu: any, indexChild: number) => (
                                      <div
                                        className="sidebar-list sidebar-expand-child-list"
                                        key={indexChild}
                                      >
                                        <div className="sidebar-list-item">
                                          <NavLink
                                            onClick={verifyToken}
                                            to={childMenu.to && childMenu.to}
                                            className="btn-item"
                                            activeStyle={{
                                              background: "#FFF",
                                              borderRadius: "40px 0px 0px 40px",
                                            }}
                                          >
                                            <img
                                              src={childMenu.icon}
                                              alt={childMenu.name}
                                              style={{ marginRight: 8 }}
                                            />
                                            {childMenu.name && childMenu.name}
                                          </NavLink>
                                        </div>
                                      </div>
                                    )
                                  )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="sidebar-list-item">
                            <NavLink
                              onClick={verifyToken}
                              to={menu.to && menu.to}
                              className="btn-item"
                              activeStyle={{
                                background: "#FFF",
                                borderRadius: "40px 0px 0px 40px",
                              }}
                            >
                              <img
                                src={menu.icon}
                                alt={menu.name}
                                style={{ marginRight: 8 }}
                              />
                              {menu.name && menu.name}
                            </NavLink>
                          </div>
                        )}
                      </Fragment>
                    );
                  })
                : sideBarDownForStaff &&
                  sideBarDownForStaff.map((menu: any, index) => {
                    return (
                      <Fragment key={index}>
                        {menu.child ? (
                          <div className="sidebar-list-item sidebar-expand-list">
                            <button
                              style={{
                                border: "none",
                                position: "relative",
                                ...setBg(menu.callapse),
                              }}
                              className="btn-item"
                              onClick={() => {
                                handleToggleMenuDownCallapse(index);
                              }}
                            >
                              <img
                                src={menu.icon}
                                alt={menu.name}
                                style={{ marginRight: 8 }}
                              />
                              {menu.name && menu.name}
                              {!menu.callapse ? (
                                <AiFillCaretRight
                                  style={{
                                    position: "absolute",
                                    top: "30%",
                                    right: "5%",
                                  }}
                                />
                              ) : (
                                <AiFillCaretDown
                                  style={{
                                    position: "absolute",
                                    top: "30%",
                                    right: "5%",
                                  }}
                                />
                              )}
                            </button>
                            {menu.callapse && (
                              <div className="sidebar-list sidebar-expand-child-list">
                                {menu.childMenu &&
                                  menu.childMenu.map(
                                    (childMenu: any, indexChild: number) => (
                                      <div
                                        className="sidebar-list sidebar-expand-child-list"
                                        key={indexChild}
                                      >
                                        <div className="sidebar-list-item">
                                          <NavLink
                                            onClick={verifyToken}
                                            to={childMenu.to && childMenu.to}
                                            className="btn-item"
                                            activeStyle={{
                                              background: "#FFF",
                                              borderRadius: "40px 0px 0px 40px",
                                            }}
                                          >
                                            <img
                                              src={childMenu.icon}
                                              alt={childMenu.name}
                                              style={{ marginRight: 8 }}
                                            />
                                            {childMenu.name && childMenu.name}
                                          </NavLink>
                                        </div>
                                      </div>
                                    )
                                  )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="sidebar-list-item">
                            <NavLink
                              onClick={verifyToken}
                              to={menu.to && menu.to}
                              className="btn-item"
                              activeStyle={{
                                background: "#FFF",
                                borderRadius: "40px 0px 0px 40px",
                              }}
                            >
                              <img
                                src={menu.icon}
                                alt={menu.name}
                                style={{ marginRight: 8 }}
                              />
                              {menu.name && menu.name}
                            </NavLink>
                          </div>
                        )}
                      </Fragment>
                    );
                  })}
            </div>
          </>
        )}
        <div style={{ height: 80 }}></div>
      </div>
    </section>
  );
};

export default memo(Sidebar);
