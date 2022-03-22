import { useState, CSSProperties } from "react";
// Alert
import Swal from "sweetalert2";

// Style
import {
  Button,
  Card,
  Col,
  Modal,
  Row,
  Form,
  Input,
  PageHeader,
  Select,
} from "antd";
import { EditOutlined, PlusCircleOutlined } from "@ant-design/icons";

// API
import { GET_ROOM_CATEGORIES } from "../../../service/api/room-categories";
import {
  CREATE_ROOM,
  GET_ROOM_BY_ID,
  UPDATE_ROOM,
} from "../../../service/api/room";

// Type
import { TRoomCategory } from "../../../types/room-category";

// REDUX
import { useAppSelector } from "../../../store/store";

// Type props
import { ButtonType } from "antd/lib/button";
import { SizeType } from "antd/lib/config-provider/SizeContext";
type TProps = {
  onAfterSubmit?: () => void;
  id?: number;
  size?: SizeType;
  type?: ButtonType;
  styles?: CSSProperties;
};

const CreateRoom = (props: TProps) => {
  const { onAfterSubmit, id, size, type, styles } = props;
  const [formCreateRoom] = Form.useForm();
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [roomCategories, setRoomCategories] = useState<TRoomCategory[]>();
  const { dormitoryId } = useAppSelector((state) => state.auth);

  const showModal = () => {
    setVisibleModal(true);
    apiGetRoomCategories();
    apiGetRoomById();
  };
  const hideModal = () => {
    setVisibleModal(false);
  };

  // BY ID
  const apiGetRoomById = async () => {
    if (id) {
      const res = await GET_ROOM_BY_ID(id);
      if (res.status === 200) {
        const roomInfo = res.results;

        formCreateRoom.setFieldsValue({
          roomNumber: roomInfo.roomNumber,
          roomCategory: roomInfo.roomCategory.id,
        });
      }
    }
  };

  // Select
  const apiGetRoomCategories = async () => {
    const res = await GET_ROOM_CATEGORIES({ getAll: false, dormitoryId });
    if (res.status === 200) {
      setRoomCategories(res.results.item);
    }
  };

  // Submit Post and Patch
  const handleOnSubmit = async (values: any) => {
    if (id) {
      // Patch
      const res = await UPDATE_ROOM(id, values);
      if (res.status === 200) {
        onAfterSubmit && onAfterSubmit();
        hideModal();
        formCreateRoom.resetFields();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "แก้ไขข้อมูลเรียบร้อยแล้ว!",
          showConfirmButton: false,
          timer: 1200,
        });
      }
    } else {
      // Post
      const res = await CREATE_ROOM(values);
      if (res.status === 200) {
        onAfterSubmit && onAfterSubmit();
        hideModal();
        formCreateRoom.resetFields();
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
        {id ? "แก้ไขข้อมูล" : "เพิ่มห้องพัก"}
      </Button>
      <Modal
        className="custom-ant-modal"
        visible={visibleModal}
        onCancel={hideModal}
        title={<h3>{id ? "แก้ไขข้อมูล" : "เพิ่มห้องพัก"}</h3>}
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
            form={formCreateRoom}
            onFinish={handleOnSubmit}
          >
            <Row gutter={24}>
              <Col md={24}>
                <Form.Item
                  name="roomNumber"
                  label="หมายเลขห้องพัก"
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกหมายเลขห้องพัก!",
                    },
                  ]}
                >
                  <Input placeholder="หมายเลขห้องพัก" size="large" />
                </Form.Item>
              </Col>
              <Col md={24}>
                <Form.Item
                  name="roomCategory"
                  label="ประเภทห้อง"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาเลือกประเภทห้อง!",
                    },
                  ]}
                >
                  <Select
                    placeholder="เลือกประเภทห้อง"
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
                    {roomCategories &&
                      roomCategories.map((roomCategory: TRoomCategory) => (
                        <Select.Option
                          key={roomCategory.id}
                          value={roomCategory.id}
                        >
                          {roomCategory.categoryName}
                        </Select.Option>
                      ))}
                  </Select>
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
                formCreateRoom.submit();
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

export default CreateRoom;
