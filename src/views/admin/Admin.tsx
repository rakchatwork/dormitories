import { Fragment, useEffect, useState } from "react";
// Alert
import Swal from "sweetalert2";

// icon
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
import { DeleteOutlined } from "@ant-design/icons";
import { AiOutlineSearch } from "react-icons/ai";
import { GrPowerReset } from "react-icons/gr";
import detailIcom from "./../../assets/images/icon/btn-details.svg";

// Pagination Type
import { paginationDefult, TFilterPagination } from "../../types/pagination";

// API
import { GET_USER, GET_USER_BY_ID, DELETE_USER } from "../../service/api/users";

// Components
import CreateAdmin from "./CreateAdmin";
import DetailAdmin from "./DetailAdmin";

// Type
import { TUsers } from "../../types/users";

const Admin = () => {
  const [formSearch] = Form.useForm();
  const { confirm } = Modal;
  const [users, setUsers] = useState<TUsers[]>([]);
  const [user, setUser] = useState<TUsers>();
  const [pagination, setPagination] =
    useState<TFilterPagination>(paginationDefult);
  const [visibleModalDetail, setVisibleModalDetail] = useState<boolean>(false);

  useEffect(() => {
    apiGetUserList();
  }, []);

  // Get List
  const apiGetUserList = async () => {
    const res = await GET_USER({ limit: pagination.limit, role: "manager" });
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
  const handleDetailAdmin = async (id: number) => {
    const res = await GET_USER_BY_ID(id);
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
  const managerDormitoryOnSearch = async (values: any) => {
    const res = await GET_USER({
      limit: pagination.limit,
      role: "manager",
      search: values.search,
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
      role: "manager",
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
              onClick={() => handleDetailAdmin(record.id)}
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
                <CreateAdmin
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
      <PageHeader
        title={<h2>ผู้จัดการหอพัก</h2>}
        extra={[
          <Fragment key={1}>
            <CreateAdmin
              onAfterSubmit={apiGetUserList}
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
        <DetailAdmin
          user={user}
          open={visibleModalDetail}
          close={setVisibleModalDetail}
        />
      </Fragment>
      <Card style={{ border: "none" }}>
        <div style={{ width: "100%" }}>
          <Form
            form={formSearch}
            onFinish={managerDormitoryOnSearch}
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

export default Admin;
