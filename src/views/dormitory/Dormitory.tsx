import { Fragment, useEffect, useState } from "react";
// Alert
import Swal from "sweetalert2";

// Icons
import { GrPowerReset } from "react-icons/gr";
import { DeleteOutlined } from "@ant-design/icons";
import { AiOutlineSearch } from "react-icons/ai";

// Style
import {
  Button,
  Card,
  Col,
  Input,
  PageHeader,
  Row,
  Table,
  Form,
  Modal,
  Pagination,
} from "antd";

// Type
import { paginationDefult, TFilterPagination } from "../../types/pagination";

// API
import {
  GET_DORMITORY,
  GET_DORMITORY_BY_ID,
  DELETE_DORMITORY,
} from "../../service/api/dormitory";

// Components
import DormitoryDetail from "./DormitoryDetail";
import CreateDormitory from "./CreateDormitory";
import DormitoryManager from "./DormitoryManager";

// Type
export type TDormitorys = {
  id: number;
  name: string;
  address: string;
  lat: number;
  lon: number;
};

const Dormitory = () => {
  const [formSearch] = Form.useForm();
  const { confirm } = Modal;
  const [dormitorys, setDormitorys] = useState<TDormitorys[]>([]);
  const [dormitoryDetail, setDormitoryDetail] = useState<TDormitorys>();
  const [pagination, setPagination] =
    useState<TFilterPagination>(paginationDefult);
  const [visibleModalDetail, setVisibleModalDetail] = useState<boolean>(false);

  useEffect(() => {
    apiGetDormitoryList();
  }, []);

  // Get List
  const apiGetDormitoryList = async () => {
    const res = await GET_DORMITORY({ limit: pagination.limit });
    if (res.status === 200) {
      setDormitorys(res.results.item);
      setPagination({
        ...pagination,
        page: res.results.page,
        total: res.results.total,
      });
    }
  };

  // Dormitory Detail
  const handleDormitoryDetail = async (id: number) => {
    const res = await GET_DORMITORY_BY_ID(id);
    if (res.status === 200) {
      setDormitoryDetail(res.results);
    }
    setVisibleModalDetail(true);
  };

  // Delete Dormitory
  const apiDeleteParcel = async (id: number) => {
    const res = await DELETE_DORMITORY(id);
    if (res.status === 200) {
      apiGetDormitoryList();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "ลบข้อมูลเรียบร้อยแล้ว!",
        showConfirmButton: false,
        timer: 1200,
      });
    }
  };
  // Delete Modal
  const handleDeleleDormitory = (id: number) => {
    confirm({
      title: "ลบข้อมูลหรือไม่?",
      content: "คุณต้องการลบรายการนี้หรือไม่? ลบแล้วไม่สามารถย้อนกลับได้",
      onCancel: () => {},
      onOk: () => {
        apiDeleteParcel(id);
      },
    });
  };

  // Search
  const handleOnSubmitSearch = () => {
    formSearch.submit();
  };
  const dormitoryOnSearch = async (values: any) => {
    const res = await GET_DORMITORY({
      limit: pagination.limit,
      name: values.name,
    });
    if (res.status === 200) {
      setDormitorys(res.results.item);
      setPagination({
        ...pagination,
        page: res.results.page,
        total: res.results.total,
      });
    }
  };

  // Pagination
  const handleChangePagination = async (filter: TFilterPagination) => {
    const { limit, page } = filter;
    const formValue = formSearch.getFieldsValue();
    const res = await GET_DORMITORY({ limit, page, name: formValue.name });
    if (res.status === 200) {
      setDormitorys(res.results.item);
      setPagination({
        limit: limit,
        page: res.results.page,
        total: res.results.total,
      });
    }
  };

  const columns = [
    {
      title: "ชื่อหอพัก",
      sorter: (a: TDormitorys, b: TDormitorys) => a.name.localeCompare(b.name),
      dataIndex: "name",
    },
    {
      title: "ที่อยู่หอพัก",
      dataIndex: "address",
      sorter: (a: TDormitorys, b: TDormitorys) =>
        a.address.localeCompare(b.address),
    },
    {
      title: "รายละเอียด",
      dataIndex: "id",
      align: "center" as "center",
      render: (value: number, record: any) => {
        return (
          <>
            <DormitoryDetail id={record.id} />
          </>
        );
      },
    },
    {
      title: "จัดการ",
      dataIndex: "id",
      align: "center" as "center",
      width: "32%",
      render: (value: number, record: any) => {
        return (
          <>
            <Row gutter={22} justify="space-between">
              <Col md={8}>
                <DormitoryManager
                  id={record.id}
                  size="middle"
                  type="default"
                  styles={{
                    background: "#b100d9",
                    color: "#fff",
                    borderRadius: "8px",
                  }}
                />
              </Col>
              <Col md={7}>
                <CreateDormitory
                  onAfterSubmit={apiGetDormitoryList}
                  id={record.id}
                  size="middle"
                  type="default"
                  styles={{
                    background: "#007DFF",
                    color: "#fff",
                    borderRadius: "8px",
                  }}
                />
              </Col>
              <Col md={7}>
                <Button
                  size="middle"
                  icon={<DeleteOutlined />}
                  type="default"
                  style={{
                    background: "#FF0000",
                    color: "#fff",
                    borderRadius: "8px",
                  }}
                  onClick={() => {
                    handleDeleleDormitory(record.id);
                  }}
                >
                  ลบข้อมูล
                </Button>
              </Col>
            </Row>
          </>
        );
      },
    },
  ];

  return (
    <div>
      {/* Header */}
      <PageHeader
        title={<h2>หอพัก</h2>}
        extra={[
          <Fragment key={1}>
            <CreateDormitory
              onAfterSubmit={apiGetDormitoryList}
              size="large"
              type="default"
              styles={{
                background: "#4CAF50",
                color: "#fff",
                borderRadius: "8px",
              }}
            />
          </Fragment>,
        ]}
      />

      {/* Search and btn Reset */}
      <Card style={{ border: "none" }}>
        <div style={{ width: "100%" }}>
          <Form
            form={formSearch}
            onFinish={dormitoryOnSearch}
            onFinishFailed={(error: any) => {}}
          >
            <Row gutter={24} justify="end">
              <Col md={8}>
                <Form.Item name="name">
                  <Input
                    onChange={() => handleOnSubmitSearch()}
                    size="large"
                    placeholder="ค้นหาตามชื่อหอพัก"
                    prefix={
                      <>
                        <AiOutlineSearch style={{ marginRight: 10 }} />
                      </>
                    }
                  />
                </Form.Item>
              </Col>
              <Col md={2}>
                <Button
                  size="large"
                  onClick={() => {
                    formSearch.resetFields();
                    apiGetDormitoryList();
                  }}
                >
                  <GrPowerReset />
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
        {/* Table */}
        <div className="custom-antd-table">
          <Table
            columns={columns}
            dataSource={dormitorys}
            rowKey="id"
            pagination={false}
          />
        </div>
        {/* Pagination */}
        <Row justify="end" style={{ marginTop: 20 }}>
          <Pagination
            defaultCurrent={pagination.page}
            current={pagination.page}
            total={pagination.total}
            showTotal={(total) => `Total ${total} items`}
            pageSize={Number(pagination.limit)}
            onChange={(page: number, pageSize: number) => {
              handleChangePagination({ limit: pageSize, page: page });
            }}
            showSizeChanger
          />
        </Row>
      </Card>
    </div>
  );
};

export default Dormitory;
