import React, { useState } from "react";
// Alert
import Swal from "sweetalert2";

// Style
import { Button, Card, Col, Form, Modal, PageHeader, Row, Select } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";

// API
import {
  GET_REPAIR_BY_ID,
  POST_PROCESSING_REPAIR,
} from "../../service/api/repairs";

type TProps = {
  onAfterSubmit?: () => void;
  id: number;
};

const ProcessingRepairModal = ({ id, onAfterSubmit }: TProps) => {
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
    const res = await POST_PROCESSING_REPAIR({ ...values, id });
    if (res.status === 200) {
      hideModal();
      onAfterSubmit && onAfterSubmit();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "แจ้งดำเนินการเรียบร้อยแล้ว!",
        showConfirmButton: false,
        timer: 1200,
      });
    }
  };

  return (
    <>
      <Button
        onClick={showModal}
        icon={<ClockCircleOutlined />}
        size="middle"
        style={{
          background: "#660099",
          color: "#fff",
          borderRadius: "8px",
          width: "110px",
        }}
      >
        ดำเนินการ
      </Button>
      <Modal
        title="ดำเนินการซ่อม"
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
                  label="ผู้ชำระค่าใช้จ่ายในการซ่อม"
                  name="payer"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาเลือกผู้ชำระค่าใช้จ่ายในการซ่อม!",
                    },
                  ]}
                >
                  <Select
                    size="large"
                    placeholder="เลือกผู้ชำระค่าใช้จ่ายในการซ่อม"
                  >
                    <Select.Option value="ผู้เช่า">ผู้เช่า</Select.Option>
                    <Select.Option value="เจ้าของหอพัก">
                      เจ้าของหอพัก
                    </Select.Option>
                    <Select.Option value="ผู้เช่าและเจ้าของหอพัก">
                      ผู้เช่าและเจ้าของหอพัก
                    </Select.Option>
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

export default ProcessingRepairModal;
