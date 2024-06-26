import React, { useState, useEffect, useRef } from "react";
import { AppBar, Toolbar, Box, Typography, TextField, Checkbox, FormControlLabel, Button, Container,   Dialog, } from "@mui/material";
import {  useNavigate } from "react-router-dom";
// import CloseIcon from "@mui/icons-material/Close";
import logo from "./logos.png";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ReplayIcon from "@mui/icons-material/Replay";

// const existingUsers = [
//   { username: "user1", email: "user1@example.com", password: "password1" },
//   { username: "user2", email: "user2@example.com", password: "password2" },
//   { username: "user3", email: "user3@example.com", password: "password3" },
// ];

const styles = {
  appBar: {
    backgroundColor: "#002e41",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    height: 40,
    marginRight: 16,
  },
  title: {
    flexGrow: 1,
    textAlign: "center",
    color: "#fff",
  },
  button: {
    color: "#fff",
    marginLeft: 16,
    textDecoration: "none",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "calc(100vh - 64px)",
  },
  loginForm: {
    border: "1px solid grey",
    padding: 6,
    borderRadius: 3,
    width: "500px",
    backgroundColor: "#fff",
  },
  loginFormItem: {
    marginBottom: 25,
  },
  forgotPasswordLink: {
    textAlign: "right",
    color: "#002e41",
    marginBottom: 10,
    cursor: "pointer",
  },
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalCloseButton: {
    cursor: "pointer",
  },
  sessionTimeoutDialog: {
    width: "600px",
    padding: "48px",
    backgroundColor: "#f3e5f5", // Light purple background color
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  errorIcon: {
    fontSize: "96px", // Increased icon size
    color: "#c51162", // Attractive red color
    marginBottom: "24px",
  },
  sessionTimeoutText: {
    marginBottom: "16px",
    fontWeight: "bold", // Bold text for better visibility
  },
  loginAgainText: {
    display: "flex",
    alignItems: "center",
    marginBottom: "32px", // Increased bottom margin for better spacing
    fontSize: "18px", // Increased font size for better readability
  },
  loginAgainIcon: {
    marginRight: "8px",
  },
};

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  // const [openForgotPasswordModal, setOpenForgotPasswordModal] = useState(false);
  // const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [sessionTimeoutAlert, setSessionTimeoutAlert] = useState(false);
  const navigate = useNavigate();
  const sessionTimer = useRef(null);

  useEffect(() => {
    const startSessionTimer = () => {
      const sessionDuration = 1 * 24 * 60 * 60 * 1000; // 5 seconds for testing, adjust as needed
      return setTimeout(() => {
        setSessionTimeoutAlert(true);
      }, sessionDuration);
    };

    const resetTimer = () => {
      clearTimeout(sessionTimer.current);
      sessionTimer.current = startSessionTimer();
    };

    sessionTimer.current = startSessionTimer();

    document.addEventListener("mousemove", resetTimer);
    document.addEventListener("keypress", resetTimer);

    return () => {
      clearTimeout(sessionTimer.current);
      document.removeEventListener("mousemove", resetTimer);
      document.removeEventListener("keypress", resetTimer);
    };
  }, []);

  const handleSessionTimeoutAlertClose = () => {
    setSessionTimeoutAlert(false);
    navigate("/login");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError('Password must be at least 6 characters with at least one uppercase letter, one lowercase letter, and one special character');
      return;
    }

    setPasswordError('');

    const response = await fetch("http://localhost:8000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: username, password: password }),
    });
    const json = await response.json();
    if (json.success) {
      localStorage.setItem("token", json.authtoken);
      if (json.role === "Admin") {
        navigate("/Admin");
      } else if (json.role === "OH") {
        navigate("/Organizationhead");
      } else if (json.role === "CH") {
        navigate("/Circlehead");
      } else if (json.role === "DH") {
        navigate("/Divisionhead");
      } else if (json.role === "SDH") {
        navigate("/Subdivisionhead");
      }
    } else {
      alert("Please provide valid credentials!!");
    }
  };

  // const handleForgotPassword = () => {
  //   setOpenForgotPasswordModal(true);
  // };

  // const handleForgotPasswordModalClose = () => {
  //   setOpenForgotPasswordModal(false);
  //   setForgotPasswordEmail("");
  // };

  // const handleForgotPasswordSubmit = () => {
  //   const existingUser = existingUsers.find(
  //     (user) => user.email.toLowerCase() === forgotPasswordEmail.toLowerCase()
  //   );

  //   if (existingUser) {
  //     const resetPasswordLink = `https://yourapp.com/reset-password?email=${existingUser.email}`;
  //     alert(
  //       `Reset password link sent to ${existingUser.email}: ${resetPasswordLink}`
  //     );
  //     handleForgotPasswordModalClose();
  //   } else {
  //     alert("Email not found");
  //   }
  // };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <AppBar position="static" style={styles.appBar}>
        <Toolbar style={styles.toolbar}>
          <Box display="flex" alignItems="center">
            <img src={logo} alt="Logo" style={styles.logo} />
          </Box>
          <Typography variant="h6" component="div" align="center" style={styles.title}>
            BYPL Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm" style={styles.container}>
        <Box sx={styles.loginForm}>
          <Typography variant="h5" component="div" gutterBottom>
            Login
          </Typography>
          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <TextField
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={styles.loginFormItem}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.loginFormItem}
              error={!!passwordError}
              helperText={passwordError}
            />
            <FormControlLabel
              control={<Checkbox color="primary" />}
              label="Remember me"
            />
            {/* <Link
              href="#"
              variant="body2"
              color="primary"
              underline="none"
              style={styles.forgotPasswordLink}
              onClick={handleForgotPassword}
            >
              Forgot password?
            </Link> */}
            <Button variant="contained" color="primary" type="submit">
              Login
            </Button>
          </Box>
        </Box>
      </Container>
    
      {/* <Modal
        open={openForgotPasswordModal}
        onClose={handleForgotPasswordModalClose}
      >
        <Box sx={styles.modal}>
          <Box sx={styles.modalHeader}>
            <Typography variant="h6" gutterBottom>
              Forgot Password
            </Typography>
            <IconButton
              onClick={handleForgotPasswordModalClose}
              sx={styles.modalCloseButton}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <TextField
            label="Email"
            variant="outlined"
            value={forgotPasswordEmail}
            onChange={(e) => setForgotPasswordEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleForgotPasswordSubmit}
            fullWidth
          >
            Submit
          </Button>
        </Box>
      </Modal>
     */}
      <Dialog
        open={sessionTimeoutAlert}
        onClose={handleSessionTimeoutAlertClose}
        PaperProps={{
          style: styles.sessionTimeoutDialog,
        }}
      >
        <ErrorOutlineIcon style={styles.errorIcon} />
        <Typography variant="h5" gutterBottom style={styles.sessionTimeoutText}>
          Oops!
        </Typography>
        <Typography variant="body1" gutterBottom style={styles.sessionTimeoutText}>
          Your session is expired.
        </Typography>
        <Box style={styles.loginAgainText}>
          <ReplayIcon style={styles.loginAgainIcon} />
          <Typography variant="body1">Please kindly login again</Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSessionTimeoutAlertClose}
          autoFocus
        >
          OK
        </Button>
      </Dialog>
    </Box>
    );
  };
  export default LoginPage;