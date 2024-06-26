import React, { useState, useRef, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Dialog, Container, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AlarmIcon from '@mui/icons-material/Alarm';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Analytics from '@mui/icons-material/Analytics';
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ReplayIcon from "@mui/icons-material/Replay";
import logo from './logos.png';
// import backgroundImg from './BYPLimage.jpg'; // import your background image here

const styles = {
  appBar: {
    backgroundColor: '#002e41', // Material-UI primary color
    zIndex: 1201, // Ensure AppBar is above other elements
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    height: 40,
    marginRight: 16, // Add some spacing between the logo and title
  },
  title: {
    flexGrow: 1,
    textAlign: 'center',
    color: '#fff', // Set text color to white for better visibility
  },
  button: {
    color: '#fff', // Set text color to white for better visibility
    marginLeft: 16, // Add some spacing between the buttons
    textDecoration: 'none', // Remove underline from the link
  },
  container: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center', // Center the text
    padding: '20px', // Add some padding for spacing
  },
  drawer: {
    width: 250,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 250,
    marginTop: 64, // Adjust to make space for the app bar
  },
  body: {
    // backgroundImage: `url(${backgroundImg})`,
    backgroundColor: '#F5F5F5',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
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

const Admin = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
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

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleUserClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    // Redirect to login page
    navigate('/login');
  };

  return (
    <Box style={styles.body}>
      <AppBar position="fixed" style={styles.appBar}>
        <Toolbar style={styles.toolbar}>
          <IconButton color="inherit" onClick={handleDrawerOpen}>
            <MenuIcon />
          </IconButton>
          <img src={logo} alt="Logo" style={styles.logo} />
          <Typography variant="h5" component="div" style={styles.title}>
            Admin Dashboard
          </Typography>
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
          <IconButton color="inherit">
            <AlarmIcon />
          </IconButton>
          <IconButton color="inherit" onClick={handleUserClick}>
            <AccountCircleIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerClose}
        sx={{ ...styles.drawer, ...styles.drawerPaper }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 1 }}>
          <IconButton color="inherit" onClick={handleDrawerClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          <ListItem button component={Link} to="/analytical">
            <ListItemIcon>
              <Analytics />
            </ListItemIcon>
            <ListItemText primary="Analytical view" />
          </ListItem>
          {/* <ListItem button component={Link} to="/alarmlog">
            <ListItemIcon>
              <AlarmIcon />
            </ListItemIcon>
            <ListItemText primary="Alarmlog" />
          </ListItem>
          <ListItem button component={Link} to="/logstore">
            <ListItemIcon>
              <Description />
            </ListItemIcon>
            <ListItemText primary="Logstore" />
          </ListItem> */}
          <ListItem button component={Link} to="/Assign">
            <ListItemIcon>
              <PersonAddAltIcon />
            </ListItemIcon>
            <ListItemText primary="Assign" />
          </ListItem>
        </List>
      </Drawer>
      <Container maxWidth="md" style={styles.container}>
        <Typography variant="h4" component="div" gutterBottom>
          Welcome to the Admin Dashboard
        </Typography>
      </Container>

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

export default Admin;
