import React, { useState, CSSProperties } from "react";
// Alert
import Swal from "sweetalert2";

// Antd
import {
  Button,
  Card,
  Modal,
  Form,
  Row,
  Col,
  Input,
  Select,
  PageHeader,
} from "antd";
import { EditOutlined, PlusCircleOutlined } from "@ant-design/icons";

// API
import {
  CREATE_USER,
  GET_USER_BY_ID,
  UPDATE_USER,
} from "../../service/api/users";

// Type props
import { ButtonType } from "antd/lib/button";
import { SizeType } from "antd/lib/config-provider/SizeContext";
import { GET_ROLE } from "../../service/api/role";
type TProps = {
  onAfterSubmit?: () => void;
  id?: number;
  size?: SizeType;
  type?: ButtonType;
  styles?: CSSProperties;
};

const CreateAdmin = (props: TProps) => {
  const { onAfterSubmit, id, size, type, styles } = props;
  const [formCreateUser] = Form.useForm();
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [role, setRole] = useState<any>();
  const [requiredConfirm, setRequiredConfirm] = useState<boolean>(false);

  const showModal = () => {
    apiGetUserById();
    apiGetRole();
    setVisibleModal(true);
  };
  const hideModal = () => {
    setVisibleModal(false);
    formCreateUser.resetFields();
  };

  const apiGetRole = async () => {
    const res = await GET_ROLE({ role: ["manager"] });
    if (res.status === 200) {
      setRole(res.results.item[0]);
    }
  };

  // Get User by Id (Patch)
  const apiGetUserById = async () => {
    if (id) {
      const res = await GET_USER_BY_ID(id);
      if (res.status === 200) {
        const userInfo = res.results;

        formCreateUser.setFieldsValue({
          identityCard: userInfo.identityCard,
          username: userInfo.username,
          email: userInfo.email,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          tel: userInfo.tel,
          gender: userInfo.gender,
          address: userInfo.address,
        });
      }
    }
  };

  // Submit Post and Patch
  const handleOnSubmit = async (values: any) => {
    if (id) {
      // Patch User
      if (values.password) {
        const objectValue = {
          identityCard: values.identityCard,
          firstName: values.firstName,
          lastName: values.lastName,
          username: values.username,
          email: values.email,
          password: values.password,
          address: values.address,
          gender: values.gender,
          tel: values.tel,
        };
        const res = await UPDATE_USER(id, objectValue);
        if (res.status === 200) {
          onAfterSubmit && onAfterSubmit();
          hideModal();
          formCreateUser.resetFields();
          Swal.fire({
            position: "center",
            icon: "success",
            title: "แก้ไขข้อมูลเรียบร้อยแล้ว!",
            showConfirmButton: false,
            timer: 1200,
          });
        }
      } else {
        const objectValue = {
          identityCard: values.identityCard,
          firstName: values.firstName,
          lastName: values.lastName,
          username: values.username,
          email: values.email,
          address: values.address,
          gender: values.gender,
          tel: values.tel,
        };
        const res = await UPDATE_USER(id, objectValue);
        if (res.status === 200) {
          onAfterSubmit && onAfterSubmit();
          hideModal();
          formCreateUser.resetFields();
          Swal.fire({
            position: "center",
            icon: "success",
            title: "แก้ไขข้อมูลเรียบร้อยแล้ว!",
            showConfirmButton: false,
            timer: 1200,
          });
        }
      }
    } else {
      // Post User
      const objectValue = {
        identityCard: values.identityCard,
        firstName: values.firstName,
        lastName: values.lastName,
        username: values.username,
        email: values.email,
        password: values.password,
        address: values.address,
        gender: values.gender,
        tel: values.tel,
        role: role.id,
      };
      const res = await CREATE_USER(objectValue);
      if (res.status === 200) {
        onAfterSubmit && onAfterSubmit();
        hideModal();
        formCreateUser.resetFields();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "เพิ่มข้อมูลเรียบร้อยแล้ว!",
          showConfirmButton: false,
          timer: 1200,
        });
      }
    }
  };

  return (
    <>
      <Button
        onClick={showModal}
        size={size}
        type={type}
        style={styles}
        icon={id ? <EditOutlined /> : <PlusCircleOutlined />}
      >
        {id ? "แก้ไขข้อมูล" : "เพิ่มผู้จัดการหอพัก"}
      </Button>
      <Modal
        className="custom-ant-modal"
        visible={visibleModal}
        onCancel={hideModal}
        title={<h3>{id ? "แก้ไขข้อมูล" : "เพิ่มผู้จัดการหอพัก"}</h3>}
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
            <Row gutter={24} justify="center">
              <Col md={24}>
                <Form.Item
                  name="identityCard"
                  label="เลขบัตรประชาชน"
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกเลขบัตรประชาชน!",
                    },
                  ]}
                >
                  <Input size="large" placeholder="กรอกเลขบัตรประชาชน" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24} justify="start">
              <Col md={12}>
                <Form.Item
                  name="username"
                  label="ชื่อผู้ใช้"
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกชื่อผู้ใช้!",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    type="email"
                    placeholder="กรอกชื่อผู้ใช้"
                  />
                </Form.Item>
              </Col>
              <Col md={12}>
                <Form.Item
                  name="email"
                  label="อีเมล์"
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกอีเมล์!",
                    },
                  ]}
                >
                  <Input size="large" type="email" placeholder="กรอกอีเมล์" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24} justify="start">
              <Col md={12}>
                <Form.Item
                  name="password"
                  label="รหัสผ่าน"
                  rules={[
                    {
                      required: id ? false : true,
                      message: "กรุณากรอกรหัสผ่าน!",
                    },
                  ]}
                >
                  <Input.Password
                    size="large"
                    type="password"
                    placeholder="กรอกรหัสผ่าน"
                    onChange={(e) => {
                      if (e.target.value.length > 0) {
                        setRequiredConfirm(true);
                      } else {
                        setRequiredConfirm(false);
                      }
                    }}
                  />
                </Form.Item>
              </Col>
              <Col md={12}>
                <Form.Item
                  name="confirm"
                  label="ยืนยันรหัสผ่าน"
                  dependencies={["password"]}
                  rules={[
                    {
                      required: id ? requiredConfirm : true,
                      message: "กรุณากรอกยืนยันรหัสผ่าน!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }

                        return Promise.reject(
                          new Error("รหัสผ่านที่คุณป้อนไม่ตรงกัน!")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    size="large"
                    placeholder="กรอกยืนยันรหัสผ่าน"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24} justify="center">
              <Col md={12}>
                <Form.Item
                  name="firstName"
                  label="ชื่อจริง"
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกชื่อจริง!",
                    },
                  ]}
                >
                  <Input size="large" placeholder="กรอกชื่อจริง" />
                </Form.Item>
              </Col>
              <Col md={12}>
                <Form.Item
                  name="lastName"
                  label="นามสกุล"
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกนามสกุล!",
                    },
                  ]}
                >
                  <Input size="large" placeholder="กรอกนามสกุล" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24} justify="start">
              <Col md={10}>
                <Form.Item
                  name="tel"
                  label="หมายเลขโทรศัพท์"
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกหมายเลขโทรศัพท์!",
                    },
                  ]}
                >
                  <Input size="large" placeholder="กรอกหมายเลขโทรศัพท์" />
                </Form.Item>
              </Col>
              <Col md={5}>
                <Form.Item
                  name="gender"
                  label="เพศ"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาเลือกเพศ!",
                    },
                  ]}
                >
                  <Select size="large" placeholder="เลือกเพศ">
                    <Select.Option value="ชาย">ชาย</Select.Option>
                    <Select.Option value="หญิง">หญิง</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              {/* <Col md={5}>
                <Form.Item
                  name="role"
                  label="บทบาท"
                  // hidden={id ? true : false}
                  rules={[
                    {
                      required: true,
                      message: "กรุณาเลือกบทบาท!",
                    },
                  ]}
                >
                  <Select size="large" placeholder="บทบาท">
                    <Select.Option value="3">พนักงาน</Select.Option>
                    <Select.Option value="4">ผู้เช่า</Select.Option>
                  </Select>
                </Form.Item>
              </Col> */}
            </Row>

            <Row gutter={24} justify="start">
              <Col md={24}>
                <Form.Item
                  name="address"
                  label="ที่อยู่"
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกที่อยู่!",
                    },
                  ]}
                >
                  <Input.TextArea
                    rows={2}
                    size="large"
                    placeholder="กรอกที่อยู่..."
                  />
                </Form.Item>
              </Col>
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
      </Modal>
    </>
  );
};

export default CreateAdmin;
