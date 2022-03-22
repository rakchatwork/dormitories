import React, { useState, CSSProperties, useEffect } from "react";
// Style
import {
  Button,
  Card,
  Modal,
  Form,
  Row,
  Col,
  PageHeader,
  Select,
  Table,
  Pagination,
} from "antd";
import { ButtonType } from "antd/lib/button";
import { SizeType } from "antd/lib/config-provider/SizeContext";
import { HomeOutlined } from "@ant-design/icons";

// API
import {
  CREATE_USER_DORMITORY,
  DELETE_USER_DORMITORY,
} from "../../service/api/user-dormitory";
import { GET_USER } from "../../service/api/users";

// Type
import { TUsers } from "../../types/users";
import { TFilterPagination, TPagination } from "../../types/pagination";
type TProps = {
  id?: number;
  size?: SizeType;
  type?: ButtonType;
  styles?: CSSProperties;
};

const DormitoryManager = (props: TProps) => {
  const { id, size, type, styles } = props;
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [formCreateUser] = Form.useForm();
  const [userManager, setUserManager] = useState<TUsers[]>();
  const [users, setUsers] = useState<TUsers[]>([]);
  const [pagination, setPagination] = useState<TPagination>({});
  const { confirm } = Modal;

  useEffect(() => {
    apiGetUserManagerTable();
    apiGetUserDormitoryList();
  }, []);

  // Get List User
  const apiGetUserDormitoryList = async () => {
    const res = await GET_USER({
      limit: 10,
      page: 1,
      dormitoryId: id,
      role: "manager",
    });
    if (res.status === 200) {
      setUsers(res.results.item);
      setPagination({
        page: res.results.page,
        total: res.results.total,
      });
    }
  };

  // GET API UserManager
  const apiGetUserManagerTable = async () => {
    const res = await GET_USER({ getAll: false, role: "manager" });
    if (res.status === 200) {
      setUserManager(res.results.item);
    }
  };

  // DELETE
  const handleDeleleUserDormitory = (id: number) => {
    confirm({
      title: "ลบข้อมูลหรือไม่?",
      content: "คุณต้องการลบรายการนี้หรือไม่? ลบแล้วไม่สามารถย้อนกลับได้",
      onCancel: () => {},
      onOk: () => {
        apiDeleteUserDormitory(id);
      },
    });
  };
  const apiDeleteUserDormitory = async (id: number) => {
    const res = await DELETE_USER_DORMITORY(id);
    if (res.status === 200) {
      apiGetUserDormitoryList();
    }
  };

  const showModal = () => {
    setVisibleModal(true);
  };
  const hideModal = () => {
    formCreateUser.resetFields();
    setVisibleModal(false);
  };

  const handleOnSubmit = async (values: any) => {
    const objValue = { ...values, dormitory: id };

    const res = await CREATE_USER_DORMITORY(objValue);
    if (res.status === 200) {
      apiGetUserDormitoryList();
      formCreateUser.resetFields();
    }
  };

  // Pagination
  const handleChangePagination = async (filter: TFilterPagination) => {
    const { limit, page } = filter;
    const res = await GET_USER({
      limit,
      page,
      dormitoryId: id,
      role: "manager",
    });
    if (res.status === 200) {
      setUsers(res.results.item);
      setPagination({
        page: res.results.page,
        total: res.results.total,
      });
    }
  };

  const columns = [
    {
      title: "ชื่อผู้จัดการ",
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
      title: "อีเมล",
      dataIndex: "email",
      sorter: (a: TUsers, b: TUsers) => a.email.localeCompare(b.email),
    },
    {
      title: "จัดการ",
      dataIndex: "id",
      width: "10%",
      render: (value: number, record: any) => {
        return (
          <>
            <Row gutter={24} justify="space-between">
              <Col md={24}>
                <Button
                  size="middle"
                  type="default"
                  style={{ background: "#FF0000", color: "#fff" }}
                  onClick={() => {
                    handleDeleleUserDormitory(record.userDormitory);
                  }}
                >
                  ลบผู้ดูแล
                </Button>
              </Col>
            </Row>
          </>
        );
      },
    },
  ];

  return (
    <>
      <Button
        onClick={showModal}
        size={size}
        type={type}
        style={styles}
        icon={<HomeOutlined />}
      >
        จัดการหอพัก
      </Button>
      <Modal
        className="custom-ant-modal"
        visible={visibleModal}
        onCancel={hideModal}
        title={<h3>จัดการหอพัก</h3>}
        width={750}
        footer={false}
      >
        <Card
          style={{
            borderRadius: 20,
            border: "solid 2px #000",
          }}
        >
          <Form
            layout="vertical"
            form={formCreateUser}
            onFinish={handleOnSubmit}
          >
            <Row gutter={24}>
              <Col md={24}>
                <Form.Item name="user" label="เลือกผู้จัดการ">
                  <Select
                    placeholder="เลือกผู้จัดการ"
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
                  >
                    {userManager &&
                      userManager.map((userItem: TUsers) => (
                        <Select.Option value={userItem.id} key={userItem.id}>
                          {`${userItem.firstName} ${userItem.lastName} (${userItem.email})`}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24} justify="start">
              <Col md={24}></Col>
            </Row>
          </Form>
        </Card>
        <PageHeader
          extra={[
            <Button
              style={{ background: "#FF0000", color: "#fff" }}
              key={1}
              onClick={hideModal}
            >
              ยกเลิก
            </Button>,
            <Button
              htmlType="submit"
              key={2}
              onClick={() => {
                formCreateUser.submit();
              }}
              style={{ background: "#007DFF", color: "#fff" }}
            >
              บันทึก
            </Button>,
          ]}
        />
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
      </Modal>
    </>
  );
};

export default DormitoryManager;
