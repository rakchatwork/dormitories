import React, { useState, useEffect } from "react";
// Alert
import Swal from "sweetalert2";

// Icon
import { AiOutlineSearch } from "react-icons/ai";

// Style
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
  Divider,
  DatePicker,
} from "antd";
import { TRoom } from "../../../types/room";
import { Box, Typography, Grid } from "@mui/material";

// API
import { GET_USER, CREATE_USER } from "../../../service/api/users";
import {
  CREATE_USER_ROOM,
  DELETE_USER_ROOM,
} from "../../../service/api/user-room";

// Type
import { TUsers } from "../../../types/users";
import { GET_ROLE } from "../../../service/api/role";
type TProps = {
  onAfterSubmit?: () => void;
  room?: TRoom;
  open: boolean;
  close: (value: boolean) => void;
};

const DetailRoom = (props: TProps) => {
  const { onAfterSubmit, room, open, close } = props;
  const [formCreateUser] = Form.useForm();
  const [identityState, setIdentityState] = useState<string>("");
  const [users, setUsers] = useState<TUsers[]>([]);
  const [userId, setUserId] = useState<number>(0);
  const roomEmpty = room?.user.firstName === undefined;
  const nf = Intl.NumberFormat();
  const [role, setRole] = useState<any>();
  const { confirm } = Modal;

  useEffect(() => {
    apiGetUserList();
    apiGetRole();
  }, []);

  const apiGetRole = async () => {
    const res = await GET_ROLE({ role: ["renter"] });
    if (res.status === 200) {
      setRole(res.results.item[0]);
    }
  };

  // Get List
  const apiGetUserList = async () => {
    const res = await GET_USER({
      getAll: false,
      limit: 10,
      page: 1,
      role: "renter",
    });
    if (res.status === 200) {
      setUsers(res.results.item);
    }
  };

  const handleOnSubmit = async (values: any) => {
    if (userId === 0) {
      // POST User
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
        const userCreateId: number = res.results.id;
        const response = await CREATE_USER_ROOM({
          ...values,
          deposit: Number(values.deposit),
          user: userCreateId,
          room: room?.id,
        });
        if (response.status === 200) {
          hideModal();
          formCreateUser.resetFields();
          onAfterSubmit && onAfterSubmit();
          setUserId(0);
          Swal.fire({
            position: "center",
            icon: "success",
            title: "????????????????????????????????????????????????????????????????????????!",
            showConfirmButton: false,
            timer: 1200,
          });
        }
      }
    } else {
      const res = await CREATE_USER_ROOM({
        ...values,
        deposit: Number(values.deposit),
        user: userId,
        room: room?.id,
      });

      if (res.status === 200) {
        onAfterSubmit && onAfterSubmit();
        hideModal();
        formCreateUser.resetFields();
        setUserId(0);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "????????????????????????????????????????????????????????????????????????!",
          showConfirmButton: false,
          timer: 1200,
        });
      }
    }
  };

  // DELETE userRoom
  const handleDeleteUserRoom = async (id: any) => {
    confirm({
      title: "??????????????????????????????????????????????",
      content: "????????????????????????????????????????????????????????????????????????????????????? ??????????????????????????????????????????????????????????????????????????????",
      onCancel: () => {},
      onOk: () => {
        apiDeleteUserRoom(id);
      },
    });
  };
  // Delete User
  const apiDeleteUserRoom = async (id: number) => {
    const res = await DELETE_USER_ROOM(id);
    if (res.status === 200) {
      apiGetUserList();
      onAfterSubmit && onAfterSubmit();
      close(false);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "???????????????????????????????????????????????????????????????!",
        showConfirmButton: false,
        timer: 1200,
      });
    }
  };

  const hideModal = () => {
    close(false);
    formCreateUser.resetFields();
  };

  const searchUser = () => {
    if (users) {
      const user = users.find((item) => item.identityCard === identityState);
      if (user) {
        setUserId(user.id);
        formCreateUser.setFieldsValue({
          identityCard: user?.identityCard,
          username: user?.username,
          email: user?.email,
          password: "**********",
          confirm: "**********",
          firstName: user?.firstName,
          lastName: user?.lastName,
          tel: user?.tel,
          gender: user?.gender,
          address: user?.address,
        });
      } else {
        formCreateUser.resetFields();
      }
    }
  };

  return (
    <>
      <Modal
        className="custom-ant-modal"
        visible={open}
        onCancel={hideModal}
        title={<h3>??????????????????????????????????????????</h3>}
        width={1200}
        footer={false}
      >
        <Grid container>
          <Grid item xs={5}>
            <Card
              className="custom-card"
              style={{
                display: "flex",
                flexWrap: "wrap",
                borderRadius: 20,
                border: "solid 2px #000",
              }}
            >
              <Box sx={{ mb: "14px" }}>
                <Box sx={{ mb: "8px" }}>
                  <Typography sx={{ mr: "10px", fontWeight: "600" }}>
                    ?????????????????????????????????
                  </Typography>
                </Box>
                <Box sx={{ ml: "16px" }}>
                  <Typography sx={{ mr: "10px" }}>
                    {room?.roomNumber}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", mb: "14px" }}>
                <Box width="200px">
                  <Box sx={{ mb: "8px" }}>
                    <Typography sx={{ fontWeight: "600" }}>
                      ??????????????????????????????
                    </Typography>
                  </Box>
                  <Box sx={{ ml: "16px" }}>
                    <Typography sx={{ mr: "10px" }}>
                      {room?.roomCategory.categoryName}
                    </Typography>
                  </Box>
                </Box>
                <Box width="200px">
                  <Box sx={{ mb: "8px" }}>
                    <Typography sx={{ mr: "10px", fontWeight: "600" }}>
                      ????????????/???????????????
                    </Typography>
                  </Box>
                  <Box sx={{ ml: "16px" }}>
                    <Typography sx={{ mr: "10px" }}>
                      {nf.format(room?.roomCategory.price)} ???
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box mb={10}>
                <Box sx={{ mb: "8px" }}>
                  <Typography sx={{ mr: "10px", fontWeight: "600" }}>
                    ??????????????????????????????
                  </Typography>
                </Box>
                <Box sx={{ ml: "16px" }}>
                  <Typography sx={{ mr: "10px", wordWrap: "break-word" }}>
                    {room?.roomCategory.details}
                  </Typography>
                </Box>
              </Box>
              <Divider />
              <Box sx={{ display: "flex", mb: "14px" }}>
                <Box width="200px">
                  <Box sx={{ mb: "8px" }}>
                    <Typography sx={{ mr: "10px", fontWeight: "600" }}>
                      ?????????????????????
                    </Typography>
                  </Box>
                  <Box sx={{ ml: "16px" }}>
                    <Typography sx={{ mr: "10px" }}>
                      {!roomEmpty ? (
                        <>
                          {room?.user.firstName} {room?.user.lastName}
                        </>
                      ) : (
                        <>-</>
                      )}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={0.3}></Grid>
          {/* Form */}
          {!roomEmpty ? (
            <>
              <Grid item xs>
                <Card
                  className="custom-card"
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    borderRadius: 20,
                    border: "solid 2px #000",
                    width: "100%",
                  }}
                >
                  <Box sx={{ display: "flex", mb: "14px" }}>
                    <Box width="200px">
                      <Box sx={{ mb: "8px" }}>
                        <Typography sx={{ fontWeight: "600" }}>
                          ??????????????????????????????????????????
                        </Typography>
                      </Box>
                      <Box sx={{ ml: "16px" }}>
                        <Typography sx={{ mr: "10px" }}>
                          {room?.user.identityCard}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", mb: "14px" }}>
                    <Box width="200px">
                      <Box sx={{ mb: "8px" }}>
                        <Typography sx={{ fontWeight: "600" }}>
                          ??????????????????????????????
                        </Typography>
                      </Box>
                      <Box sx={{ ml: "16px" }}>
                        <Typography sx={{ mr: "10px" }}>
                          {room?.user.username}
                        </Typography>
                      </Box>
                    </Box>
                    <Box width="200px">
                      <Box sx={{ mb: "8px" }}>
                        <Typography sx={{ mr: "10px", fontWeight: "600" }}>
                          ???????????????
                        </Typography>
                      </Box>
                      <Box sx={{ ml: "16px" }}>
                        <Typography sx={{ mr: "10px" }}>
                          {room?.user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", mb: "14px" }}>
                    <Box width="200px">
                      <Box sx={{ mb: "8px" }}>
                        <Typography sx={{ mr: "10px", fontWeight: "600" }}>
                          ????????????-?????????????????????
                        </Typography>
                      </Box>
                      <Box sx={{ ml: "16px" }}>
                        <Typography sx={{ mr: "10px" }}>
                          {room?.user.firstName} {room?.user.lastName}
                        </Typography>
                      </Box>
                    </Box>
                    <Box width="180px" mr="20px">
                      <Box sx={{ mb: "8px" }}>
                        <Typography sx={{ mr: "10px", fontWeight: "600" }}>
                          ????????????????????????
                        </Typography>
                      </Box>
                      <Box sx={{ ml: "16px" }}>
                        <Typography sx={{ mr: "10px" }}>
                          {room?.user?.tel}
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Box sx={{ mb: "8px" }}>
                        <Typography sx={{ mr: "10px", fontWeight: "600" }}>
                          ?????????
                        </Typography>
                      </Box>
                      <Box sx={{ ml: "16px" }}>
                        <Typography sx={{ mr: "10px" }}>
                          {room?.user.gender}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box>
                    <Box sx={{ mb: "8px" }}>
                      <Typography sx={{ mr: "10px", fontWeight: "600" }}>
                        ?????????????????????
                      </Typography>
                    </Box>
                    <Box sx={{ ml: "16px" }}>
                      <Typography sx={{ mr: "10px", wordWrap: "break-word" }}>
                        {room?.user.address}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider />

                  <Box sx={{ display: "flex", mb: "14px" }}>
                    <Box width="200px">
                      <Box sx={{ mb: "8px" }}>
                        <Typography sx={{ mr: "10px", fontWeight: "600" }}>
                          ???????????????????????????????????????
                        </Typography>
                      </Box>
                      <Box sx={{ ml: "16px" }}>
                        <Typography sx={{ mr: "10px" }}>
                          {room?.user.startDate}
                        </Typography>
                      </Box>
                    </Box>
                    <Box width="180px" mr="20px">
                      <Box sx={{ mb: "8px" }}>
                        <Typography sx={{ mr: "10px", fontWeight: "600" }}>
                          ?????????????????????????????????????????????????????????????????????
                        </Typography>
                      </Box>
                      <Box sx={{ ml: "16px" }}>
                        <Typography sx={{ mr: "10px" }}>
                          {room?.user?.endDate}
                        </Typography>
                      </Box>
                    </Box>
                    <Box width="180px">
                      <Box sx={{ mb: "8px" }}>
                        <Typography sx={{ mr: "10px", fontWeight: "600" }}>
                          ???????????????????????????(?????????)
                        </Typography>
                      </Box>
                      <Box sx={{ ml: "16px" }}>
                        <Typography sx={{ mr: "10px" }}>
                          {nf.format(Number(room?.user.deposit))} ???
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs>
                <Card
                  className="custom-card"
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    borderRadius: 20,
                    border: "solid 2px #000",
                    width: "100%",
                  }}
                >
                  <Form
                    layout="vertical"
                    form={formCreateUser}
                    onFinish={handleOnSubmit}
                  >
                    <Grid container>
                      <Grid item xs={10.4}>
                        <Form.Item name="searchText">
                          <Input
                            onChange={(e) => setIdentityState(e.target.value)}
                            size="large"
                            placeholder="?????????????????????????????????????????????????????????"
                            prefix={
                              <>
                                <AiOutlineSearch style={{ marginRight: 10 }} />
                              </>
                            }
                          />
                        </Form.Item>
                      </Grid>
                      <Grid item xs={0.2}></Grid>
                      <Grid item xs>
                        <Button size="large" onClick={searchUser}>
                          ???????????????
                        </Button>
                      </Grid>
                    </Grid>
                    <Row gutter={24} justify="center">
                      <Col md={24}>
                        <Form.Item
                          name="identityCard"
                          label="??????????????????????????????????????????"
                          rules={[
                            {
                              required: true,
                              message: "?????????????????????????????????????????????????????????????????????!",
                            },
                          ]}
                        >
                          <Input
                            size="large"
                            placeholder="??????????????????????????????????????????????????????"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24} justify="start">
                      <Col md={12}>
                        <Form.Item
                          name="username"
                          label="??????????????????????????????"
                          rules={[
                            {
                              required: true,
                              message: "?????????????????????????????????????????????????????????!",
                            },
                          ]}
                        >
                          <Input
                            size="large"
                            type="email"
                            placeholder="??????????????????????????????????????????"
                          />
                        </Form.Item>
                      </Col>
                      <Col md={12}>
                        <Form.Item
                          name="email"
                          label="??????????????????"
                          rules={[
                            {
                              required: true,
                              message: "?????????????????????????????????????????????!",
                            },
                          ]}
                        >
                          <Input
                            size="large"
                            type="email"
                            placeholder="??????????????????????????????"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24} justify="start">
                      <Col md={12}>
                        <Form.Item
                          name="password"
                          label="????????????????????????"
                          rules={[
                            {
                              required: true,
                              message: "???????????????????????????????????????????????????!",
                            },
                          ]}
                        >
                          <Input.Password
                            size="large"
                            type="password"
                            placeholder="????????????????????????????????????"
                          />
                        </Form.Item>
                      </Col>
                      <Col md={12}>
                        <Form.Item
                          name="confirm"
                          label="??????????????????????????????????????????"
                          dependencies={["password"]}
                          rules={[
                            {
                              required: true,
                              message: "?????????????????????????????????????????????????????????????????????!",
                            },
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                if (
                                  !value ||
                                  getFieldValue("password") === value
                                ) {
                                  return Promise.resolve();
                                }

                                return Promise.reject(
                                  new Error("?????????????????????????????????????????????????????????????????????????????????!")
                                );
                              },
                            }),
                          ]}
                        >
                          <Input.Password
                            size="large"
                            placeholder="??????????????????????????????????????????????????????"
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={24} justify="center">
                      <Col md={12}>
                        <Form.Item
                          name="firstName"
                          label="????????????????????????"
                          rules={[
                            {
                              required: true,
                              message: "???????????????????????????????????????????????????!",
                            },
                          ]}
                        >
                          <Input size="large" placeholder="????????????????????????????????????" />
                        </Form.Item>
                      </Col>
                      <Col md={12}>
                        <Form.Item
                          name="lastName"
                          label="?????????????????????"
                          rules={[
                            {
                              required: true,
                              message: "????????????????????????????????????????????????!",
                            },
                          ]}
                        >
                          <Input size="large" placeholder="?????????????????????????????????" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24} justify="start">
                      <Col md={10}>
                        <Form.Item
                          name="tel"
                          label="?????????????????????????????????????????????"
                          rules={[
                            {
                              required: true,
                              message: "????????????????????????????????????????????????????????????????????????!",
                            },
                          ]}
                        >
                          <Input
                            size="large"
                            placeholder="?????????????????????????????????????????????????????????"
                          />
                        </Form.Item>
                      </Col>
                      <Col md={5}>
                        <Form.Item
                          name="gender"
                          label="?????????"
                          rules={[
                            {
                              required: true,
                              message: "???????????????????????????????????????!",
                            },
                          ]}
                        >
                          <Select size="large" placeholder="????????????????????????">
                            <Select.Option value="?????????">?????????</Select.Option>
                            <Select.Option value="????????????">????????????</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={24} justify="start">
                      <Col md={24}>
                        <Form.Item
                          name="address"
                          label="?????????????????????"
                          rules={[
                            {
                              required: true,
                              message: "????????????????????????????????????????????????!",
                            },
                          ]}
                        >
                          <Input.TextArea
                            rows={2}
                            size="large"
                            placeholder="?????????????????????????????????..."
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Divider />
                    <Row gutter={24} justify="start">
                      <Col md={8}>
                        <Form.Item
                          name="startDate"
                          label="???????????????????????????????????????"
                          rules={[
                            {
                              required: true,
                              message: "?????????????????????????????????????????????????????????????????????!",
                            },
                          ]}
                        >
                          <DatePicker format="YYYY-MM-DD" size="large" />
                        </Form.Item>
                      </Col>
                      <Col md={8}>
                        <Form.Item
                          name="endDate"
                          label="?????????????????????????????????????????????????????????????????????"
                          rules={[
                            {
                              required: true,
                              message: "???????????????????????????????????????????????????????????????????????????????????????????????????!",
                            },
                          ]}
                        >
                          <DatePicker format="YYYY-MM-DD" size="large" />
                        </Form.Item>
                      </Col>
                      <Col md={8}>
                        <Form.Item
                          name="deposit"
                          label="???????????????????????????(?????????)"
                          rules={[
                            {
                              required: true,
                              message: "??????????????????????????????????????????????????????!",
                            },
                          ]}
                        >
                          <Input size="large" placeholder="???????????????????????????????????????" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Card>
              </Grid>
            </>
          )}
        </Grid>
        {!roomEmpty ? (
          <>
            <PageHeader
              extra={[
                <Button
                  style={{ background: "#FF0000", color: "#fff" }}
                  key={1}
                  // onClick={hideModal}
                  onClick={() => handleDeleteUserRoom(room?.userRoom)}
                >
                  ???????????????????????????
                </Button>,
              ]}
            />
          </>
        ) : (
          <>
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
                  ??????????????????
                </Button>,
              ]}
            />
          </>
        )}
      </Modal>
    </>
  );
};

export default DetailRoom;
