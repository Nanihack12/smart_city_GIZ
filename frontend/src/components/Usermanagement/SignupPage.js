import React, { useEffect, useState, useRef } from "react";
import logo from "./logos.png";
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  InputLabel,
  TextField,
  MenuItem,
  Select,
  Button,
  Container,
  Grid,
  AppBar,
  Toolbar,
} from "@mui/material";
import ExistingUsersTable from "./ExistingUsersTable";
// import { useNavigate } from "react-router-dom";

const styles = {
  appBar: {
    backgroundColor: "#002e41",
    paddingBottom: "8px",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    height: 40,
    marginRight: "8px",
  },
  title: {
    flexGrow: 1,
    textAlign: "center",
    color: "#fff",
    marginLeft: "-8px",
  },
};

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showExistingUsers, setShowExistingUsers] = useState(false);
  const [existingUsers, setExistingUsers] = useState([]);
  const existingUsersTableRef = useRef(null);
  // const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/auth/", { method: "GET" })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched initial data:", data); // Debug log
        setExistingUsers(data);
        if (existingUsersTableRef.current) {
          existingUsersTableRef.current.fetchUsers();
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError('Password must be at least 6 characters with at least one uppercase letter, one lowercase letter, and one special character');
      return;
    }

    if (password !== confirmPassword || !username || !email || !password) {
      setPasswordError('Please fill in all fields and ensure passwords match');
      return;
    }

    const existingUser = existingUsers.find(
      (user) => user.email === email || user.username === username
    );

    if (existingUser) {
      setPasswordError('User already exists!');
      return;
    }

    setPasswordError('');

    const response = await fetch("http://localhost:8000/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password, role }),
    });

    const json = await response.json();
    if (json.success) {
      localStorage.setItem("token", json.authtoken);
      console.log("Account Successfully Created", "success");
      alert("User Assigned successfully!");
      if (existingUsersTableRef.current) {
        existingUsersTableRef.current.fetchUsers();
      }
      // navigate("/signup");
    } else {
      console.log("Invalid Credentials", "danger");
    }
  };

  const toggleExistingUsers = () => {
    setShowExistingUsers((prevState) => {
      if (!prevState && existingUsersTableRef.current) {
        existingUsersTableRef.current.fetchUsers();
      }
      return !prevState;
    });
  };

  return (
    <Grid container spacing={2}>
    <Grid item xs={12}>
      <AppBar position="static" style={styles.appBar}>
        <Toolbar style={styles.toolbar}>
          <img src={logo} alt="Logo" style={styles.logo} />
          <Typography variant="h6" component="div" style={styles.title}>
            BYPL Dashboard
          </Typography>
          <Box>
            <Button
              color="inherit"
              variant="text"
              component={Link}
              to="/login"
              style={styles.button}
            >
              Login
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Grid>
    <Grid item xs={12}>
      <Container maxWidth="lg" mt={2}>
        <Box
          sx={{
            border: "1px solid grey",
            borderRadius: "8px",
            p: "16px",
          }}
        >
          <Box
            component="form"
            onSubmit={handleSignup}
            sx={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <TextField
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              error={!!passwordError}
              helperText={passwordError}
            />
            <TextField
              label="Confirm Password"
              type="password"
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <InputLabel shrink>Role</InputLabel>
            <Select
              autoFocus
              fullWidth
              name="Role"
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <MenuItem value="">Select Role</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="OH">OrganizationHead</MenuItem>
              <MenuItem value="CH">CircleHead</MenuItem>
              <MenuItem value="DH">DivisionHead</MenuItem>
              <MenuItem value="SDH">SubdivisionHead</MenuItem>
            </Select>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button variant="contained" color="primary" type="submit">
                Assign
              </Button>
              <Link
                component="button"
                onClick={toggleExistingUsers}
                underline="hover"
              >
                {showExistingUsers ? "Hide Existing Users" : "Show Existing Users"}
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
    </Grid>
    <Grid item xs={12}>
      {showExistingUsers && (
        <ExistingUsersTable ref={existingUsersTableRef} />
      )}
    </Grid>
  </Grid>
);
};

export default SignupPage;