import { Box, Typography } from "@mui/material";
// Style
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  PageHeader,
  Pagination,
  Row,
  Select,
  Table,
} from "antd";

import { Fragment, useEffect, useState } from "react";
// Alert
import Swal from "sweetalert2";

// Type
import { paginationDefult, TFilterPagination } from "../../types/pagination";

import { AiOutlineSearch } from "react-icons/ai";
import ApproveRepairModal from "./ApproveRepairModal";
// Components
import CreateRepairs from "./CreateRepairs";
import DetailsRepair from "./DetailsRepair";
import DoneRepairModal from "./DoneReapairModal";
// API
import { DELETE_REPAIR, GET_REPAIR } from "../../service/api/repairs";
// Icon
import { GrPowerReset } from "react-icons/gr";
import ProcessingRepairModal from "./ProcessingRepairModal";
import { STATUS_REPAIR } from "../../enums/repair";
import { DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
// REDUX
import { useAppSelector } from "../../store/store";

const Repair = () => {
  const [formSearch] = Form.useForm();
  const { confirm } = Modal;
  const [repair, setRepair] = useState<any>([]);
  const [pagination, setPagination] =
    useState<TFilterPagination>(paginationDefult);
  const { dormitoryId } = useAppSelector((state) => state.auth);

  useEffect(() => {
    apiGetRepair();
  }, []);

  // api section

  const onSearchRepair = async (values: any) => {
    let search = {};
    if (values.createdAt) {
      search = {
        ...search,
        createdAt: moment(values.createdAt).format("YYYY-MM-DD"),
      };
    }
    if (values.convenientDate) {
      search = {
        ...search,
        convenientDate: moment(values.convenientDate).format("YYYY-MM-DD"),
      };
    }
    if (values.status) {
      search = { ...search, status: values.status };
    }
    if (values.roomNumber) {
      search = { ...search, roomNumber: values.roomNumber };
    }

    const res = await GET_REPAIR({
      ...search,
      dormitoryId: dormitoryId,
    });

    if (res.status === 200) {
      setRepair(res.results.item);
      setPagination({
        limit: pagination.limit,
        page: res.results.page,
        total: res.results.total,
      });
    }
  };

  const apiGetRepair = async () => {
    const res = await GET_REPAIR({
      limit: pagination.limit,
      page: 1,
      getAll: false,
      dormitoryId,
    });
    if (res.status === 200) {
      setRepair(res.results.item);
      setPagination({
        ...pagination,
        page: res.results.page,
        total: res.results.total,
      });
    }
  };

  const apiDeleteParcel = async (id: number) => {
    const res = await DELETE_REPAIR(id);
    if (res.status === 200) {
      apiGetRepair();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "ลบข้อมูลเรียบร้อยแล้ว!",
        showConfirmButton: false,
        timer: 1200,
      });
    }
  };

  // handle section
  const handleDeleleParcel = (id: number) => {
    confirm({
      title: "ลบข้อมูลหรือไม่?",
      content: "คุณต้องการลบรายการนี้หรือไม่? ลบแล้วไม่สามารถย้อนกลับได้",
      onCancel: () => {},
      onOk: () => {
        apiDeleteParcel(id);
      },
    });
  };

  const handleChangePagination = async (filter: TFilterPagination) => {
    const { limit, page } = filter;
    let search = {};
    const values = formSearch.getFieldsValue();
    if (values.createdAt) {
      search = {
        ...search,
        createdAt: moment(values.createdAt).format("YYYY-MM-DD"),
      };
    }
    if (values.convenientDate) {
      search = {
        ...search,
        convenientDate: moment(values.convenientDate).format("YYYY-MM-DD"),
      };
    }
    if (values.status) {
      search = { ...search, status: values.status };
    }
    if (values.roomNumber) {
      search = { ...search, roomNumber: values.roomNumber };
    }
    const res = await GET_REPAIR({
      ...search,
      limit,
      page,
      dormitoryId: dormitoryId,
    });
    if (res.status === 200) {
      setRepair(res.results.item);
      setPagination({
        limit: limit,
        page: res.results.page,
        total: res.results.total,
      });
    }
  };

  const handleOnSubmitSearch = () => {
    formSearch.submit();
  };

  const columns = [
    {
      title: "หมายเลขห้อง",
      dataIndex: "roomNumber",
      sorter: (a: any, b: any) => a.roomNumber.localeCompare(b.roomNumber),
    },
    {
      title: "วันที่แจ้งซ่อม",
      dataIndex: "createdAt",
      sorter: (a: any, b: any) =>
        moment(a.createdAt)
          .format("YYYY-MM-DD")
          .localeCompare(moment(b.createdAt).format("YYYY-MM-DD")),
      render: (value: Date) => {
        return <>{moment(value).format("YYYY-MM-DD")}</>;
      },
    },
    {
      title: "วันที่สะดวกเข้าซ่อม",
      dataIndex: "convenientDate",
      sorter: (a: any, b: any) =>
        moment(a.createdAt)
          .format("YYYY-MM-DD")
          .localeCompare(moment(b.createdAt).format("YYYY-MM-DD")),
      render: (value: Date) => {
        return <>{moment(value).format("YYYY-MM-DD")}</>;
      },
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      align: "center" as "center",
      render: (value: STATUS_REPAIR) => (
        <Box display="flex" justifyContent="center">
          {value === STATUS_REPAIR.WAITING ? (
            <Box
              py={0.5}
              px={4}
              sx={{
                backgroundColor: "#FFCC00",
                borderRadius: "40px",
                width: "140px",
                textAlign: "center",
              }}
            >
              <Typography variant="body2">รอการอนุมัติ</Typography>
            </Box>
          ) : value === STATUS_REPAIR.APPROVED ? (
            <Box
              py={0.5}
              px={4}
              sx={{
                backgroundColor: "#DA70D6",
                borderRadius: "40px",
                width: "140px",
                textAlign: "center",
              }}
            >
              <Typography variant="body2">รอดำเนินการ</Typography>
            </Box>
          ) : value === STATUS_REPAIR.PROCESSING ? (
            <Box
              py={0.5}
              px={4}
              sx={{
                backgroundColor: "#33FFCC",
                borderRadius: "40px",
                width: "140px",
                textAlign: "center",
              }}
            >
              <Typography variant="body2">กำลังดำเนินการ</Typography>
            </Box>
          ) : (
            <Box
              py={0.5}
              px={4}
              sx={{
                backgroundColor: "#0099FF",
                borderRadius: "40px",
                width: "140px",
                textAlign: "center",
              }}
            >
              <Typography variant="body2">เสร็จสิ้น</Typography>
            </Box>
          )}
        </Box>
      ),
    },
    {
      title: "รายละเอียด",
      dataIndex: "id",
      align: "center" as "center",
      render: (value: number, record: any) => {
        return <DetailsRepair id={record.id} />;
      },
    },
    {
      title: "จัดการ",
      dataIndex: "id",
      align: "center" as "center",
      width: "20%",
      render: (value: number, record: any) => {
        return (
          <>
            <Row gutter={24} justify="space-between">
              <Col md={12}>
                {record.status === STATUS_REPAIR.WAITING ? (
                  <ApproveRepairModal
                    id={record.id}
                    onAfterSubmit={apiGetRepair}
                  />
                ) : record.status === STATUS_REPAIR.APPROVED ? (
                  <ProcessingRepairModal
                    id={record.id}
                    onAfterSubmit={apiGetRepair}
                  />
                ) : record.status === STATUS_REPAIR.PROCESSING ? (
                  <DoneRepairModal
                    id={record.id}
                    onAfterSubmit={apiGetRepair}
                  />
                ) : null}
              </Col>
              <Col md={12}>
                <Button
                  type="default"
                  style={{
                    background: "#FF0000",
                    color: "#fff",
                    borderRadius: "8px",
                  }}
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    handleDeleleParcel(record.id);
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
      <PageHeader
        title={<h2>แจ้งซ่อม</h2>}
        extra={[
          <Fragment key={1}>
            <CreateRepairs onAfterSubmit={apiGetRepair} />
          </Fragment>,
        ]}
      />

      <Card style={{ border: "none" }}>
        <div style={{ width: "100%" }}>
          <Form
            form={formSearch}
            onFinish={onSearchRepair}
            onFinishFailed={(error: any) => {}}
          >
            <Row gutter={24} justify="end">
              <Col md={4}>
                <Form.Item name="createdAt">
                  <DatePicker
                    style={{
                      width: "100%",
                    }}
                    format="YYYY-MM-DD"
                    size="large"
                    placeholder="วันที่แจ้งซ่อม"
                    onChange={() => handleOnSubmitSearch()}
                  />
                </Form.Item>
              </Col>
              <Col md={4}>
                <Form.Item name="convenientDate">
                  <DatePicker
                    style={{
                      width: "100%",
                    }}
                    format="YYYY-MM-DD"
                    size="large"
                    placeholder="วันที่สะดวกเข้าซ่อม"
                    onChange={() => handleOnSubmitSearch()}
                  />
                </Form.Item>
              </Col>
              <Col md={4}>
                <Form.Item name="status">
                  <Select
                    placeholder="สถานะ"
                    size="large"
                    onChange={() => handleOnSubmitSearch()}
                  >
                    <Select.Option value={STATUS_REPAIR.WAITING}>
                      รอการอนุมัติ
                    </Select.Option>
                    <Select.Option value={STATUS_REPAIR.APPROVED}>
                      รอดำเนินการ
                    </Select.Option>
                    <Select.Option value={STATUS_REPAIR.PROCESSING}>
                      กำลังดำเนินการ
                    </Select.Option>
                    <Select.Option value={STATUS_REPAIR.DONE}>
                      เสร็จสิ้น
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col md={5}>
                <Form.Item name="roomNumber">
                  <Input
                    onChange={() => handleOnSubmitSearch()}
                    size="large"
                    placeholder="ค้นหาหมายเลขห้อง"
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
                    apiGetRepair();
                  }}
                >
                  <GrPowerReset />
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="custom-antd-table">
          <Table
            columns={columns}
            dataSource={repair}
            rowKey="id"
            pagination={false}
          />
        </div>
        <Row justify="end" style={{ marginTop: 20 }}>
          <Pagination
            defaultCurrent={pagination.page}
            current={pagination.page}
            total={pagination.total}
            pageSize={pagination.limit}
            showTotal={(total) => `Total ${total} items`}
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

export default Repair;
