import React, { useState } from "react";
import moment from "moment";

// Style
import {
  Button,
  Card,
  Col,
  Divider,
  Image,
  Modal,
  PageHeader,
  Row,
} from "antd";

// API
import { GET_REPAIR_BY_ID } from "../../service/api/repairs";

// Config
import { apiUrlDormitory } from "../../config/api";

// Image
import detailIcom from "./../../assets/images/icon/btn-details.svg";

type TProps = {
  id: number;
};

const DetailsRepair = ({ id }: TProps) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [repairInfo, setRepairInfo] = useState<any>();
  const nf = Intl.NumberFormat();

  const showModal = () => {
    apiGetRepairtById();
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
  };

  const apiGetRepairtById = async () => {
    const res = await GET_REPAIR_BY_ID(id);
    if (res.status === 200) {
      setRepairInfo(res.results);
    }
  };

  return (
    <>
      <Button type="link" onClick={showModal}>
        <img src={detailIcom} alt="btn-details" />
      </Button>
      <Modal
        title="รายละเอียดการแจ้งซ่อม"
        width={750}
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
          <Row gutter={24}>
            <Col md={12}>
              <Row gutter={24}>
                <Col md={24}>
                  <h3>หมายเลขห้อง</h3>
                </Col>
                <Col offset={2} md={22}>
                  <p>{repairInfo?.room?.roomNumber}</p>
                </Col>
              </Row>
            </Col>
            <Col md={12}>
              <Row gutter={24}>
                <Col md={24}>
                  <h3>วันที่ต้องการช่าง</h3>
                </Col>
                <Col offset={2} md={22}>
                  <p>
                    {moment(repairInfo?.convenientDate).format(
                      "DD/MM/YYYY HH:mm"
                    )}
                  </p>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col md={12}>
              <h3>วันที่ซ่อมเสร็จ</h3>
            </Col>
            <Col offset={1} md={23}>
              <p>
                {repairInfo?.doneDate !== null
                  ? moment(repairInfo?.doneDate).format("DD/MM/YYYY")
                  : "-"}
              </p>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col md={24}>
              <h3>ขอแจ้งซ่อม</h3>
            </Col>
            <Col offset={1} md={23}>
              <p>{repairInfo?.title}</p>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col md={24}>
              <h3>รายละเอียด</h3>
            </Col>
            <Col offset={1} md={23}>
              <p>{repairInfo?.details}</p>
            </Col>
          </Row>
          <Divider />
          {repairInfo?.payer !== null && repairInfo?.expenses !== null ? (
            <>
              <Row gutter={24}>
                <Col md={12}>
                  <Row gutter={24}>
                    <Col md={24}>
                      <h3>ผู้ชำระค่าใช้จ่ายในการซ่อม</h3>
                    </Col>
                    <Col offset={2} md={22}>
                      <p>{repairInfo?.payer}</p>
                    </Col>
                  </Row>
                </Col>
                <Col md={12}>
                  <Row gutter={24}>
                    <Col md={24}>
                      <h3>ค่าใช้จ่ายในการซ่อมที่ต้องชำระ</h3>
                    </Col>
                    <Col offset={2} md={22}>
                      <p>{nf.format(repairInfo?.expenses)} ฿</p>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Divider />
            </>
          ) : repairInfo?.payer !== null ? (
            <>
              <Row gutter={24}>
                <Col md={12}>
                  <Row gutter={24}>
                    <Col md={24}>
                      <h3>ผู้ชำระค่าใช้จ่ายในการซ่อม</h3>
                    </Col>
                    <Col offset={2} md={22}>
                      <p>{repairInfo?.payer}</p>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Divider />
            </>
          ) : null}
          <Row gutter={24}>
            <Col md={24}>
              <h3>รูปภาพ</h3>
            </Col>
            <Col>
              {repairInfo?.image &&
                repairInfo?.image.map(
                  (item: Partial<{ path: string }>, index: number) => (
                    <Image
                      key={index}
                      src={`${apiUrlDormitory}/${item.path}`}
                      width={100}
                      height={100}
                      style={{ padding: 5 }}
                    />
                  )
                )}
            </Col>
          </Row>
        </Card>
        <PageHeader />
      </Modal>
    </>
  );
};

export default DetailsRepair;
