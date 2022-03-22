import React, { useState, useEffect } from "react";

// REDUX
import { useAppDispatch, useAppSelector } from "../../store/store";
import { signinAsync } from "../../store/slices/authSlice";

// Style
import { Box, Button, Typography, InputAdornment } from "@mui/material";

// Icons
import MailIcon from "@mui/icons-material/Mail";
import LockIcon from "@mui/icons-material/Lock";

// Components
import { TextFieldCustom } from "./LoginStyle";

// API
// import { LOGIN } from "../../service/api/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (error) {
      setPassword("");
    }
  }, [error]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (email === "" || password === "") {
    } else {
      await dispatch(signinAsync({ email, password }));
      if (localStorage.getItem("token")) {
        console.log("localStorage::", localStorage.getItem("token"));
      }
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ backgroundColor: "#00CCCC", height: "100vh" }}
    >
      <Box
        sx={{
          backgroundColor: "#fff",
          width: "800px",
          // height: "",
          borderRadius: "30px",
        }}
      >
        <Box>
          <Box
            my={10}
            display="flex"
            justifyContent="center"
            sx={{ fontSize: "50px" }}
          >
            <Typography variant="h2">เข้าสู่ระบบ </Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                display: "flex",
                width: "100%",
                padding: "10px",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box mb={4} width="70%">
                <TextFieldCustom
                  fullWidth
                  label="อีเมล"
                  variant="outlined"
                  type="text"
                  name="email"
                  value={email}
                  onChange={(e: any) => setEmail(e.target.value)}
                  autoFocus
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <MailIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box mb={4} width="70%">
                <TextFieldCustom
                  fullWidth
                  label="รหัสผ่าน"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <LockIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                {error && (
                  <Typography sx={{ mt: 1 }} variant="body2" color="error">
                    {error}
                  </Typography>
                )}
                {!error && (
                  <Typography sx={{ mt: 1 }} variant="body2" color="#fff">
                    *
                  </Typography>
                )}
              </Box>
              <Box mb={20} width="70%">
                <Button fullWidth type="submit" variant="contained">
                  <Typography variant="subtitle1" color="#fff">
                    {loading ? "กำลังโหลด..." : "เข้าสู่ระบบ"}
                  </Typography>
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
}
