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
  InputNumber,
  PageHeader,
} from "antd";
import { EditOutlined, PlusCircleOutlined } from "@ant-design/icons";

// REDUX
import { useAppSelector } from "../../../store/store";

// API
import {
  CREATE_ROOM_CATEGORIES,
  GET_ROOM_CATEFORIES_BY_ID,
  UPDATE_ROOM_CATEGORIES,
} from "../../../service/api/room-categories";

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

const CreateRoomCategory = (props: TProps) => {
  const { onAfterSubmit, id, size, type, styles } = props;
  const [formCreateRoomCategory] = Form.useForm();
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const { dormitoryId } = useAppSelector((state) => state.auth);

  const showModal = () => {
    apiGetRoomCategoriesById();
    setVisibleModal(true);
  };
  const hideModal = () => {
    setVisibleModal(false);
  };

  // Problems (get id แล้วไม่มี response)
  const apiGetRoomCategoriesById = async () => {
    if (id) {
      const res = await GET_ROOM_CATEFORIES_BY_ID(id);
      if (res.status === 200) {
        const roomCategoriesInfo = res.results;

        formCreateRoomCategory.setFieldsValue({
          categoryName: roomCategoriesInfo.categoryName,
          price: roomCategoriesInfo.price,
          details: roomCategoriesInfo.details,
        });
      }
    }
  };

  // Submit Post and Patch
  const handleOnSubmit = async (values: any) => {
    if (id) {
      // Patch
      const objectValue = {
        ...values,
        price: Number(values.price),
        dormitory: dormitoryId,
      };
      const res = await UPDATE_ROOM_CATEGORIES(id, objectValue);
      if (res.status === 200) {
        onAfterSubmit && onAfterSubmit();
        hideModal();
        formCreateRoomCategory.resetFields();
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
      const objectValue = { ...values, dormitory: dormitoryId };
      const res = await CREATE_ROOM_CATEGORIES(objectValue);
      if (res.status === 200) {
        onAfterSubmit && onAfterSubmit();
        hideModal();
        formCreateRoomCategory.resetFields();
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
        {id ? "แก้ไขข้อมูล" : "เพิ่มประเภทห้อง"}
      </Button>
      <Modal
        className="custom-ant-modal"
        visible={visibleModal}
        onCancel={hideModal}
        title={<h3>{id ? "แก้ไขประเภทห้อง" : "เพิ่มประเภทห้อง"}</h3>}
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
            form={formCreateRoomCategory}
            onFinish={handleOnSubmit}
          >
            <Row gutter={24}>
              <Col md={24}>
                <Form.Item
                  name="categoryName"
                  label="ชื่อประเภทห้อง"
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกชื่อประเภทห้อง!",
                    },
                  ]}
                >
                  <Input placeholder="ชื่อประเภทห้อง" size="large" />
                </Form.Item>
              </Col>
              <Col md={24}>
                <Form.Item
                  name="price"
                  label="ราคา / เดือน"
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกราคา!",
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="ราคา / เดือน"
                    size="large"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
              <Col md={24}>
                <Form.Item
                  name="details"
                  label="รายละเอียด"
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกรายละเอียด!",
                    },
                  ]}
                >
                  <Input.TextArea placeholder="รายละเอียด" rows={3} />
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
                formCreateRoomCategory.submit();
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

export default CreateRoomCategory;
