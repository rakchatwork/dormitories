import { Fragment, useEffect, useState } from "react";
// Alert
import Swal from "sweetalert2";

// Style
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  PageHeader,
  Pagination,
  Row,
  Table,
  Modal,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { Typography } from "@mui/material";

// Icons
import { GrPowerReset } from "react-icons/gr";
import { AiOutlineSearch } from "react-icons/ai";
import detailIcom from "./../../../assets/images/icon/btn-details.svg";

// Api
import {
  GET_ROOM_CATEGORIES,
  GET_ROOM_CATEFORIES_BY_ID,
  DELETE_ROOM_CATEGORIES,
} from "../../../service/api/room-categories";

// Type
import { TRoomCategory } from "../../../types/room-category";
import { paginationDefult, TFilterPagination } from "../../../types/pagination";

// Components
import CreateRoomCategory from "./CreateRoomCategory";
import DetailRoomCategories from "./DetailRoomCategories";

// REDUX
import { useAppSelector } from "../../../store/store";

const RoomCategory = () => {
  const [formSearch] = Form.useForm();
  const { confirm } = Modal;
  const [roomCategories, setRoomCategories] = useState<TRoomCategory[]>();
  const [roomCate, setRoomCate] = useState<TRoomCategory>();
  const [visibleModalDetail, setVisibleModalDetail] = useState<boolean>(false);
  const [pagination, setPagination] =
    useState<TFilterPagination>(paginationDefult);
  const nf = Intl.NumberFormat();
  const { dormitoryId } = useAppSelector((state) => state.auth);

  useEffect(() => {
    apiGetRoomCategories();
  }, []);

  // Get
  const apiGetRoomCategories = async () => {
    const res = await GET_ROOM_CATEGORIES({
      limit: pagination.limit,
      page: pagination.page,
      dormitoryId,
    });
    if (res.status === 200) {
      setRoomCategories(res.results.item);
      setPagination({
        ...pagination,
        page: res.results.page,
        total: res.results.total,
      });
    }
  };

  // Search
  const onSearchRoomCategories = async (values: any) => {
    const res = await GET_ROOM_CATEGORIES({
      limit: pagination.limit,
      categoryName: values.categoryName,
      dormitoryId,
    });
    if (res.status === 200) {
      setRoomCategories(res.results.item);
      setPagination({
        ...pagination,
        page: res.results.page,
        total: res.results.total,
      });
    }
  };

  // Delete
  const handleDeleleUser = (id: number) => {
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
    const res = await DELETE_ROOM_CATEGORIES(id);
    if (res.status === 200) {
      apiGetRoomCategories();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "ลบข้อมูลเรียบร้อยแล้ว!",
        showConfirmButton: false,
        timer: 1200,
      });
    }
  };

  // Detail
  const handleDetailRoomCategories = async (id: number) => {
    const res = await GET_ROOM_CATEFORIES_BY_ID(id);
    if (res.status === 200) {
      setRoomCate(res.results);
    }
    setVisibleModalDetail(true);
  };

  // handle
  const handleChangePagination = async (filter: TFilterPagination) => {
    const { limit, page } = filter;
    const formValue = formSearch.getFieldsValue();
    const res = await GET_ROOM_CATEGORIES({
      limit,
      page,
      categoryName: formValue.categoryName,
      dormitoryId,
    });
    if (res.status === 200) {
      setRoomCategories(res.results.item);
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
      title: "ประเภทห้อง",
      dataIndex: "categoryName",
      sorter: (a: TRoomCategory, b: TRoomCategory) =>
        a.categoryName.localeCompare(b.categoryName),
    },
    {
      title: "ราคา / เดือน",
      dataIndex: "price",
      sorter: (a: TRoomCategory, b: TRoomCategory) =>
        a.price.toString().localeCompare(b.price.toString()),
      render: (value: number, record: any) => {
        return (
          <>
            <Typography>{nf.format(record.price)} ฿</Typography>
          </>
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
              onClick={() => handleDetailRoomCategories(record.id)}
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
        return (
          <>
            <Row gutter={24} justify="space-between">
              <Col md={12}>
                <CreateRoomCategory
                  onAfterSubmit={apiGetRoomCategories}
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
                  type="default"
                  style={{
                    background: "#FF0000",
                    color: "#fff",
                    borderRadius: "8px",
                  }}
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    handleDeleleUser(record.id);
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
        title={<h2>ประเภทห้อง</h2>}
        extra={[
          <Fragment key={1}>
            <CreateRoomCategory
              onAfterSubmit={apiGetRoomCategories}
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
        <DetailRoomCategories
          roomCate={roomCate}
          open={visibleModalDetail}
          close={setVisibleModalDetail}
        />
      </Fragment>
      <Card style={{ border: "none" }}>
        <div style={{ width: "100%" }}>
          <Form
            form={formSearch}
            onFinish={onSearchRoomCategories}
            onFinishFailed={(error: any) => {}}
          >
            <Row gutter={24} justify="end">
              <Col md={7}>
                <Form.Item name="categoryName">
                  <Input
                    onChange={() => handleOnSubmitSearch()}
                    size="large"
                    placeholder="ค้นหาตามประเภทห้องพัก"
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
                    apiGetRoomCategories();
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
            dataSource={roomCategories}
            rowKey="id"
            pagination={false}
          />
        </div>
        <Row justify="end" style={{ marginTop: 20 }}>
          <Pagination
            defaultCurrent={pagination.page}
            current={pagination.page}
            total={pagination.total}
            pageSize={Number(pagination.limit)}
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

export default RoomCategory;
