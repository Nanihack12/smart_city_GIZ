import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Container, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AlarmIcon from '@mui/icons-material/Alarm';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Analytics, Description } from '@mui/icons-material';
import logo from './logos.png';
import { useNavigate } from 'react-router-dom';
import backgroundImg from './BYPLimage.jpg'; // import your background image here

const styles = {
  appBar: {
    backgroundColor: '#002e41', // Material-UI primary color
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
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundImage: `url(${backgroundImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
  },
};

const Admin = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

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
          <IconButton color="inherit" onClick={handleUserClick} style={styles.closeIcon}>
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
          <ListItem button component={Link} to="/signup">
            <ListItemIcon>
              <PersonAddAltIcon />
            </ListItemIcon>
            <ListItemText primary="Assign" />
          </ListItem>
        </List>
      </Drawer>
      <Container maxWidth="md" style={styles.container}>
        
      </Container>
    </Box>
    
  );
};

export default Admin;
