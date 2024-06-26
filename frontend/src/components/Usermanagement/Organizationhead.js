import React, { useEffect, useState, useRef } from 'react';
import {
  useTheme,
  useMediaQuery,
  makeStyles,
  Hidden,
  Drawer,
  IconButton,
  Divider,
  Badge,
  Menu,
  MenuItem,
  Card,
  CardContent,
  Typography,
  Button,
  Popover,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  InputLabel,
} from '@material-ui/core';
import {
  AppBar,
  Toolbar,
  List,
  Box,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import {
  Dashboard as DashboardIcon,
  Add as AddIcon,
  Menu as MenuIcon,
  NotificationsActive as NotificationsIcon,
  Alarm as AlarmIcon,
 
  ChevronLeft as ChevronLeftIcon,
} from '@material-ui/icons';
import { Link, useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import { MdLocalGroceryStore } from 'react-icons/md';
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ReplayIcon from "@mui/icons-material/Replay";
import yourImage from './logos.png';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100vh',
  },
  appBar: {
    backgroundColor: '#155F82',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(0, 2),
  },
  logo: {
    height: '50px',
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  dropdownButton: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: theme.spacing(0.5, 2),
    borderRadius: '20px',
    backgroundColor: 'transparent',
    marginRight: theme.spacing(1),
    border: '1px solid transparent',
    transition: 'background-color 0.3s',
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
  },
  dropdownMenu: {
    marginTop: theme.spacing(1),
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: '#fff',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  listItem: {
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
  },
  notificationCard: {
    marginBottom: theme.spacing(1),
    position: 'relative',
  },
  notificationCardContent: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  markAsReadButton: {
    backgroundColor: '#FF8000',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#FFA500',
    },
    fontSize: '0.7rem',
    padding: theme.spacing(0.2, 1),
    minWidth: 'unset',
    height: 'unset',
    borderRadius: '10px',
    alignSelf: 'flex-end',
    marginBottom: theme.spacing(1),
  },
  popover: {
    padding: theme.spacing(2),
  },
  content: {
    flexGrow: 1,
    padding: 0,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
    marginTop: theme.mixins.toolbar.minHeight,
    height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`,
    overflow: 'hidden',
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  iframeContainer: {
    width: '100%',
    height: '100%',
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
  },
}));

const styles = {
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

const OrganizationHeadPage = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [sessionTimeoutAlert, setSessionTimeoutAlert] = useState(false);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [ncount, setNcount] = useState(0);
  const [acount, setAcount] = useState(0);
  const [ setItems] = useState([]);
  const [issue, setIssue] = useState([]);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  // const [dropdownAnchorEl, setDropdownAnchorEl] = useState(null);
  // const [selectedOption, setSelectedOption] = useState('DTR');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [closedNotifications, setClosedNotifications] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false); // Dialog state
  const [addData, setAddData] = useState({
    phase: "",
    parameter: "",
    range_min: 0,
    range_max: 0,
    parameter_units: "",
  });
  const [addErrors, setAddErrors] = useState({});
  const [id,] = useState(null); // Add id state
  const [ setCloseErrors] = useState({});
  const [ setOpenCloseDialog] = useState(false);
  const [closeData, setCloseData] = useState({
    problem: "",
    status: "",
    remark: "",
  });
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
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleUserClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleInputChange = (event, dataType) => {
    const data = dataType === "add" ? addData : closeData;
    const setData = dataType === "add" ? setAddData : setCloseData;
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleCloseDialog = (dialogType) => {
    if (dialogType === "add") {
      setOpenAddDialog(false);
      setAddErrors({});
    } else if (dialogType === "close") {
      setOpenCloseDialog(false);
      setCloseErrors({});
    }
  };

  const handleSubmit = (dataType) => {
    const data = dataType === "add" ? addData : closeData;
    const setData = dataType === "add" ? setAddData : setCloseData;
    const errors = {};
    let hasErrors = false;
  
    // Check for empty fields
    for (const key in data) {
      if (!data[key]) {
        errors[key] = "Required";
        hasErrors = true;
      }
    }
  
    if (hasErrors) {
      if (dataType === "add") {
        setAddErrors(errors);
      } else if (dataType === "close") {
        setCloseErrors(errors);
      }
      return;
    }
  
    const endpoint =
      dataType === "add"
        ? "http://127.0.0.1:8000/conditions/add"
        : `http://127.0.0.1:8000/alarm/renew/${id}`;
  
    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((responseData) => {
        // Check if the status is "Resolved"
        if (dataType === "close" && data.status === "Resolved") {
          // If status is "Resolved", remove the log from items state
          setItems((prevItems) =>
            prevItems.filter((item) => item.id !== id)
          );
        }
        console.log(responseData);
      })
      .catch((error) => {
        console.log(error.message);
      });
  
    // Clear form data and close dialog
    setData(
      dataType === "add"
        ? {
            phase: "",
            parameter: "",
            range_min: 0,
            range_max: 0,
            parameter_units: "",
          }
        : {
            problem: "",
            status: "",
            remark: "",
          }
    );
    handleCloseDialog(dataType);
  };

  const handleNotificationOpen = async (event) => {
    setNotificationAnchorEl(event.currentTarget);
    try {
      const response = await fetch('http://127.0.0.1:8000/alarm/notidata');
      const data = await response.json();
      const notificationsWithTimestamp = data.map((item) => ({
        ...item,
        timestamp: generateTimestamp(),
      }));
      setIssue(notificationsWithTimestamp);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    navigate('/login');
  };

  const markAsRead = (id) => {
    const closedNotification = issue.find((item) => item.id === id);
    setClosedNotifications((prevNotifications) => [
      ...prevNotifications,
      closedNotification,
    ]);
    localStorage.setItem(
      `notification_${id}`,
      JSON.stringify(closedNotification)
    );
    setIssue((prevIssue) => prevIssue.filter((item) => item.id !== id));
    if (issue.length === 1) {
      handleNotificationClose();
    }
  };

  // const handleDropdownOpen = (event) => {
  //   setDropdownAnchorEl(event.currentTarget);
  // };

  // const handleDropdownClose = (option) => {
  //   setSelectedOption(option);
  //   setDropdownAnchorEl(null);
  // };

  const generateTimestamp = () => {
    const currentDate = new Date();
    return currentDate.toLocaleString();
  };

  const handleOpenAddDialog = () => { // Open dialog function
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => { // Close dialog function
    setOpenAddDialog(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ncountResponse = await fetch(
          'http://127.0.0.1:8000/alarm/ncount'
        );
        const ncountData = await ncountResponse.json();
        setNcount(ncountData[0]);

        const acountResponse = await fetch(
          'http://127.0.0.1:8000/alarm/acount'
        );
        const acountData = await acountResponse.json();
        setAcount(acountData[0]);

        const closedNotificationsFromStorage = Object.keys(localStorage)
          .filter((key) => key.startsWith('notification_'))
          .map((key) => JSON.parse(localStorage.getItem(key)));
        setClosedNotifications(closedNotificationsFromStorage);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchData();
  }, []);

  const filteredIssue = issue.filter(
    (item) => !closedNotifications.some((closedItem) => closedItem.id === item.id)
  );

  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        className={`${classes.appBar} ${drawerOpen && classes.appBarShift}`}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            edge="start"
            className={drawerOpen ? '' : classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Hidden xsDown>
            <img src={yourImage} alt="Your company logo" className={classes.logo} />
          </Hidden>
          <Typography variant="h6" noWrap className={classes.title}>
            OrganizationHead Dashboard
            <div
              className={classes.dropdownButton}
              // onClick={handleDropdownOpen}
            >
              {/* <span>{selectedOption}</span> */}
              {/* <ArrowDropDownIcon /> */}
            </div>
            {/* <Menu
              anchorEl={dropdownAnchorEl}
              open={Boolean(dropdownAnchorEl)}
              onClose={handleDropdownClose}
              className={classes.dropdownMenu}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <MenuItem onClick={() => handleDropdownClose('DTR')}>DTR</MenuItem>
              <MenuItem onClick={() => handleDropdownClose('ACB')}>ACB</MenuItem>
            </Menu> */}
          </Typography>
          <div>
            <IconButton color="inherit" onClick={handleNotificationOpen}>
              <Badge badgeContent={ncount?.count || 0} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Popover
              open={Boolean(notificationAnchorEl)}
              anchorEl={notificationAnchorEl}
              onClose={handleNotificationClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <div className={classes.popover}>
                {filteredIssue.map((item, index) => (
                  <Card key={index} className={classes.notificationCard}>
                    <CardContent className={classes.notificationCardContent}>
                      <div>
                        <Typography variant="h6">{item.title}</Typography>
                        <Typography variant="body1">Status: {item.status}</Typography>
                        <Typography variant="body1">Occurrence: {item.occurrence}</Typography>
                        <Typography variant="body1">Location: {item.location}</Typography>
                        <Typography variant="body1" >Timestamp: {item.timestamp}</Typography>
                      </div>
                      <Button className={classes.markAsReadButton} onClick={() => markAsRead(item.id)}>Mark as Read</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Popover>
          </div>
          <IconButton component={Link} to="/Alarmlog" color="inherit">
            <Badge badgeContent={acount?.count || 0} color="secondary">
              <AlarmIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" onClick={handleUserClick}>
            <LogoutIcon />
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
        className={classes.drawer}
        variant={isSmallScreen ? 'temporary' : 'persistent'}
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <Link to="/analytical-view" onClick={toggleDrawer} className={classes.listItem}>
            <ListItem button>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Analytical View" />
            </ListItem>
          </Link>
          <Link to="/history" onClick={toggleDrawer} className={classes.listItem}>
            {/* <ListItem button>
              <ListItemIcon>
                <HistoryIcon />
              </ListItemIcon>
              <ListItemText primary="Notification History" />
            </ListItem>
          </Link>
          <Link to="/" onClick={toggleDrawer} className={classes.listItem}> */}
            {/* <ListItem button>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="User Management" />
            </ListItem> */}
          </Link>
          
          <ListItem button onClick={handleOpenAddDialog} className={classes.listItem}>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="Add Alarm" />
          </ListItem>
          
          <Link to="/LogStore" onClick={toggleDrawer} className={classes.listItem}>
            <ListItem button>
              <ListItemIcon>
                <MdLocalGroceryStore />
              </ListItemIcon>
              <ListItemText primary="Log Store" />
            </ListItem>
          </Link>
        </List>
      </Drawer>

      <main className={`${classes.content} ${drawerOpen && classes.contentShift}`}>
        <div className={classes.iframeContainer}>
          <iframe
            src="https://public.tableau.com
            // &:showVizHome=no
                &embed=true
                &:toolbar=no
                &:showShareOptions=no"
            title="Tableau Dashboard"
            className={classes.iframe}
          />
        </div>
      </main>

      {/* ADD condition dialog */}
      <Dialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
      >
        <DialogTitle>Add Condition</DialogTitle>
        <DialogContent>
          <InputLabel shrink>Parameter</InputLabel>
          <Select
            autoFocus
            margin="dense"
            fullWidth
            name="parameter"
            onChange={(event) => handleInputChange(event, "add")}
            error={!!addErrors.parameter}
            helperText={addErrors.parameter}
          >
            <MenuItem value="">Select Parameter</MenuItem>
            <MenuItem value="Overloaded LT Feeders">
              Overloaded LT Feeders
            </MenuItem>
            <MenuItem value="Loose connection on LT side">
              Loose connection on LT side
            </MenuItem>
            <MenuItem value="Fault on LT side">Fault on LT side</MenuItem>
            <MenuItem value="Low oil level">Low oil level</MenuItem>
            <MenuItem value="Oil leakage">Oil leakage</MenuItem>
            <MenuItem value="acb_3_current">acb_3_current</MenuItem>
          </Select>

          <InputLabel shrink>Phase</InputLabel>
          <Select
            autoFocus
            margin="dense"
            fullWidth
            name="phase"
            onChange={(event) => handleInputChange(event, "add")}
            error={!!addErrors.phase}
            helperText={addErrors.phase}
          >
            <MenuItem value="">Select Phase</MenuItem>
            <MenuItem value="phaseR">
              phaseR
            </MenuItem>
            <MenuItem value="phaseY">
              phaseY
            </MenuItem>
            <MenuItem value="phaseB">phaseB</MenuItem>
            <MenuItem value="phaseB">phaseN</MenuItem>
          </Select>
          <TextField
            margin="dense"
            label="Min Range"
            type="number"
            fullWidth
            name="range_min"
            value={addData.range_min}
            onChange={(event) => handleInputChange(event, "add")}
            error={!!addErrors.range_min}
            helperText={addErrors.range_min}
          />
          <TextField
            margin="dense"
            label="Max Range"
            type="number"
            fullWidth
            name="range_max"
            value={addData.range_max}
            onChange={(event) => handleInputChange(event, "add")}
            error={!!addErrors.range_max}
            helperText={addErrors.range_max}
          />
          <TextField
            margin="dense"
            label="Parameter Units"
            type="text"
            fullWidth
            name="parameter_units"
            value={addData.parameter_units}
            onChange={(event) => handleInputChange(event, "add")}
            error={!!addErrors.parameter_units}
            helperText={addErrors.parameter_units}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleSubmit("add")}
            color="primary"
          >
            Save
          </Button>
          <Button
            onClick={() => handleCloseDialog("add")}
            color="primary"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

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
    </div>
  );
};

export default OrganizationHeadPage;
