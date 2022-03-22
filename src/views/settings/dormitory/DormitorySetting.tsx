import React, { useEffect, useState } from "react";
import axios from "axios";

// Alert
import Swal from "sweetalert2";

// Style
import {
  Button,
  Card,
  Col,
  Form,
  Image,
  Input,
  PageHeader,
  Row,
  Select,
  Upload,
} from "antd";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import EditOutlined from "@ant-design/icons/lib/icons/EditOutlined";
import { RcFile } from "antd/lib/upload";

// Config
import { apiUrlDormitory } from "../../../config/api";
import { mapKey } from "../../../config/map";

// API
import {
  GET_DORMITORY_BY_ID,
  UPDATE_DORMITORY_WITH_FORMDATA,
} from "../../../service/api/dormitory";

// Until
import { getBase64 } from "../../../utils/files";

// Components
import { longdo, LongdoMap, map } from "../../../components/map/LongdoMap";

// REDUX
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { editInfo } from "../../../store/slices/dormitorySlice";

const DormitorySetting = () => {
  const { dormitoryId } = useAppSelector((state) => state.auth);
  const [imageFile, setImageFile] = useState<any>();
  const [imageBase64, setImageBase64] = useState<string>("");
  const [isDeleteImage, setIsDeleteImage] = useState<boolean>(false);
  const [keepLocation, setKeepLocation] = useState<{
    lat: number;
    lon: number;
  }>({
    lat: 0,
    lon: 0,
  });
  const [suggestions, setSuggestions] = useState<any>([]);
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  useEffect(() => {
    getDormitoryById();
  }, []);

  const initMapWithId = async () => {
    map.Layers.setBase(longdo.Layers.GRAY);
    map.zoom(10);
    if (dormitoryId) {
      const res = await GET_DORMITORY_BY_ID(dormitoryId);
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

  const onSearchAddressHandler = async (value: any) => {
    let res = await axios.get(
      `https://search.longdo.com/mapsearch/json/search?keyword=${value}&limit=100&key=${mapKey}`
    );
    setSuggestions(res.data.data);
  };

  const onChangeSearchAddress = (value: number) => {
    map.Overlays.clear();
    const item = suggestions[value];
    setInitMarker({ lat: item.lat, lon: item.lon });
    map.location({ lat: item.lat, lon: item.lon }, true);
    setKeepLocation({ lat: item.lat, lon: item.lon });
  };

  const getDormitoryById = async () => {
    const res = await GET_DORMITORY_BY_ID(Number(dormitoryId));

    if (res.status === 200) {
      form.setFieldsValue({
        name: res.results.name,
        address: res.results.address,
      });
      if (res.results.image !== null) {
        setImageBase64(
          `${apiUrlDormitory}/images/${res.results.image.filename}`
        );
      }
    }
  };

  const onDeleteImageHandler = () => {
    setIsDeleteImage(true);
    setImageBase64("");
    setImageFile(undefined);
  };

  const beforeUpload = async (file: RcFile, listFile: RcFile[]) => {
    const base64 = await getBase64(file);
    setImageBase64(base64);
    setImageFile(file);
    setIsDeleteImage(false);
  };

  const onSubmitHandler = async (values: any) => {
    let formData = new FormData();
    if (imageFile !== undefined) {
      formData.append("image", imageFile);
    }
    formData.append("name", values.name);
    formData.append("address", values.address);
    formData.append("isDeleteImage", String(isDeleteImage));
    formData.append("lat", String(keepLocation.lat));
    formData.append("lon", String(keepLocation.lon));
    const res = await UPDATE_DORMITORY_WITH_FORMDATA(
      Number(dormitoryId),
      formData
    );
    if (res.status === 200) {
      getDormitoryById();
      let payload = { dormitoryName: "", srcLogo: "" };
      payload = { ...payload, dormitoryName: res.results.name };
      if (res.results.image !== null) {
        payload = {
          ...payload,
          srcLogo: `${apiUrlDormitory}/images/${res.results.image.filename}`,
        };
      }
      dispatch(editInfo(payload));
      Swal.fire({
        position: "center",
        icon: "success",
        title: "แก้ไขข้อมูลเรียบร้อยแล้ว!",
        showConfirmButton: false,
        timer: 1200,
      });
    }
  };

  return (
    <>
      <PageHeader title={<h2>หอพัก</h2>} />
      <Row justify="center">
        <Card style={{ marginTop: 10, width: "100%" }} bordered={false}>
          <Form layout="vertical" form={form} onFinish={onSubmitHandler}>
            <Row gutter={24} justify="center">
              <Card
                className="p-0"
                hoverable
                actions={[
                  <Upload
                    maxCount={1}
                    showUploadList={false}
                    customRequest={() => {}}
                    beforeUpload={beforeUpload}
                    key="edit"
                  >
                    <EditOutlined style={{ fontSize: 26 }} />
                  </Upload>,
                  <DeleteOutlined
                    key="delete"
                    onClick={onDeleteImageHandler}
                    style={{ fontSize: 26 }}
                  />,
                ]}
                cover={
                  <Image
                    src={imageBase64}
                    width={300}
                    height={250}
                    fallback={
                      require("./../../../assets/images/icon/Logo.png").default
                    }
                  />
                }
              ></Card>
            </Row>

            <Row gutter={24} style={{ marginTop: 15, width: "100%" }}>
              <Col md={24}>
                <Form.Item label="ชื่อหอพัก" name="name">
                  <Input size="large" style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24} style={{ width: "100%" }}>
              <Col md={24}>
                <Form.Item name="address" label="ที่อยู่">
                  <Input.TextArea rows={4} style={{ width: "100%" }} />
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
                <LongdoMap
                  height={280}
                  id="container_map"
                  callback={initMapWithId}
                  mapKey={mapKey}
                />
              </Col>
            </Row>

            <PageHeader
              extra={[
                <Button key={1} htmlType="submit" type="primary" size="large">
                  บันทึก
                </Button>,
              ]}
            />
          </Form>
        </Card>
      </Row>
    </>
  );
};

export default DormitorySetting;
