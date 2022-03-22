import { Fragment, useEffect, useState } from "react";
// Alert
import Swal from "sweetalert2";

// Style
import {
  Button,
  Card,
  Col,
  Input,
  PageHeader,
  Row,
  Table,
  Form,
  Modal,
  Pagination,
} from "antd";
import { AiOutlineSearch } from "react-icons/ai";
import { GrPowerReset } from "react-icons/gr";
import { DeleteOutlined } from "@ant-design/icons";

// Style
import detailIcom from "./../../assets/images/icon/btn-details.svg";

// REDUX
import { useAppSelector } from "../../store/store";

// API
import {
  GET_USER,
  DELETE_USER,
  GET_USER_BY_ID_ROOM,
} from "../../service/api/users";

// Components
import CreateUsers from "./CreateUsers";
import DetailUser from "./DetailUser";

// Type
import { TUsers, TUserRoom } from "../../types/users";
import { paginationDefult, TFilterPagination } from "../../types/pagination";

const User = () => {
  const [formSearch] = Form.useForm();
  const { confirm } = Modal;
  const [users, setUsers] = useState<TUsers[]>([]);
  const [user, setUser] = useState<TUserRoom>();
  const [pagination, setPagination] =
    useState<TFilterPagination>(paginationDefult);
  const [visibleModalDetail, setVisibleModalDetail] = useState<boolean>(false);
  const { dormitoryId } = useAppSelector((state) => state.auth); //role,

  useEffect(() => {
    apiGetUserList();
  }, []);

  // Get List
  const apiGetUserList = async () => {
    const res = await GET_USER({
      order: "DESC",
      role: "renter",
      dormitoryId,
      limit: pagination.limit,
    });
    if (res.status === 200) {
      setUsers(res.results.item);
      setPagination({
        ...pagination,
        page: res.results.page,
        total: res.results.total,
      });
    }
  };

  // Detail id user
  const handleDetailUser = async (id: number) => {
    const res = await GET_USER_BY_ID_ROOM(id, { dormitoryId });
    if (res.status === 200) {
      setUser(res.results);
    }
    setVisibleModalDetail(true);
  };

  // Modal Delete
  const handleDeleleUser = (id: number) => {
    confirm({
      title: "ลบข้อมูลหรือไม่?",
      content: "คุณต้องการลบรายการนี้หรือไม่? ลบแล้วไม่สามารถย้อนกลับได้",
      onCancel: () => {},
      onOk: () => {
        apiDeleteUser(id);
      },
    });
  };
  // Delete User
  const apiDeleteUser = async (id: number) => {
    const res = await DELETE_USER(id);
    if (res.status === 200) {
      apiGetUserList();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "ลบข้อมูลเรียบร้อยแล้ว!",
        showConfirmButton: false,
        timer: 1200,
      });
    }
  };

  // Search
  const handleOnSubmitSearch = () => {
    formSearch.submit();
  };
  const userOnSearch = async (values: any) => {
    const res = await GET_USER({
      page: 1,
      role: "renter",
      dormitoryId,
      search: values.search,
      limit: pagination.limit,
    });
    if (res.status === 200) {
      setUsers(res.results.item);
      setPagination({
        ...pagination,
        page: res.results.page,
        total: res.results.total,
      });
    }
  };

  // Pagination
  const handleChangePagination = async (filter: TFilterPagination) => {
    const { limit, page } = filter;
    const formValue = formSearch.getFieldsValue();
    const res = await GET_USER({
      limit,
      page,
      role: "renter",
      dormitoryId,
      search: formValue.search,
    });
    if (res.status === 200) {
      setUsers(res.results.item);
      setPagination({
        limit: limit,
        page: res.results.page,
        total: res.results.total,
      });
    }
  };

  // Column
  const columns = [
    {
      title: "ชื่อ-นามสกุล",
      sorter: (a: TUsers, b: TUsers) => a.firstName.localeCompare(b.firstName),
      render: (value: number, record: any) => {
        return (
          <>
            {record.firstName} {record.lastName}
          </>
        );
      },
    },
    {
      title: "เบอร์โทร",
      dataIndex: "tel",
      sorter: (a: TUsers, b: TUsers) => a.tel.localeCompare(b.tel),
    },
    {
      title: "อีเมล์",
      dataIndex: "email",
      sorter: (a: TUsers, b: TUsers) => a.email.localeCompare(b.email),
    },
    {
      title: "รายละเอียด",
      dataIndex: "id",
      align: "center" as "center",
      render: (value: number, record: any) => {
        return (
          <>
            <img
              onClick={() => handleDetailUser(record.id)}
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
                <CreateUsers
                  onAfterSubmit={apiGetUserList}
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
                  icon={<DeleteOutlined />}
                  style={{
                    background: "#FF0000",
                    color: "#fff",
                    borderRadius: "8px",
                  }}
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
      <PageHeader title={<h2>ผู้เช่า</h2>} />
      <Fragment key={1}>
        <DetailUser
          user={user}
          open={visibleModalDetail}
          close={setVisibleModalDetail}
        />
      </Fragment>
      <Card style={{ border: "none" }}>
        <div style={{ width: "100%" }}>
          <Form
            form={formSearch}
            onFinish={userOnSearch}
            onFinishFailed={(error: any) => {}}
          >
            <Row gutter={24} justify="end">
              <Col md={8}>
                <Form.Item name="search">
                  <Input
                    onChange={() => handleOnSubmitSearch()}
                    size="large"
                    placeholder="ค้นหาตามชื่อ เบอร์โทร หรืออีเมล์"
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
                    apiGetUserList();
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
            dataSource={users}
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

export default User;
