import React, { useEffect, Fragment } from "react";
import moment from "moment";

// Alert
import Swal from "sweetalert2";

// Style
import {
  Button,
  Card,
  Modal,
  PageHeader,
  Divider,
  Form,
  Row,
  Col,
  Input,
} from "antd";
import { Box, Typography } from "@mui/material/";

// Type
import { TParcels } from "../../types/parcels";

// QR code
import QRCode from "react-qr-code";

// API
import { CREATE_PARCEL_RECEIVE } from "../../service/api/parcels";

type TProps = {
  onAfterSubmit?: () => void;
  parcel?: TParcels;
  open: boolean;
  close: (value: boolean) => void;
};

const DetailParcel = (props: TProps) => {
  const { onAfterSubmit, parcel, open, close } = props;
  const [formCreateParcel] = Form.useForm();

  useEffect(() => {}, [parcel]);

  const hideModal = () => {
    close(false);
    formCreateParcel.resetFields();
  };

  // Submit
  const handleOnSubmit = async (values: any) => {
    const objValue = { id: parcel?.id, receiverName: values.passCode };
    const res = await CREATE_PARCEL_RECEIVE(objValue);
    if (res.status === 200) {
      onAfterSubmit && onAfterSubmit();
      hideModal();
      formCreateParcel.resetFields();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "รับพัสดุเรียบร้อยแล้ว!",
        showConfirmButton: false,
        timer: 1200,
      });
    }
  };

  return (
    <>
      <Modal
        className="custom-ant-modal"
        visible={open}
        onCancel={hideModal}
        title={<h3>รายละเอียดพัสดุ</h3>}
        width={550}
        footer={false}
      >
        <Card
          style={{
            flexWrap: "wrap",
            borderRadius: 20,
            border: "solid 2px #000",
          }}
        >
          <Box mb={5} sx={{ display: "flex", justifyContent: "center" }}>
            <QRCode value={`${parcel?.passCode}`} size={150} />
          </Box>
          <Box sx={{ display: "flex", mb: "22px" }}>
            <Box width="60%">
              <Box sx={{ mb: "8px" }}>
                <Typography sx={{ fontWeight: "600" }}>
                  รหัสอ้างอิงพัสดุ
                </Typography>
              </Box>
              <Box sx={{ ml: "16px" }}>
                <Typography sx={{ mr: "10px" }}>{parcel?.passCode}</Typography>
              </Box>
            </Box>
            <Box width="40%">
              <Box sx={{ mb: "8px" }}>
                <Typography sx={{ fontWeight: "600" }}>
                  วันที่พัสดุมาส่ง
                </Typography>
              </Box>
              <Box sx={{ ml: "16px" }}>
                <Typography sx={{ mr: "10px" }}>
                  {moment(parcel?.createdAt).format("YYYY/MM/DD HH:mm")}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: "flex", mb: "14px" }}>
            <Box width="60%">
              <Box sx={{ mb: "8px" }}>
                <Typography sx={{ fontWeight: "600" }}>ห้องพัก</Typography>
              </Box>
              <Box sx={{ ml: "16px" }}>
                <Typography sx={{ mr: "10px" }}>
                  {parcel?.room.roomNumber}
                </Typography>
              </Box>
            </Box>
            <Box width="40%">
              <Box sx={{ mb: "8px" }}>
                <Typography sx={{ fontWeight: "600" }}>สถานะ</Typography>
              </Box>
              <Box sx={{ ml: "16px" }}>
                {parcel?.receiveStatus ? (
                  <Box
                    py={0.5}
                    px={4}
                    mb={4}
                    sx={{
                      backgroundColor: "#AEF258",
                      width: "140px",
                      textAlign: "center",
                      borderRadius: "40px",
                    }}
                  >
                    <Typography variant="body2">รับแล้ว</Typography>
                  </Box>
                ) : (
                  <Box
                    py={0.5}
                    px={4}
                    sx={{
                      backgroundColor: "#88D4FF",
                      width: "140px",
                      textAlign: "center",
                      borderRadius: "40px",
                    }}
                  >
                    ยังไม่ได้รับ
                  </Box>
                )}
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: "flex", mb: "14px" }}>
            <Box width="100%">
              <Box sx={{ mb: "8px" }}>
                <Typography sx={{ mr: "10px", fontWeight: "600" }}>
                  หมายเลขพัสดุ
                </Typography>
              </Box>
              <Box display="flex" flexWrap="wrap" width="100%">
                {parcel?.parcelCode.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "inline-flex",
                      ml: "16px",
                      // mr: "16px",
                      width: "45%",
                    }}
                  >
                    <Box>
                      {index + 1}. {item}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
          <Divider />

          {parcel?.receiveStatus ? (
            <>
              <Box sx={{ display: "flex", mb: "14px" }}>
                <Box width="60%">
                  <Box sx={{ mb: "8px" }}>
                    <Typography sx={{ fontWeight: "600" }}>
                      ผู้รับพัสดุ
                    </Typography>
                  </Box>
                  <Box sx={{ ml: "16px" }}>
                    <Typography sx={{ mr: "10px" }}>
                      {parcel?.receiverName}
                    </Typography>
                  </Box>
                </Box>
                <Box width="40%">
                  <Box sx={{ mb: "8px" }}>
                    <Typography sx={{ fontWeight: "600" }}>
                      วันที่มารับพัสดุ
                    </Typography>
                  </Box>
                  <Box sx={{ ml: "16px" }}>
                    <Typography sx={{ mr: "10px" }}>
                      {moment(parcel?.receivedAt).format("YYYY/MM/DD HH:mm")}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </>
          ) : (
            <></>
          )}

          {parcel?.receiveStatus ? (
            <></>
          ) : (
            <>
              <Form
                layout="vertical"
                form={formCreateParcel}
                onFinish={handleOnSubmit}
              >
                <Row gutter={24} justify="center">
                  <Col md={24}>
                    <Form.Item
                      style={{ fontWeight: "600" }}
                      name="passCode"
                      label="ผู้รับพัสดุ"
                      rules={[
                        {
                          required: true,
                          message: "กรุณากรอก ชื่อ-นามสกุล ผู้รับพัสดุ!",
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        placeholder="กรอก ชื่อ-นามสกุล ผู้รับพัสดุ"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </>
          )}
        </Card>
        <PageHeader
          extra={[
            parcel?.receiveStatus ? null : (
              <Button
                htmlType="submit"
                key={2}
                onClick={() => {
                  formCreateParcel.submit();
                }}
                style={{ background: "#007DFF", color: "#fff" }}
              >
                บันทึก
              </Button>
            ),
          ]}
        />
      </Modal>
    </>
  );
};

export default DetailParcel;
