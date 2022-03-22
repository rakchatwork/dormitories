import React, { useState, CSSProperties } from "react";
// Alert
import Swal from "sweetalert2";

// Style
import { ButtonType } from "antd/lib/button";
import { SizeType } from "antd/lib/config-provider/SizeContext";
import {
  Button,
  Card,
  Modal,
  Form,
  Row,
  Col,
  Input,
  PageHeader,
  Select,
} from "antd";
import { EditOutlined, PlusCircleOutlined } from "@ant-design/icons";

// API Dormitory
import {
  CREATE_DORMITORY,
  GET_DORMITORY_BY_ID,
  UPDATE_DORMITORY,
} from "../../service/api/dormitory";
import { LongdoMap, map, longdo } from "../../components/map/LongdoMap";
import { mapKey } from "../../config/map";
import { getCurrentLocation } from "../../utils/location";
import axios from "axios";

// Type
type TProps = {
  onAfterSubmit?: () => void;
  id?: number;
  size?: SizeType;
  type?: ButtonType;
  styles?: CSSProperties;
};

const CreateDormitory = (props: TProps) => {
  const { onAfterSubmit, id, size, type, styles } = props;
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [formCreateUser] = Form.useForm();
  const [keepLocation, setKeepLocation] = useState<{
    lat: number;
    lon: number;
  }>({
    lat: 0,
    lon: 0,
  });
  const [suggestions, setSuggestions] = useState<any>([]);

  const initMap = async () => {
    map.Layers.setBase(longdo.Layers.GRAY);
    map.zoom(10);
    if (!id) {
      const location = await getCurrentLocation();
      map.location({ lat: location.latitude, lon: location.longitude }, true);
      setInitMarker({ lat: location.latitude, lon: location.longitude });
    }
  };

  const initMapWithId = async () => {
    map.Layers.setBase(longdo.Layers.GRAY);
    map.zoom(10);
    if (id) {
      const res = await GET_DORMITORY_BY_ID(id);
      if (res.status === 200) {
        const dormitoryInfo = res.results;
        if (dormitoryInfo.lon !== null && dormitoryInfo.lat !== null) {
          setInitMarker({
            lat: dormitoryInfo.lat,
            lon: dormitoryInfo.lon,
          });

          map.location(
            { lat: dormitoryInfo.lat, lon: dormitoryInfo.lon },
            true
          );
        }
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
    setKeepLocation({
      lon: location.lon,
      lat: location.lat,
    });
  };

  const apiGetUserById = async () => {
    if (id) {
      const res = await GET_DORMITORY_BY_ID(id);
      if (res.status === 200) {
        const dormitoryInfo = res.results;
        formCreateUser.setFieldsValue({
          name: dormitoryInfo.name,
          address: dormitoryInfo.address,
        });
      }
    }
  };

  const onSearchAddressHandler = async (value: any) => {
    let res = await axios.get(
      `https://search.longdo.com/mapsearch/json/search?keyword=${value}&limit=100&key=${mapKey}`
    );
    setSuggestions(res.data.data);
  };

  const showModal = () => {
    apiGetUserById();
    setVisibleModal(true);
  };
  const hideModal = () => {
    formCreateUser.resetFields();
    setVisibleModal(false);
  };

  const handleOnSubmit = async (values: any) => {
    if (id) {
      // Edit
      const res = await UPDATE_DORMITORY(id, {
        ...values,
        lat: keepLocation.lat,
        lon: keepLocation.lon,
      });
      if (res.status === 200) {
        onAfterSubmit && onAfterSubmit();
        hideModal();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "แก้ไขข้อมูลเรียบร้อยแล้ว!",
          showConfirmButton: false,
          timer: 1200,
        });
      }
      return;
    }
    // Create Dormitory

    const res = await CREATE_DORMITORY({
      ...values,
      lat: keepLocation.lat,
      lon: keepLocation.lon,
    });
    if (res.status === 200) {
      onAfterSubmit && onAfterSubmit();
      hideModal();
      formCreateUser.resetFields();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "เพิ่มข้อมูลเรียบร้อยแล้ว!",
        showConfirmButton: false,
        timer: 1200,
      });
    }
  };

  const onChangeSearchAddress = (value: number) => {
    map.Overlays.clear();
    const item = suggestions[value];
    setInitMarker({ lat: item.lat, lon: item.lon });
    map.location({ lat: item.lat, lon: item.lon }, true);
    setKeepLocation({ lat: item.lat, lon: item.lon });
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
        {id ? "แก้ไขข้อมูล" : "เพิ่มหอพัก"}
      </Button>
      <Modal
        className="custom-ant-modal"
        visible={visibleModal}
        onCancel={hideModal}
        title={<h3>{id ? "แก้ไขข้อมูล" : "เพิ่มหอพัก"}</h3>}
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
            form={formCreateUser}
            onFinish={handleOnSubmit}
          >
            <Row gutter={24} justify="center">
              <Col md={24}>
                <Form.Item
                  name="name"
                  label="ชื่อหอพัก"
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกชื่อหอพัก!",
                    },
                  ]}
                >
                  <Input size="large" placeholder="กรอกชื่อหอพัก" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24} justify="start">
              <Col md={24}>
                <Form.Item
                  name="address"
                  label="ที่อยู่หอพัก"
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกที่อยู่หอพัก!",
                    },
                  ]}
                >
                  <Input.TextArea
                    rows={2}
                    size="large"
                    placeholder="กรอกที่อยู่หอพัก..."
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col md={24}>
                <Form.Item name="location" label="ค้นหาตำแหน่ง">
                  <Select
                    style={{ width: "100%" }}
                    size="large"
                    placeholder="ค้นหาตำแหน่ง"
                    showSearch
                    onSearch={onSearchAddressHandler}
                    optionFilterProp="children"
                    onChange={onChangeSearchAddress}
                  >
                    {suggestions &&
                      suggestions.map((item: any, index: number) => (
                        <Select.Option key={index} value={index}>
                          {item?.name}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col md={24}>
                <div>
                  <LongdoMap
                    height={280}
                    callback={id ? initMapWithId : initMap}
                    id={id ? `dormitoty_map_edit${id}` : "dormitory_map_create"}
                    mapKey={mapKey}
                  />
                </div>
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
                formCreateUser.submit();
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

export default CreateDormitory;
