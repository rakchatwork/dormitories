import React, { useState } from "react";

// Style
import { Card, Col, Modal, PageHeader, Row } from "antd";
import { TDormitorys } from "./Dormitory";
import { Box, Typography } from "@mui/material";
import { longdo, LongdoMap, map } from "../../components/map/LongdoMap";
import { mapKey } from "../../config/map";
import axios from "axios";
import detailIcom from "./../../assets/images/icon/btn-details.svg";
import { GET_DORMITORY_BY_ID } from "../../service/api/dormitory";

// Type
type TProps = {
  id: number;
};

const DormitoryDetail = ({ id }: TProps) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [dormitory, setDormitory] = useState<TDormitorys>();

  const hideModal = () => {
    setVisible(false);
  };

  const showModal = () => {
    setVisible(true);
  };

  const initMap = async () => {
    map.Layers.setBase(longdo.Layers.GRAY);
    map.zoom(10);
    const res = await GET_DORMITORY_BY_ID(id);
    if (res.status === 200) {
      const dormitoryInfo = res.results;
      setDormitory(dormitoryInfo);
      if (dormitoryInfo.lon !== null && dormitoryInfo.lat !== null) {
        setInitMarker({
          lat: dormitoryInfo.lat,
          lon: dormitoryInfo.lon,
        });

        map.location({ lat: dormitoryInfo.lat, lon: dormitoryInfo.lon }, true);
      }
    }
  };

  const setInitMarker = async (location: { lat: number; lon: number }) => {
    const res = await axios.get(
      `https://api.longdo.com/map/services/address?lon=${location.lon}&lat=${location.lat}&key=${mapKey}`
    );
    const userMarker = new longdo.Marker(
      {
        lon: location.lon,
        lat: location.lat,
      },
      {
        title: "คุณอยู่ที่นี่",
        detail: `${res.data.aoi ? res.data.aoi : ""} ${
          res.data.road ? res.data.road : ""
        } ${res.data.district ? res.data.district : ""} ${
          res.data.subdistrict ? res.data.subdistrict : ""
        } ${res.data.province ? res.data.province : ""} ${
          res.data.country ? res.data.country : ""
        } ${res.data.country ? res.data.country : ""} ${
          res.data.postcode ? res.data.postcode : ""
        }`,
        // draggable: true,
      }
    );
    map.Overlays.add(userMarker);
  };

  return (
    <>
      <img
        onClick={() => showModal()}
        src={detailIcom}
        alt="btn-details"
        style={{ cursor: "pointer" }}
      />
      <Modal
        className="custom-ant-modal"
        visible={visible}
        onCancel={hideModal}
        title={<h3>รายละเอียดหอพัก</h3>}
        width={550}
        footer={false}
      >
        <Card
          style={{
            borderRadius: 20,
            border: "solid 2px #000",
            width: "100%",
          }}
        >
          <Box sx={{ mb: "14px" }}>
            <Box sx={{ mb: "8px" }}>
              <Typography sx={{ mr: "10px", fontWeight: "600" }}>
                ชื่อหอพัก
              </Typography>
            </Box>
            <Box sx={{ ml: "16px" }}>
              <Typography sx={{ mr: "10px" }}>{dormitory?.name}</Typography>
            </Box>
          </Box>

          <Box sx={{ mb: "14px" }}>
            <Box sx={{ mb: "8px" }}>
              <Typography sx={{ mr: "10px", fontWeight: "600" }}>
                ที่อยู่หอพัก
              </Typography>
            </Box>
            <Box sx={{ ml: "16px" }}>
              <Typography sx={{ mr: "10px" }}>{dormitory?.address}</Typography>
            </Box>
          </Box>
          <Box sx={{ ml: "16px" }}></Box>
          <Row gutter={24}>
            <Col md={24}>
              <div>
                <LongdoMap
                  height={280}
                  callback={initMap}
                  id={`dormitoty_map_details${id}`}
                  mapKey={mapKey}
                />
              </div>
            </Col>
          </Row>
        </Card>
        <PageHeader />
      </Modal>
    </>
  );
};

export default DormitoryDetail;
