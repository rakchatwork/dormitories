import React, { useState } from "react";
import moment from "moment";

// Alert
import Swal from "sweetalert2";

// Style
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Modal,
  PageHeader,
  Row,
} from "antd";
import { SyncOutlined } from "@ant-design/icons";

// API
import {
  GET_REPAIR_BY_ID,
  POST_APPROVE_REPAIR,
} from "../../service/api/repairs";

type TProps = {
  onAfterSubmit?: () => void;
  id: number;
};

const ApproveModal = ({ id, onAfterSubmit }: TProps) => {
  const [visible, setVisible] = useState<boolean>(false);
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
      form.setFieldsValue({
        convenientDate: moment(res.results.convenientDate),
      });
    }
  };

  const onSubmitHandler = async (values: any) => {
    const res = await POST_APPROVE_REPAIR({ ...values, id });
    if (res.status === 200) {
      hideModal();
      onAfterSubmit && onAfterSubmit();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "อนุมัติเรียบร้อยแล้ว!",
        showConfirmButton: false,
        timer: 1200,
      });
    }
  };

  return (
    <>
      <Button
        onClick={showModal}
        icon={<SyncOutlined />}
        size="middle"
        style={{
          background: "#A0522D",
          color: "#fff",
          borderRadius: "8px",
          width: "110px",
        }}
      >
        อนุมัติ
      </Button>
      <Modal
        title="อนุมัติคำร้องแจ้งซ่อม"
        visible={visible}
        onCancel={hideModal}
        onOk={onOkModal}
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
              <Col md={24}>
                <Form.Item label="ยืนยันวันที่เข้าซ่อม" name="convenientDate">
                  <DatePicker
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

export default ApproveModal;
