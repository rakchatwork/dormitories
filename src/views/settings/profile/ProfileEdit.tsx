import React, { Fragment, useEffect, useState } from "react";
// Alert
import Swal from "sweetalert2";

// Style
import { Col, Input, Row, Select, Form, Card, Button, PageHeader } from "antd";
import { Grid } from "@mui/material";

// API
import { UPDATE_USER } from "../../../service/api/users";
import { TUsers } from "../../../types/users";

// REDUX
import { useAppDispatch } from "../../../store/store";
import { editUserInfo } from "../../../store/slices/userSlice";

type TProps = {
  onAfterSubmit?: () => void;
  user?: TUsers;
};

function ProfileEdit(props: TProps) {
  const { onAfterSubmit, user } = props;
  const dispatch = useAppDispatch();
  const [formCreateUser] = Form.useForm();
  const [requiredConfirm, setRequiredConfirm] = useState<boolean>(false);

  useEffect(() => {
    formCreateUser.setFieldsValue({
      identityCard: user?.identityCard,
      username: user?.username,
      email: user?.email,
      firstName: user?.firstName,
      lastName: user?.lastName,
      tel: user?.tel,
      gender: user?.gender,
      address: user?.address,
    });
  }, [user]);

  //   PATCH
  const handleOnSubmit = async (values: any) => {
    if (values.password && values.confirm) {
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
        role: user?.role.id,
      };
      if (user?.id) {
        const res = await UPDATE_USER(user.id, objectValue);
        if (res.status === 200) {
          onAfterSubmit && onAfterSubmit();
          let payload = { firstName: "", lastName: "" };
          payload = {
            ...payload,
            firstName: values.firstName,
            lastName: values.lastName,
          };
          dispatch(editUserInfo(payload));
          formCreateUser.setFieldsValue({
            password: "",
            confirm: "",
          });
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
      const objectValue = {
        identityCard: values.identityCard,
        firstName: values.firstName,
        lastName: values.lastName,
        username: values.username,
        email: values.email,
        address: values.address,
        gender: values.gender,
        tel: values.tel,
        role: user?.role.id,
      };
      if (user?.id) {
        const res = await UPDATE_USER(user.id, objectValue);
        if (res.status === 200) {
          onAfterSubmit && onAfterSubmit();
          let payload = { firstName: "", lastName: "" };
          payload = {
            ...payload,
            firstName: values.firstName,
            lastName: values.lastName,
          };
          dispatch(editUserInfo(payload));
          Swal.fire({
            position: "center",
            icon: "success",
            title: "แก้ไขข้อมูลเรียบร้อยแล้ว!",
            showConfirmButton: false,
            timer: 1200,
          });
        }
      }
    }
  };

  return (
    <>
      <Grid item xs={7}>
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
                      required: requiredConfirm,
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
              <Col md={6}>
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
      </Grid>
    </>
  );
}

export default ProfileEdit;
