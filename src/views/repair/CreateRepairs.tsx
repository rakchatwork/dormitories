import React, { Fragment, useEffect, useState } from "react";
import moment from "moment";
// Alert
import Swal from "sweetalert2";

// Style
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Image,
  Input,
  Modal,
  PageHeader,
  Row,
  Select,
  Upload,
} from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { RcFile } from "antd/lib/upload";

// API
import { CREATE_REPAIR } from "../../service/api/repairs";
import { GET_ROOM } from "../../service/api/room";

// Until
import { remove_duplicates_es6 } from "../../utils/array";
import { getBase64 } from "../../utils/files";

// REDUX
import { useAppSelector } from "../../store/store";

// Type
type TProps = {
  id?: number;
  onAfterSubmit?: () => void;
};

const CreateRepairs = ({ id, onAfterSubmit }: TProps) => {
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [roomInfo, setRoomInfo] = useState<any>([]);
  const [formCreateRepair] = Form.useForm();
  const { dormitoryId } = useAppSelector((state) => state.auth);
  const [selectRepair, setSelectRepair] = useState<string[]>([]);
  const [visibleOtherInput, setVisibleOtherInput] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<RcFile[]>([]);
  const [imageBase64, setImageBase64] = useState<string[]>([]);

  useEffect(() => {
    const checkInputOtherRepair = () => {
      if (selectRepair.includes("อื่นๆ")) {
        setVisibleOtherInput(true);
      } else {
        setVisibleOtherInput(false);
      }
    };

    checkInputOtherRepair();
  }, [selectRepair.length]);

  const hideModal = () => {
    setVisibleModal(false);
    setImageBase64([]);
    setImageFile([]);
    formCreateRepair.resetFields();
  };

  const showModal = () => {
    apiGetRoomList();
    setVisibleModal(true);
  };

  const apiGetRoomList = async () => {
    const res = await GET_ROOM({
      getAll: false,
      status: true,
      dormitoryId: Number(dormitoryId),
    });
    if (res.status === 200) {
      setRoomInfo(res.results.item);
    }
  };

  const beforeUpload = async (file: RcFile, FileList: RcFile[]) => {
    await Promise.resolve(setImageBase64([]));
    try {
      FileList.map(async (image: RcFile, index: number) => {
        checkFileUpload(image);
        const base64: string = (await getBase64(image)) as string;
        setImageBase64((prev) => {
          return remove_duplicates_es6([...prev, base64]) as string[];
        });
      });

      setImageFile(FileList);
    } catch (error: any) {
      setImageFile([]);
    }
  };

  const checkFileUpload = (file: RcFile) => {
    const isJpgOrPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/jpeg";
    if (!isJpgOrPng) {
      setImageBase64([]);
      throw new Error("You can only upload JPG/PNG/JPEG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      setImageBase64([]);
      throw new Error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const onSubmitHandler = async (values: any) => {
    let title = selectRepair.join(", ").toString();
    if (values.other) {
      title = title + ", " + values.other;
    }
    let formData = new FormData();
    imageFile.forEach((file: RcFile) => {
      formData.append("images", file);
    });
    formData.append("title", title);
    formData.append("details", values.details);
    formData.append("room", values.room);
    formData.append(
      "convenientDate",
      moment(values.convenientDate).format("YYYY-MM-DD HH:mm")
    );
    const res = await CREATE_REPAIR(formData);
    if (res.status === 200) {
      hideModal();
      onAfterSubmit && onAfterSubmit();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "เพิ่มข้อมูลเรียบร้อยแล้ว!",
        showConfirmButton: false,
        timer: 1200,
      });
    }
  };

  return (
    <>
      <Button
        size="large"
        type="default"
        icon={<PlusCircleOutlined />}
        onClick={showModal}
        style={{ background: "#4CAF50", color: "#fff", borderRadius: "8px" }}
      >
        เพิ่มการแจ้งซ่อม
      </Button>
      <Modal
        className="custom-ant-modal"
        visible={visibleModal}
        onCancel={hideModal}
        title={<h3>เพิ่มการแจ้งซ่อม</h3>}
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
            form={formCreateRepair}
            onFinish={onSubmitHandler}
          >
            <Row gutter={24}>
              <Col md={12}>
                <Form.Item
                  name="room"
                  label="หมายเลขห้อง"
                  rules={[
                    {
                      required: true,
                      message: "เลือกหมายเลขห้อง!",
                    },
                  ]}
                >
                  <Select
                    placeholder="เลือกหมายเลขห้อง"
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
                    {roomInfo &&
                      roomInfo.map((room: any, index: number) => (
                        <Select.Option key={index} value={room?.id}>
                          {room?.roomNumber}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col md={12}>
                <Form.Item
                  name="convenientDate"
                  label="วันที่ต้องการช่าง"
                  rules={[
                    {
                      required: true,
                      message: "เลือกวันที่ต้องการช่าง!",
                    },
                  ]}
                >
                  <DatePicker
                    placeholder="เลือกวันที่ต้องการช่าง"
                    showTime={{
                      format: "HH:mm",
                    }}
                    size="large"
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD HH:mm"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col md={24}>
                <Form.Item
                  name="title"
                  label="ขอแจ้งซ่อม"
                  rules={[
                    {
                      required: true,
                      message: "เลือกที่ต้องการซ่อม!",
                    },
                  ]}
                >
                  <Select
                    mode="multiple"
                    size="large"
                    placeholder="Please select"
                    onChange={(value) => {
                      setSelectRepair(value);
                    }}
                    style={{ width: "100%" }}
                  >
                    <Select.Option value="ไฟฟ้า">ไฟฟ้า</Select.Option>
                    <Select.Option value="ประปาและสุขภัณฑ์">
                      ประปาและสุขภัณฑ์
                    </Select.Option>
                    <Select.Option value="อื่นๆ">อื่นๆ</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            {visibleOtherInput === true ? (
              <Row gutter={24}>
                <Col md={24}>
                  <Form.Item name="other" label="อื่นๆ">
                    <Input
                      size="large"
                      placeholder="ถ้าเลือกอื่นๆ กรุณากรอกข้อมูล"
                    />
                  </Form.Item>
                </Col>
              </Row>
            ) : null}
            <Row gutter={24}>
              <Col md={24}>
                <Form.Item name="details" label="รายละเอียด">
                  <Input.TextArea
                    placeholder="กรอกรายะเอียด"
                    rows={3}
                  ></Input.TextArea>
                </Form.Item>
              </Col>
            </Row>
            <Divider />
            <h3>รูปภาพ</h3>
            <Row style={{ marginBottom: 20 }}>
              <Col>
                <Upload
                  multiple
                  maxCount={5}
                  beforeUpload={beforeUpload}
                  customRequest={() => {}}
                  showUploadList={false}
                >
                  <Button>เลือกรูปภาพ </Button>
                </Upload>
              </Col>
            </Row>
            {imageBase64 &&
              imageBase64.map((base64: string, index: number) => (
                <Fragment key={index}>
                  <Image
                    src={base64}
                    width={100}
                    height={100}
                    style={{ padding: 5 }}
                  />
                </Fragment>
              ))}
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
                formCreateRepair.submit();
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

export default CreateRepairs;
