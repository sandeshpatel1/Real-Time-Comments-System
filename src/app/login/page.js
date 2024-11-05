"use client";
import React, { useState } from "react";
import { Box, Button, TextField, Typography, Container, CssBaseline } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!username) {
      setError("Please enter a username");
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/api/login", { username });
      const { sessionId } = response.data;

      if (sessionId) {
        localStorage.setItem("sessionId", sessionId);
        localStorage.setItem("username", username); // Store username for comments page
        router.push("/comments");
      }
       else {
        setError("Failed to get session ID");
      }
    } catch (err) {
      setError("Error logging in, please try again later");
      console.error(err);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={!!error}
            helperText={error}
          />
          <Button
            type="button"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleLogin}
          >
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
