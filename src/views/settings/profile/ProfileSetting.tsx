import React, { useEffect, useState } from "react";

// Style
import { PageHeader, Card } from "antd";
import { Box, Typography, Grid } from "@mui/material";

// REDUX
import { useAppSelector } from "../../../store/store";

// API
import { GET_USER_BY_ID } from "../../../service/api/users";
import { TUsers } from "../../../types/users";

// Compoenents
import ProfileEdit from "./ProfileEdit";

function ProfileSetting() {
  const { userId } = useAppSelector((state) => state.auth);
  const [user, setUser] = useState<TUsers>();

  useEffect(() => {
    apiGetUserList();
  }, []);

  const apiGetUserList = async () => {
    if (userId) {
      const res = await GET_USER_BY_ID(userId);
      if (res.status === 200) {
        setUser(res.results);
      }
    }
  };

  return (
    <Box mx={10}>
      <PageHeader title={<h2>โปรไฟล์</h2>} />
      <Grid container spacing={2}>
        <Grid item xs>
          <Card
            style={{
              display: "flex",
              flexWrap: "wrap",
              borderRadius: 20,
              border: "solid 2px #000",
            }}
          >
            <Box sx={{ mb: "14px" }}>
              <Box sx={{ mb: "8px" }}>
                <Typography sx={{ mr: "10px", fontWeight: "600" }}>
                  เลขบัตรประชาชน
                </Typography>
              </Box>
              <Box sx={{ ml: "16px" }}>
                <Typography sx={{ mr: "10px" }}>
                  {user?.identityCard}
                </Typography>
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
          </Card>
        </Grid>
        {/* Component */}
        <ProfileEdit onAfterSubmit={apiGetUserList} user={user} />
      </Grid>
    </Box>
  );
}

export default ProfileSetting;
