import React from "react";

// Style
import { Card, Modal, PageHeader } from "antd";
import { Box, Typography } from "@mui/material";

// Type
import { TRoomCategory } from "../../../types/room-category";

type TProps = {
  roomCate?: TRoomCategory;
  open: boolean;
  close: (value: boolean) => void;
};

const DetailRoomCategories = (props: TProps) => {
  const { roomCate, open, close } = props;
  const nf = Intl.NumberFormat();

  const hideModal = () => {
    close(false);
  };

  return (
    <>
      <Modal
        className="custom-ant-modal"
        visible={open}
        onCancel={hideModal}
        title={<h3>รายละเอียดประเภทห้อง</h3>}
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
                <Typography sx={{ fontWeight: "600" }}>ประเภทห้อง</Typography>
              </Box>
              <Box sx={{ ml: "16px" }}>
                <Typography sx={{ mr: "10px" }}>
                  {roomCate?.categoryName}
                </Typography>
              </Box>
            </Box>
            <Box width="200px">
              <Box sx={{ mb: "8px" }}>
                <Typography sx={{ mr: "10px", fontWeight: "600" }}>
                  ราคา/เดือน ฿
                </Typography>
              </Box>
              <Box sx={{ ml: "16px" }}>
                <Typography sx={{ mr: "10px" }}>
                  {nf.format(Number(roomCate?.price))} ฿
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box>
            <Box sx={{ mb: "8px" }}>
              <Typography sx={{ mr: "10px", fontWeight: "600" }}>
                รายละเอียด
              </Typography>
            </Box>
            <Box sx={{ ml: "16px" }}>
              <Typography sx={{ mr: "10px", wordWrap: "break-word" }}>
                {roomCate?.details}
              </Typography>
            </Box>
          </Box>
        </Card>
        <PageHeader />
      </Modal>
    </>
  );
};

export default DetailRoomCategories;
