import React, { useState } from "react";
// Alert
import Swal from "sweetalert2";

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
} from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Box } from "@mui/material";

// REDUX
import { useAppSelector } from "../../store/store";

// API
import { CREATE_PARCEL } from "../../service/api/parcels";
import { GET_ROOM } from "../../service/api/room";

// Type
import { TRoom } from "../../types/room";
type TProps = {
  onAfterSubmit?: () => void;
};

const CreateParcels = (props: TProps) => {
  const { onAfterSubmit } = props;
  const [formCreateParcel] = Form.useForm();
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [parcelCode, setParcelCode] = useState<string[]>([]);
  const [room, setRoom] = useState<TRoom[]>();
  const { dormitoryId } = useAppSelector((state) => state.auth);

  // GET API ROOM
  const apiGetRoom = async () => {
    const res = await GET_ROOM({ getAll: false, status: true, dormitoryId });
    if (res.status === 200) {
      setRoom(res.results.item);
    }
  };

  // Modal
  const showModal = () => {
    setVisibleModal(true);
    apiGetRoom();
    formCreateParcel.setFieldsValue({
      passCode: generatePasscode(),
    });
  };
  const hideModal = () => {
    setVisibleModal(false);
    formCreateParcel.resetFields();
    setParcelCode([]);
  };

  // Passcord
  const generatePasscode = () => {
    return (
      (Math.random() + 1).toString(36).substring(8).toUpperCase() +
      new Date().getTime().toString()
    );
  };

  // Submit
  const handleOnSubmit = async (values: any) => {
    const res = await CREATE_PARCEL({
      ...values,
      parcelCode: parcelCode,
    });
    if (res.status === 200) {
      onAfterSubmit && onAfterSubmit();
      hideModal();
      formCreateParcel.resetFields();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "เพิ่มข้อมูลเรียบร้อยแล้ว!",
        showConfirmButton: false,
        timer: 1200,
      });
    }
  };

  // Parcels Code
  const handleDeleteParcelCode = (value: string) => {
    const filteredParcel: string[] = parcelCode.filter(
      (item) => item !== value
    );
    setParcelCode([...filteredParcel]);
  };

  const handleOnKeyDownParcelCode = (e: any) => {
    const { key } = e;
    const trimInput = e.target.value.trim();
    if (isAddParcelCode(key, trimInput)) {
      setParcelCode([...parcelCode, trimInput]);
      formCreateParcel.setFieldsValue({
        parcelCode: "",
      });
    }
  };
  const isAddParcelCode = (key: string, inputValue: string): boolean => {
    // return isEnterParcelCode(key, inputValue);
    return (
      isEnterParcelCode(key, inputValue) || isSpaceParcelCode(key, inputValue)
    );
  };
  // Enter
  const isEnterParcelCode = (key: string, inputValue: string): boolean => {
    return (
      key === "Enter" &&
      inputValue.length > 0 &&
      !parcelCode.includes(inputValue)
    );
  };
  // Spacebar
  const isSpaceParcelCode = (key: string, inputValue: string): boolean => {
    return (
      key === " " && inputValue.length > 0 && !parcelCode.includes(inputValue)
    );
  };

  const handleOnBlurParcelCode = (e: any) => {
    const trimInput = e.target.value.trim();
    if (trimInput.length && !parcelCode.includes(trimInput)) {
      setParcelCode([...parcelCode, trimInput]);
      formCreateParcel.setFieldsValue({
        parcelCode: "",
      });
    }
  };

  return (
    <>
      <Button
        size="large"
        type="default"
        onClick={showModal}
        icon={<PlusCircleOutlined />}
        style={{ background: "#4CAF50", color: "#fff", borderRadius: "8px" }}
      >
        เพิ่มพัสดุ
      </Button>
      <Modal
        className="custom-ant-modal"
        visible={visibleModal}
        onCancel={hideModal}
        title={<h3>เพิ่มพัสดุ</h3>}
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
            form={formCreateParcel}
            onFinish={handleOnSubmit}
          >
            <Row gutter={24} justify="center">
              <Col md={24}>
                <Form.Item name="passCode" label="รหัสอ้างอิงพัสดุ">
                  <Input size="large" disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col md={24}>
                <Form.Item
                  name="room"
                  label="ห้อง"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาเลือกห้อง!",
                    },
                  ]}
                >
                  <Select
                    placeholder="เลือกห้อง"
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
            </Row>
            <Row gutter={24}>
              <Col md={24}>
                <Form.Item name="parcelCode" label="หมายเลขพัสดุ">
                  <Input
                    size="large"
                    placeholder="หมายเลขพัสดุ"
                    onKeyDown={handleOnKeyDownParcelCode}
                    onBlur={handleOnBlurParcelCode}
                  />
                </Form.Item>
                <Row gutter={24}>
                  {parcelCode &&
                    parcelCode.map((item: string, index: number) => {
                      return (
                        <Col
                          key={index}
                          style={{
                            margin: 5,
                            background: "orange",
                            borderRadius: 5,
                          }}
                        >
                          <Box display="flex" m={1} mx={2}>
                            <Box>{item} </Box>
                            <Box
                              onClick={() => handleDeleteParcelCode(item)}
                              sx={{
                                position: "absolute",
                                right: 1,
                                top: -5,
                                cursor: "pointer",
                                "&:hover": {
                                  color: "red",
                                },
                              }}
                            >
                              x
                            </Box>
                          </Box>
                        </Col>
                      );
                    })}
                </Row>
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
                formCreateParcel.submit();
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

export default CreateParcels;
