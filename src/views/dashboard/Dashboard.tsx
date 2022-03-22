import React, { Fragment, useState, useEffect } from "react";
import moment from "moment";
import { useHistory } from "react-router-dom";

// Style
import { Divider } from "antd";
import { Box, Grid, Typography, Button } from "@mui/material";
import { useStyles } from "./DashboardStyle";

// Components

// REDUX
import { useAppSelector } from "../../store/store";

// API
import { GET_USER } from "../../service/api/users";
import { GET_DORMITORY_BY_ID } from "../../service/api/dormitory";
import { GET_ROOM } from "../../service/api/room";
import { GET_REPAIR } from "../../service/api/repairs";
import { GET_PARCELS } from "../../service/api/parcels";

// Type
import { TUsers } from "../../types/users";
import { TParcels } from "../../types/parcels";
import { TDormitory } from "../../types/dormitory";
import { STATUS_REPAIR } from "../../enums/repair";

function Dashboard() {
  const classes = useStyles();
  const { dormitoryId } = useAppSelector((state) => state.auth);
  const [managers, setManagers] = useState<TUsers[]>([]);
  const [staffs, setStaffs] = useState<TUsers[]>([]);
  const [dormitory, setDormitory] = useState<TDormitory>();
  const [totalRoom, setTotalRoom] = useState<number>(0);
  const [emptyRoom, setEmptyRoom] = useState<number>(0);
  const [busyRoom, setBusyRoom] = useState<number>(0);
  const [totalRepair, setTotalRepair] = useState<number>(0);
  const [approvedRepair, setApprovedRepair] = useState<number>(0);
  const [waitRepair, setWaitRepair] = useState<number>(0);
  const [processingRepair, setProcessingRepair] = useState<number>(0);
  const [parcels, setParcels] = useState<TParcels[]>([]);
  const [totalParcel, setTotalParcel] = useState<number>(0);
  const history = useHistory();

  useEffect(() => {
    apiGetManagerList();
    apiGetStaffList();
    apiGetDormiroty();
    apiGetRoom();
    apiGetRepair();
    apiGetParcel();
  }, []);

  useEffect(() => {
    totalRepairList();
  }, [approvedRepair, waitRepair, processingRepair]);

  // Get Manager List
  const apiGetManagerList = async () => {
    const res = await GET_USER({
      getAll: false,
      role: "manager",
      dormitoryId,
    });
    if (res.status === 200) {
      setManagers(res.results.item);
    }
  };
  // Get Staff List
  const apiGetStaffList = async () => {
    const res = await GET_USER({
      getAll: false,
      role: "staff",
      dormitoryId,
    });
    if (res.status === 200) {
      setStaffs(res.results.item);
    }
  };
  // Get Staff List
  const apiGetDormiroty = async () => {
    if (dormitoryId) {
      const res = await GET_DORMITORY_BY_ID(dormitoryId);
      if (res.status === 200) {
        setDormitory(res.results);
      }
    }
  };
  // GET Room List
  const apiGetRoom = async () => {
    const resTotal = await GET_ROOM({ getAll: false, dormitoryId });
    if (resTotal.status === 200) {
      setTotalRoom(resTotal.results.total);
    }

    const resEmpty = await GET_ROOM({
      getAll: false,
      dormitoryId,
      status: false,
    });
    if (resEmpty.status === 200) {
      setEmptyRoom(resEmpty.results.total);
    }

    const resBusy = await GET_ROOM({
      getAll: false,
      dormitoryId,
      status: true,
    });
    if (resBusy.status === 200) {
      setBusyRoom(resBusy.results.total);
    }
  };
  // GET Repair List
  const apiGetRepair = async () => {
    const resTotal = await GET_REPAIR({ getAll: false, dormitoryId });
    if (resTotal.status === 200) {
      // setTotalRoom(resTotal.results.total);
    }

    const resWait = await GET_REPAIR({
      getAll: false,
      dormitoryId,
      status: STATUS_REPAIR.APPROVED,
    });
    if (resWait.status === 200) {
      setWaitRepair(resWait.results.total);
    }

    const resApproved = await GET_REPAIR({
      getAll: false,
      dormitoryId,
      status: STATUS_REPAIR.WAITING,
    });
    if (resApproved.status === 200) {
      setApprovedRepair(resApproved.results.total);
    }

    const resProcessing = await GET_REPAIR({
      getAll: false,
      dormitoryId,
      status: STATUS_REPAIR.PROCESSING,
    });
    if (resProcessing.status === 200) {
      setProcessingRepair(resProcessing.results.total);
    }
  };
  const totalRepairList = () => {
    let total = approvedRepair + waitRepair + processingRepair;
    setTotalRepair(total);
  };

  // GET Parcel List
  const apiGetParcel = async () => {
    const resTotal = await GET_PARCELS({
      getAll: false,
      dormitoryId,
      status: false,
    });
    if (resTotal.status === 200) {
      setTotalParcel(resTotal.results.total);
    }

    let dateNow = moment(Date.now()).format("YYYY-MM-DD");
    let date = String(dateNow);
    const resParcel = await GET_PARCELS({
      getAll: false,
      dormitoryId,
      status: false,
      date,
    });
    if (resParcel.status === 200) {
      setParcels(resParcel.results.item);
    }
  };

  return (
    <section style={{ overflow: "auto" }}>
      <Box px={8} pt={10}>
        <Grid container spacing={12}>
          <Grid item xs={3}>
            <Box className={classes.boxContainer}>
              <Box px={4} pt={2}>
                <Typography variant="subtitle1" color="#A6A6A6">
                  จำนวนห้องพักทั้งหมด
                </Typography>
                <Typography px={2} pt={6} variant="h2" color="#000">
                  {totalRoom}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography pt={6} variant="subtitle1" color="#A6A6A6">
                    ห้อง
                  </Typography>
                  <Button onClick={() => history.push("/room")}>
                    <img
                      src={
                        require("../../assets/images/icon/all-room.png").default
                      }
                      alt="logo"
                      width="60px"
                    />
                  </Button>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box className={classes.boxContainer}>
              <Box px={4} pt={2}>
                <Typography variant="subtitle1" color="#A6A6A6">
                  รายการแจ้งซ่อมห้องพัก
                </Typography>
                <Typography px={2} pt={6} variant="h2" color="#000">
                  {totalRepair}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography pt={6} variant="subtitle1" color="#A6A6A6">
                    รายการ
                  </Typography>
                  <Button onClick={() => history.push("/repair")}>
                    <img
                      src={
                        require("../../assets/images/icon/all-repair.png")
                          .default
                      }
                      alt="logo"
                      width="60px"
                    />
                  </Button>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box className={classes.boxContainer}>
              <Box px={4} pt={2}>
                <Typography variant="subtitle1" color="#A6A6A6">
                  พัสดุที่ยังไม่ได้รับทั้งหมด
                </Typography>
                <Typography px={2} pt={6} variant="h2" color="#000">
                  {totalParcel}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography pt={6} variant="subtitle1" color="#A6A6A6">
                    ชิ้น
                  </Typography>
                  <Button onClick={() => history.push("/parcels")}>
                    <img
                      src={
                        require("../../assets/images/icon/all-parcel.png")
                          .default
                      }
                      alt="logo"
                      width="60px"
                    />
                  </Button>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box className={classes.boxManagerContainer}>
              <Box px={4} pt={2}>
                <Box mb={4} sx={{ display: "flex" }}>
                  <Typography
                    variant="subtitle1"
                    color="#000"
                    sx={{ fontWeight: 500 }}
                  >
                    หอพัก {dormitory?.name}
                  </Typography>
                </Box>
                <Box
                  mb={2}
                  sx={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Button onClick={() => history.push("/setting/dormitory")}>
                    <img
                      src={
                        require("../../assets/images/icon/all-dormitory.png")
                          .default
                      }
                      alt="logo"
                      width="70px"
                    />
                  </Button>
                </Box>
                <Typography variant="subtitle1" color="#A6A6A6">
                  ผู้จัดการ/พนักงานหอพัก
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Box my={5}></Box>
        <Grid container spacing={12}>
          {/* Column 1 */}
          <Grid item xs={3}>
            <Grid container direction="column">
              <Grid item xs={3}>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Box mb={4} className={classes.boxSubContainer}>
                    <Box px={4} pt={2}>
                      <Typography variant="subtitle1" color="#A6A6A6">
                        จำนวนห้องพักที่ว่าง
                      </Typography>
                      <Typography px={2} pt={6} variant="h2" color="#000">
                        {emptyRoom}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography pt={6} variant="subtitle1" color="#A6A6A6">
                          ห้อง
                        </Typography>
                        <Box>
                          <img
                            src={
                              require("../../assets/images/icon/all-room-empty.png")
                                .default
                            }
                            alt="logo"
                            width="54px"
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Box className={classes.boxSubContainer}>
                    <Box px={4} pt={2}>
                      <Typography variant="subtitle1" color="#A6A6A6">
                        จำนวนห้องพักที่ไม่ว่าง
                      </Typography>
                      <Typography px={2} pt={6} variant="h2" color="#000">
                        {busyRoom}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography pt={6} variant="subtitle1" color="#A6A6A6">
                          ห้อง
                        </Typography>
                        <Box>
                          <img
                            src={
                              require("../../assets/images/icon/all-room-busy.png")
                                .default
                            }
                            alt="logo"
                            width="54px"
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>
          {/* Column 2 */}
          <Grid item xs={3}>
            <Grid container direction="column">
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Box mb={4} className={classes.boxSubRepair}>
                  <Box px={4} pt={2}>
                    <Typography variant="subtitle1" color="#A6A6A6">
                      รออนุมัติ
                    </Typography>
                    <Typography px={2} pt={6} variant="h2" color="#000">
                      {approvedRepair}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography pt={6} variant="subtitle1" color="#A6A6A6">
                        รายการ
                      </Typography>
                      <Box>
                        <img
                          src={
                            require("../../assets/images/icon/all-repair-approved.png")
                              .default
                          }
                          alt="logo"
                          width="45px"
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Box mb={4} className={classes.boxSubRepair}>
                  <Box px={4} pt={2}>
                    <Typography variant="subtitle1" color="#A6A6A6">
                      รอดำเนินการ
                    </Typography>
                    <Typography px={2} pt={6} variant="h2" color="#000">
                      {waitRepair}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography pt={6} variant="subtitle1" color="#A6A6A6">
                        รายการ
                      </Typography>
                      <Box>
                        <img
                          src={
                            require("../../assets/images/icon/all-repair-wait.png")
                              .default
                          }
                          alt="logo"
                          width="45px"
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Box mb={4} className={classes.boxSubRepair}>
                  <Box px={4} pt={2}>
                    <Typography variant="subtitle1" color="#A6A6A6">
                      กำลังดำเนินการ
                    </Typography>
                    <Typography px={2} pt={6} variant="h2" color="#000">
                      {processingRepair}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography pt={6} variant="subtitle1" color="#A6A6A6">
                        รายการ
                      </Typography>
                      <Box>
                        <img
                          src={
                            require("../../assets/images/icon/all-repair-processing.png")
                              .default
                          }
                          alt="logo"
                          width="45px"
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
          {/* Column 3 */}
          <Grid item xs={3}>
            <Box mb={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Typography>พัสดุที่เพิ่งมาส่งวันนี้</Typography>
            </Box>
            {parcels.length ? (
              <>
                <Box
                  mb={0.5}
                  px={8}
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography color="#A6A6A6">ห้อง</Typography>
                  <Typography color="#A6A6A6">เวลา</Typography>
                </Box>
              </>
            ) : (
              <>
                <Box
                  mb={2}
                  sx={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Typography color="#A6A6A6">ไม่มี</Typography>
                </Box>
              </>
            )}

            <Box
              style={{
                display: "block",
                height: "365px",
                overflow: "auto",
                paddingBlock: "4px",
              }}
            >
              <Grid container direction="column">
                {parcels &&
                  parcels.map((item, index) => (
                    <Grid key={index} item xs={3}>
                      <Box
                        mb={3}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <Box className={classes.boxSubParcel}>
                          <Box
                            px={5}
                            sx={{
                              display: "flex",
                              width: "100%",
                              height: "100%",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="subtitle2">
                              {item.roomNumber}
                            </Typography>
                            <Typography variant="subtitle2">
                              {moment(item.createdAt).format("HH:mm")}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
              </Grid>
            </Box>
          </Grid>
          {/* Column 4 */}
          <Grid item xs={3}>
            <Box mb={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Typography>ผู้จัดการหอพัก</Typography>
            </Box>
            <Box
              mb={0.5}
              px={8}
              sx={{ display: "flex", justifyContent: "flex-start" }}
            >
              <Typography color="#A6A6A6">ชื่อ-นามสกุล</Typography>
            </Box>
            <Box
              style={{
                display: "block",
                height: "60px",
                overflow: "auto",
                paddingBlock: "4px",
              }}
            >
              <Grid container direction="column">
                {managers &&
                  managers.map((item, index) => (
                    <Grid key={index} item xs={3}>
                      <Box
                        mb={3}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <Box className={classes.boxSubManager}>
                          <Box
                            px={5}
                            sx={{
                              display: "flex",
                              width: "100%",
                              height: "100%",
                              justifyContent: "start",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              style={{
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                width: "200px",
                              }}
                            >
                              {item.firstName} {item.lastName}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
              </Grid>
            </Box>
            <Divider />

            <Box mb={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Typography>พนักงานหอพัก</Typography>
            </Box>
            <Box
              mb={0.5}
              px={8}
              sx={{ display: "flex", justifyContent: "flex-start" }}
            >
              <Typography color="#A6A6A6">ชื่อ-นามสกุล</Typography>
            </Box>
            <Box
              style={{
                display: "block",
                height: "200px",
                overflow: "auto",
                paddingBlock: "4px",
              }}
            >
              <Grid container direction="column">
                {staffs &&
                  staffs.map((item, index) => (
                    <Grid key={index} item xs={3}>
                      <Box
                        mb={3}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <Box className={classes.boxSubStaff}>
                          <Box
                            px={5}
                            sx={{
                              display: "flex",
                              width: "100%",
                              height: "100%",
                              justifyContent: "start",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              style={{
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                width: "200px",
                              }}
                            >
                              {item.firstName} {item.lastName}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </section>
  );
}

/*
- จำนวนห้องพักที่ว่าง
    - จำนวนห้องพักที่ไม่ว่าง
*/

export default Dashboard;
