import React, { useState } from "react";
// Alert
import Swal from "sweetalert2";

// Style
import {
  Button,
  Card,
  Col,
  Form,
  InputNumber,
  Modal,
  PageHeader,
  Row,
} from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

// API
import { GET_REPAIR_BY_ID, POST_DONE_REPAIR } from "../../service/api/repairs";

type TProps = {
  onAfterSubmit?: () => void;
  id: number;
};

const DoneRepairModal = ({ id, onAfterSubmit }: TProps) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [roomInfo, setrRoomInfo] = useState<any>();
  const [form] = Form.useForm();

  const showModal = () => {
    apiGetRepaitById();
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
    form.resetFields();
  };

  const onOkModal = () => {
    form.submit();
  };

  const apiGetRepaitById = async () => {
    const res = await GET_REPAIR_BY_ID(id);
    if (res.status === 200) {
      setrRoomInfo(res.results.room);
    }
  };

  const onSubmitHandler = async (values: any) => {
    const res = await POST_DONE_REPAIR({ ...values, id });
    if (res.status === 200) {
      hideModal();
      onAfterSubmit && onAfterSubmit();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "แจ้งเสร็จสิ้นเรียบร้อยแล้ว!",
        showConfirmButton: false,
        timer: 1200,
      });
    }
  };

  return (
    <>
      <Button
        onClick={showModal}
        icon={<CheckCircleOutlined />}
        size="middle"
        style={{
          background: "#0066FF",
          color: "#fff",
          borderRadius: "8px",
          width: "110px",
        }}
      >
        เสร็จสิ้น
      </Button>
      <Modal
        title="เสร็จสิ้นดำเนินการซ่อม"
        visible={visible}
        onCancel={hideModal}
        className="custom-ant-modal"
        footer={false}
      >
        <Card
          style={{
            borderRadius: 20,
            border: "solid 2px #000",
          }}
        >
          <Form layout="vertical" form={form} onFinish={onSubmitHandler}>
            <Row gutter={24}>
              <Col md={24} style={{ marginBottom: 10 }}>
                <Row gutter={24}>
                  <Col md={24}>
                    <h3>หมายเลขห้อง</h3>
                  </Col>
                  <Col offset={1} md={23}>
                    <p>{roomInfo?.roomNumber}</p>
                  </Col>
                </Row>
              </Col>
              <Col md={24}>
                <Form.Item
                  label="ค่าใช้จ่ายในการซ่อมที่ต้องชำระ"
                  name="expenses"
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกค่าใช้จ่ายในการซ่อมที่ต้องชำระ!",
                    },
                  ]}
                >
                  <InputNumber
                    min={0}
                    size="large"
                    placeholder="กรอกค่าใช้จ่ายในการซ่อมที่ต้องชำระ"
                    style={{
                      width: "100%",
                    }}
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
              onClick={onOkModal}
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

export default DoneRepairModal;
