import { Fragment, useEffect, useState } from "react";
import moment from "moment";

// Alert
import Swal from "sweetalert2";

// Icon
import { GrPowerReset } from "react-icons/gr";
import { AiOutlineSearch } from "react-icons/ai";
import { DeleteOutlined } from "@ant-design/icons";
import detailIcom from "./../../assets/images/icon/btn-details.svg";

// Style
import {
  Button,
  Card,
  Col,
  DatePicker,
  Input,
  PageHeader,
  Row,
  Select,
  Table,
  Form,
  Modal,
  Pagination,
} from "antd";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// Type
import { TParcels } from "../../types/parcels";
import { TRoom } from "../../types/room";
import { paginationDefult, TFilterPagination } from "../../types/pagination";

// API
import {
  GET_PARCELS,
  DELETE_PARCELS,
  GET_PARCELS_BY_ID,
} from "../../service/api/parcels";
import { GET_ROOM } from "../../service/api/room";

// REDUX
import { useAppSelector } from "../../store/store";

// Components
import CreateParcels from "./CreateParcels";
import DetailParcel from "./DetailParcel";

const Parcels = () => {
  const [formSearch] = Form.useForm();
  const { confirm } = Modal;
  const [parcels, setParcels] = useState<TParcels[]>([]);
  const [pagination, setPagination] =
    useState<TFilterPagination>(paginationDefult);
  const [room, setRoom] = useState<TRoom[]>();
  const { dormitoryId } = useAppSelector((state) => state.auth);

  const [visibleModalDetail, setVisibleModalDetail] = useState<boolean>(false);
  const [parcel, setParcel] = useState<TParcels>();

  useEffect(() => {
    apiGetParcelList();
    apiGetRoom();
  }, []);

  // GET Parcel List
  const apiGetParcelList = async () => {
    const res = await GET_PARCELS({
      limit: pagination.limit,
      page: pagination.page,
      dormitoryId,
    });
    if (res.status === 200) {
      setParcels(res.results.item);
      setPagination({
        ...pagination,
        page: res.results.page,
        total: res.results.total,
      });
    }
  };

  const onSearchHandler = async (values: any) => {
    let search = {};
    if (values.date) {
      search = { ...search, date: moment(values.date).format("YYYY-MM-DD") };
    }
    if (values.status) {
      search = { ...search, status: values.status };
    }
    if (values.room) {
      search = { ...search, room: values.room };
    }
    if (values.passCode) {
      search = { ...search, passCode: values.passCode };
    }
    const res = await GET_PARCELS({
      ...search,
      dormitoryId: dormitoryId,
      limit: pagination.limit,
    });
    if (res.status === 200) {
      setParcels(res.results.item);
      setPagination({
        ...pagination,
        page: res.results.page,
        total: res.results.total,
      });
    }
  };

  // GET ROOM
  const apiGetRoom = async () => {
    const res = await GET_ROOM({ getAll: false, status: true, dormitoryId });
    if (res.status === 200) {
      setRoom(res.results.item);
    }
  };

  // DELETE
  const handleDeleleParcel = (id: number) => {
    confirm({
      title: "ลบข้อมูลหรือไม่?",
      content: "คุณต้องการลบรายการนี้หรือไม่? ลบแล้วไม่สามารถย้อนกลับได้",
      onCancel: () => {},
      onOk: () => {
        apiDeleteParcel(id);
      },
    });
  };
  const apiDeleteParcel = async (id: number) => {
    const res = await DELETE_PARCELS(id);
    if (res.status === 200) {
      apiGetParcelList();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "ลบข้อมูลเรียบร้อยแล้ว!",
        showConfirmButton: false,
        timer: 1200,
      });
    }
  };

  // Detail id parcel
  const handleDetailParcel = async (id: number) => {
    const res = await GET_PARCELS_BY_ID(id);
    if (res.status === 200) {
      setParcel(res.results);
    }
    setVisibleModalDetail(true);
  };

  // Pagination
  const handleChangePagination = async (filter: {
    limit: number;
    page: number;
  }) => {
    const { limit, page } = filter;
    let search = {};
    const values = formSearch.getFieldsValue();
    if (values.date) {
      search = {
        ...search,
        date: moment(values.date).format("YYYY-MM-DD"),
      };
    }
    if (values.status) {
      search = { ...search, status: values.status };
    }
    if (values.room) {
      search = { ...search, room: values.room };
    }
    if (values.passCode) {
      search = { ...search, passCode: values.passCode };
    }
    const res = await GET_PARCELS({
      ...search,
      dormitoryId: dormitoryId,
      limit,
      page,
    });
    if (res.status === 200) {
      setParcels(res.results.item);
      setPagination({
        page: res.results.page,
        total: res.results.total && res.results.total,
        limit: limit,
      });
    }
  };

  // Search
  const handleOnSubmitSearch = () => {
    formSearch.submit();
  };

  const columns = [
    {
      title: "รหัสอ้างอิงพัสดุ",
      dataIndex: "passCode",
      sorter: (a: TParcels, b: TParcels) =>
        a.passCode.localeCompare(b.passCode),
    },
    {
      title: "ห้องพัก",
      dataIndex: "roomNumber",
      sorter: (a: TParcels, b: TParcels) =>
        a.roomNumber.localeCompare(b.roomNumber),
    },
    {
      title: "วันที่พัสดุมาส่ง",
      dataIndex: "createdAt",
      render: (value: Date) => {
        return <>{moment(value).format("YYYY-MM-DD")}</>;
      },
      sorter: (a: TParcels, b: TParcels) =>
        moment(a.createdAt)
          .format("YYYY-MM-DD")
          .localeCompare(moment(b.createdAt).format("YYYY-MM-DD")),
    },
    {
      title: "สถานะ",
      dataIndex: "receiveStatus",
      align: "center" as "center",
      render: (value: boolean) => {
        return (
          <Box display="flex" justifyContent="center">
            {value ? (
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
                <Typography variant="body2">รับแล้ว</Typography>
              </Box>
            ) : (
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
                ยังไม่ได้รับ
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
              onClick={() => handleDetailParcel(record.id)}
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
      width: "10%",
      render: (value: number, record: any) => {
        return (
          <>
            <Row gutter={24} justify="space-between">
              <Col md={24}>
                <Button
                  icon={<DeleteOutlined />}
                  type="default"
                  style={{
                    background: "#FF0000",
                    color: "#fff",
                    borderRadius: "8px",
                  }}
                  onClick={() => {
                    handleDeleleParcel(record.id);
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
        title={<h2>พัสดุ</h2>}
        extra={[
          <Fragment key={1}>
            <CreateParcels onAfterSubmit={apiGetParcelList} />
          </Fragment>,
        ]}
      />
      <Fragment key={1}>
        <DetailParcel
          onAfterSubmit={apiGetParcelList}
          parcel={parcel}
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
              <Col md={3}>
                <Form.Item name="date">
                  <DatePicker
                    format="YYYY-MM-DD"
                    size="large"
                    onChange={() => handleOnSubmitSearch()}
                  />
                </Form.Item>
              </Col>
              <Col md={4}>
                <Form.Item name="status">
                  <Select
                    placeholder="สถานะ"
                    size="large"
                    onChange={() => handleOnSubmitSearch()}
                  >
                    <Select.Option value="true">รับแล้ว</Select.Option>
                    <Select.Option value="false">ยังไม่ได้รับ</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col md={4}>
                <Form.Item name="room">
                  <Select
                    placeholder="ห้อง"
                    size="large"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input: any, option: any) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    filterSort={(optionA, optionB) =>
                      optionA.children
                        .toLowerCase()
                        .localeCompare(optionB.children.toLowerCase())
                    }
                    onChange={() => handleOnSubmitSearch()}
                  >
                    {room &&
                      room.map((roomItem: TRoom) => (
                        // ต้องมี id roomItem.id ใช้ไม่ได้
                        <Select.Option value={roomItem.id} key={roomItem.id}>
                          {roomItem.roomNumber}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col md={5}>
                <Form.Item name="passCode">
                  <Input
                    onChange={() => handleOnSubmitSearch()}
                    size="large"
                    placeholder="ค้นหา Pass Code"
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
                    apiGetParcelList();
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
            dataSource={parcels}
            rowKey="id"
            pagination={false}
          />
        </div>

        <Row justify="end" style={{ marginTop: 20 }}>
          <Pagination
            defaultCurrent={pagination.page}
            current={pagination.page}
            total={pagination.total}
            showTotal={(total) => `Total ${total} items`}
            pageSize={Number(pagination.limit)}
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

export default Parcels;
