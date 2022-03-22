import { Fragment, useEffect, useState } from "react";
// Alert
import Swal from "sweetalert2";

// Styles
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  PageHeader,
  Pagination,
  Row,
  Select,
  Table,
  Modal,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { Box, Typography } from "@mui/material";

// Icon
import { GrPowerReset } from "react-icons/gr";
import { AiOutlineSearch } from "react-icons/ai";
import detailIcom from "./../../../assets/images/icon/btn-details.svg";

// API
import {
  DELETE_ROOM,
  GET_ROOM,
  GET_ROOM_BY_ID,
} from "../../../service/api/room";

// Components
import CreateRoom from "./CreateRoom";
import DetailRoom from "./DetailRoom";

// REDUX
import { useAppSelector } from "../../../store/store";

// Type
import { TRoom } from "../../../types/room";
import {
  paginationDefult,
  TFilterPagination,
  TPagination,
} from "../../../types/pagination";
import { GET_ROOM_CATEGORIES } from "../../../service/api/room-categories";

const Room = () => {
  const [formSearch] = Form.useForm();
  const { confirm } = Modal;
  const [rooms, setRooms] = useState<TRoom[]>();
  const [roomDetail, setRoomDetail] = useState<TRoom>();
  const [pagination, setPagination] =
    useState<TFilterPagination>(paginationDefult);
  const { dormitoryId } = useAppSelector((state) => state.auth);
  const [visibleModalDetail, setVisibleModalDetail] = useState<boolean>(false);
  const [roomCategory, setRoomCagetory] = useState<any>([]);

  useEffect(() => {
    apiGetRooms();
    apiGetRoomCategory();
  }, []);

  // Get
  const apiGetRooms = async () => {
    const res = await GET_ROOM({
      limit: pagination.limit,
      page: pagination.page,
      dormitoryId,
    });
    if (res.status === 200) {
      setRooms(res.results.item);
      setPagination({
        ...pagination,
        page: res.results.page,
        total: res.results.total,
      });
    }
  };

  const apiGetRoomCategory = async () => {
    const res = await GET_ROOM_CATEGORIES({
      getAll: true,
      dormitoryId: dormitoryId,
    });
    if (res.status === 200) {
      setRoomCagetory(res.results);
    }
  };

  // Delete
  const handleDeleleRoom = (id: number) => {
    confirm({
      title: "ลบข้อมูลหรือไม่?",
      content: "คุณต้องการลบรายการนี้หรือไม่? ลบแล้วไม่สามารถย้อนกลับได้",
      onCancel: () => {},
      onOk: () => {
        apiDeleteRoomCategories(id);
      },
    });
  };
  const apiDeleteRoomCategories = async (id: number) => {
    const res = await DELETE_ROOM(id);
    if (res.status === 200) {
      apiGetRooms();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "ลบข้อมูลเรียบร้อยแล้ว!",
        showConfirmButton: false,
        timer: 1200,
      });
    }
  };

  const onSearchHandler = async (values: any) => {
    let search = {};
    if (values.status) {
      search = { ...search, status: values.status };
    }
    if (values.roomCategory) {
      search = { ...search, roomCategory: values.roomCategory };
    }
    if (values.roomNumber) {
      search = { ...search, roomNumber: values.roomNumber };
    }

    const res = await GET_ROOM({
      ...search,
      dormitoryId: dormitoryId,
      limit: pagination.limit,
    });
    if (res.status === 200) {
      setRooms(res.results.item);
      setPagination({
        ...pagination,
        page: res.results.page,
        total: res.results.total,
      });
    }
  };

  // Detail
  const handleDetailRoom = async (id: number) => {
    const res = await GET_ROOM_BY_ID(id);
    if (res.status === 200) {
      setRoomDetail(res.results);
    }
    setVisibleModalDetail(true);
  };

  // handle
  const handleChangePagination = async (filter: TFilterPagination) => {
    const { limit, page } = filter;
    let search = {};
    const values = formSearch.getFieldsValue();
    if (values.status) {
      search = { ...search, status: values.status };
    }
    if (values.roomCategory) {
      search = { ...search, roomCategory: values.roomCategory };
    }
    if (values.roomNumber) {
      search = { ...search, roomNumber: values.roomNumber };
    }

    const res = await GET_ROOM({ ...search, limit, page, dormitoryId });
    if (res.status === 200) {
      setRooms(res.results.item);
      setPagination({
        page: res.results.page,
        total: res.results.total,
        limit: limit,
      });
    }
  };

  const handleOnSubmitSearch = () => {
    formSearch.submit();
  };

  const columns = [
    {
      title: "หมายเลขห้อง",
      dataIndex: "roomNumber",
      sorter: (a: TRoom, b: TRoom) => a.roomNumber.localeCompare(b.roomNumber),
    },
    {
      title: "ประเภทห้อง",
      dataIndex: "categoryName",
      sorter: (a: TRoom, b: TRoom) =>
        a.categoryName.localeCompare(b.categoryName),
    },
    {
      title: "ชื่อ-นามสกุล(ผู้เช่า)",
      dataIndex: "renterName",

      render: (value: string, record: any) => {
        return <>{record.rentalStatus ? value : "-"}</>;
      },
    },
    {
      title: "สถานะ",
      dataIndex: "rentalStatus",
      align: "center" as "center",
      render: (value: boolean) => {
        return (
          <Box display="flex" justifyContent="center">
            {value ? (
              <Box
                py={0.5}
                px={4}
                sx={{
                  backgroundColor: "#88D4FF",
                  width: "140px",
                  textAlign: "center",
                  borderRadius: "40px",
                }}
              >
                ไม่ว่าง
              </Box>
            ) : (
              <Box
                py={0.5}
                px={4}
                sx={{
                  backgroundColor: "#AEF258",
                  width: "140px",
                  textAlign: "center",
                  borderRadius: "40px",
                }}
              >
                <Typography variant="body2">ว่าง</Typography>
              </Box>
            )}
          </Box>
        );
      },
    },
    {
      title: "รายละเอียด",
      dataIndex: "id",
      align: "center" as "center",
      render: (value: number, record: any) => {
        return (
          <>
            <img
              onClick={() => handleDetailRoom(record.id)}
              src={detailIcom}
              alt="btn-details"
              style={{ cursor: "pointer" }}
            />
          </>
        );
      },
    },
    {
      title: "จัดการ",
      dataIndex: "id",
      align: "center" as "center",
      width: "20%",
      render: (value: number, record: any) => {
        // record ไม่มี id
        return (
          <>
            <Row gutter={24} justify="space-between">
              <Col md={12}>
                <CreateRoom
                  onAfterSubmit={apiGetRooms}
                  id={record.id}
                  size="middle"
                  type="default"
                  styles={{
                    background: "#007DFF",
                    color: "#fff",
                    borderRadius: "8px",
                  }}
                />
              </Col>
              <Col md={12}>
                <Button
                  icon={<DeleteOutlined />}
                  type="default"
                  style={{
                    background: "#FF0000",
                    color: "#fff",
                    borderRadius: "8px",
                  }}
                  onClick={() => {
                    handleDeleleRoom(record.id);
                  }}
                >
                  ลบข้อมูล
                </Button>
              </Col>
            </Row>
          </>
        );
      },
    },
  ];

  return (
    <div>
      <PageHeader
        title={<h2>ห้อง</h2>}
        extra={[
          <Fragment key={1}>
            <CreateRoom
              onAfterSubmit={apiGetRooms}
              size="large"
              type="default"
              styles={{
                background: "#4CAF50",
                color: "#fff",
                borderRadius: "8px",
              }}
            />
          </Fragment>,
        ]}
      />
      <Fragment key={1}>
        <DetailRoom
          onAfterSubmit={apiGetRooms}
          room={roomDetail}
          open={visibleModalDetail}
          close={setVisibleModalDetail}
        />
      </Fragment>
      <Card style={{ border: "none" }}>
        <div style={{ width: "100%" }}>
          <Form
            form={formSearch}
            onFinish={onSearchHandler}
            onFinishFailed={(error: any) => {}}
          >
            <Row gutter={24} justify="end">
              <Col md={4}>
                <Form.Item name="status">
                  <Select
                    placeholder="สถานะ"
                    size="large"
                    onChange={() => handleOnSubmitSearch()}
                  >
                    <Select.Option value="true">ไม่ว่าง</Select.Option>
                    <Select.Option value="false">ว่าง</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col md={4}>
                <Form.Item name="roomCategory">
                  <Select
                    placeholder="ประเภทห้องพัก"
                    size="large"
                    onChange={() => handleOnSubmitSearch()}
                  >
                    {roomCategory &&
                      roomCategory.map((item: any, index: number) => (
                        <Select.Option value={item.id} key={index}>
                          {item.categoryName}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col md={6}>
                <Form.Item name="roomNumber">
                  <Input
                    onChange={() => handleOnSubmitSearch()}
                    size="large"
                    placeholder="ค้นหาตาม หมายเลขห้อง"
                    prefix={
                      <>
                        <AiOutlineSearch style={{ marginRight: 10 }} />
                      </>
                    }
                  />
                </Form.Item>
              </Col>
              <Col md={2}>
                <Button
                  size="large"
                  onClick={() => {
                    formSearch.resetFields();
                    apiGetRooms();
                  }}
                >
                  <GrPowerReset />
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="custom-antd-table">
          <Table
            columns={columns}
            dataSource={rooms}
            rowKey="id"
            pagination={false}
          />
        </div>
        <Row justify="end" style={{ marginTop: 20 }}>
          <Pagination
            defaultCurrent={pagination.page}
            current={pagination.page}
            total={pagination.total}
            pageSize={pagination.limit}
            showTotal={(total) => `Total ${total} items`}
            onChange={(page: number, pageSize: number) => {
              handleChangePagination({ limit: pageSize, page: page });
            }}
            showSizeChanger
          />
        </Row>
      </Card>
    </div>
  );
};

export default Room;
