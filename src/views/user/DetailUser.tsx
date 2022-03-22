import React, { useState, useEffect } from "react";

// Style
import { Card, Modal, PageHeader, Divider } from "antd";
import { Box, Typography } from "@mui/material";

// Type
import { TUserRoom } from "../../types/users";

type TProps = {
  user?: TUserRoom;
  open: boolean;
  close: (value: boolean) => void;
};

const DetailUser = (props: TProps) => {
  const { user, open, close } = props;
  const [roleUser, setRoleUser] = useState<string>("");

  useEffect(() => {
    setRoleUser(user?.role.title);
  }, [user]);

  const hideModal = () => {
    close(false);
  };

  return (
    <>
      <Modal
        className="custom-ant-modal"
        visible={open}
        onCancel={hideModal}
        title={<h3>รายละเอียดผู้เช่า</h3>}
        width={550}
        footer={false}
      >
        <Card
          style={{
            display: "flex",
            flexWrap: "wrap",
            borderRadius: 20,
            border: "solid 2px #000",
          }}
        >
          <Box sx={{ display: "flex", mb: "14px" }}>
            <Box width="200px">
              <Box sx={{ mb: "8px" }}>
                <Typography sx={{ fontWeight: "600" }}>
                  เลขบัตรประชาชน
                </Typography>
              </Box>
              <Box sx={{ ml: "16px" }}>
                <Typography sx={{ mr: "10px" }}>
                  {user?.identityCard}
                </Typography>
              </Box>
            </Box>
            <Box width="200px">
              <Box sx={{ mb: "8px" }}>
                <Typography sx={{ mr: "10px", fontWeight: "600" }}>
                  บทบาท
                </Typography>
              </Box>
              <Box sx={{ ml: "16px" }}>
                <Typography sx={{ mr: "10px" }}>
                  {roleUser === "staff" ? "พนักงาน" : "ผู้เช่า"}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: "flex", mb: "14px" }}>
            <Box width="200px">
              <Box sx={{ mb: "8px" }}>
                <Typography sx={{ fontWeight: "600" }}>ชื่อผู้ใช้</Typography>
              </Box>
              <Box sx={{ ml: "16px" }}>
                <Typography sx={{ mr: "10px" }}>{user?.username}</Typography>
              </Box>
            </Box>
            <Box width="200px">
              <Box sx={{ mb: "8px" }}>
                <Typography sx={{ mr: "10px", fontWeight: "600" }}>
                  อีเมล
                </Typography>
              </Box>
              <Box sx={{ ml: "16px" }}>
                <Typography sx={{ mr: "10px" }}>{user?.email}</Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: "flex", mb: "14px" }}>
            <Box width="200px">
              <Box sx={{ mb: "8px" }}>
                <Typography sx={{ mr: "10px", fontWeight: "600" }}>
                  ชื่อ-นามกสุล
                </Typography>
              </Box>
              <Box sx={{ ml: "16px" }}>
                <Typography sx={{ mr: "10px" }}>
                  {user?.firstName} {user?.lastName}
                </Typography>
              </Box>
            </Box>
            <Box width="180px">
              <Box sx={{ mb: "8px" }}>
                <Typography sx={{ mr: "10px", fontWeight: "600" }}>
                  เบอร์โทร
                </Typography>
              </Box>
              <Box sx={{ ml: "16px" }}>
                <Typography sx={{ mr: "10px" }}>{user?.tel}</Typography>
              </Box>
            </Box>
            <Box>
              <Box sx={{ mb: "8px" }}>
                <Typography sx={{ mr: "10px", fontWeight: "600" }}>
                  เพศ
                </Typography>
              </Box>
              <Box sx={{ ml: "16px" }}>
                <Typography sx={{ mr: "10px" }}>{user?.gender}</Typography>
              </Box>
            </Box>
          </Box>

          <Box>
            <Box sx={{ mb: "8px" }}>
              <Typography sx={{ mr: "10px", fontWeight: "600" }}>
                ที่อยู่
              </Typography>
            </Box>
            <Box sx={{ ml: "16px" }}>
              <Typography sx={{ mr: "10px", wordWrap: "break-word" }}>
                {user?.address}
              </Typography>
            </Box>
          </Box>

          <Divider />
          <Box>
            <Box sx={{ mb: "8px" }}>
              <Typography sx={{ mr: "10px", fontWeight: "600" }}>
                หมายเลขห้อง
              </Typography>
            </Box>
            <Box sx={{ ml: "16px" }}>
              <Box>
                {user?.room.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "inline-flex",
                      ml: "16px",
                      width: "45%",
                    }}
                  >
                    <Box>
                      {index + 1}. {item.roomNumber}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Card>
        <PageHeader />
      </Modal>
    </>
  );
};

export default DetailUser;
