import React, { useEffect, useState, useRef } from "react";
import {
  Typography,
  Container,
  makeStyles,
  Hidden,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Menu,
  AppBar,
  Toolbar,
} from "@material-ui/core";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ReplayIcon from "@mui/icons-material/Replay";
import { Alarm } from "@material-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import yourImage from './logos.png';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(3),
    position: "relative",
    // overflow: "hidden", // Prevent scrolling
  },
  container: {
    maxWidth: "800px",
    width: "100%",
    position: "relative",
  },
  logo: {
    height: '50px',
    marginRight: theme.spacing(2),
  },
  addButton: {
    borderRadius: "30%",
    backgroundColor: "#CCCCCC", // Changed button color
    marginRight: theme.spacing(2),
  },
  closeButtonText: {
    color: "#fff",
  },
  alarmIcon: {
    marginRight: theme.spacing(1),
    fontSize: "2rem",
  },
  logTable: {
    marginBottom: theme.spacing(3),
    maxWidth: "800px",
    width: "100%", // Adjusted to fill the entire width
    backgroundColor: "#fff", // Changed table content color
  },
  tableHeader: {
    fontWeight: "bold",
    border: "1px solid #000",
    backgroundColor: "#f2f2f2", // Changed table header color
  },
  tableCell: {
    border: "1px solid #000",
    backgroundColor: "#fff", // Changed table content color
  },
  optionsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing(2),
  },
  select: {
    marginLeft: theme.spacing(2),
  },
  searchByTextButton: {
    backgroundColor: "#CCCCCC",
    color: "#000",
  },
  sortButton: {
    backgroundColor: "#CCCCCC",
    color: "#000",
  },
  appBar: {
    width: "100%",
    backgroundColor: "#002e41",
    top: 0,
    zIndex: theme.zIndex.drawer + 1,
  },
  title: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing(1), // Move title slightly upwards
  },
  tableContainer: {
    width: "100%", // Make the table container fill the entire width
    height: "100%", // Make the table container fill the entire height
  },
  table: {
    width: "100%", // Make the table fill the entire width
    height: "95%", // Make the table fill the entire height
  },
  iconContainer: {
    marginTop: theme.spacing(-2), // Move icon container upwards
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



const perPage = 5;

const AlarmLogPage = () => {
  const classes = useStyles();
  const [sessionTimeoutAlert, setSessionTimeoutAlert] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openCloseDialog, setOpenCloseDialog] = useState(false);
  const [items, setItems] = useState([]);
  const [id, setId] = useState(null);
  const [addData, setAddData] = useState({
    parameter: "",
    phase: "",
    range_min: "",
    range_max: "",
    parameter_units: "",
  });
  const [addErrors, setAddErrors] = useState({});
  const [closeData, setCloseData] = useState({
    occurrence: "",
    status: "",
    remarks: "",
    incharge: "",
  });
  const [closeErrors, setCloseErrors] = useState({});
  const [downloadFormat] = useState("json");
  const [searchStatus, setSearchStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchAnchorEl, setSearchAnchorEl] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const sessionTimer = useRef(null);
  const navigate = useNavigate();

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


  const handleCloseDialog = (dialogType) => {
    if (dialogType === "add") {
      setOpenAddDialog(false);
      setAddErrors({});
    } else if (dialogType === "close") {
      setOpenCloseDialog(false);
      setCloseErrors({});
    }
  };

  const handleInputChange = (event, dataType) => {
    const data = dataType === "add" ? addData : closeData;
    const setData = dataType === "add" ? setAddData : setCloseData;
    setData({ ...data, [event.target.name]: event.target.value });
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/alarm/alarmdata");
        const data = await response.json();
        setItems(data);
        setTotalPages(Math.ceil(data.length / perPage));
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (dataType) => {
    const data = dataType === "add" ? addData : closeData;
    const setData = dataType === "add" ? setAddData : setCloseData;
    const errors = {};
    let hasErrors = false;
  
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
  
    try {
      const response = await fetch(endpoint, {
        method: dataType === "add" ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        if (dataType === "close" && data.status === "Resolved") {
          setItems((prevItems) => prevItems.filter((item) => item.id !== id));
        } else if (dataType === "add") {
          const newItem = await response.json();
          setItems((prevItems) => [...prevItems, newItem]);
        }
        handleCloseDialog(dataType);
      } else {
        console.log("Error:", response.status);
      }
    } catch (error) {
      console.log(error.message);
    }
  
    setData(
      dataType === "add"
        ? {
            parameter: "",
            phase: "",
            range_min: "",
            range_max: "",
            parameter_units: "",
          }
        : {
            occurrence: "",
            status: "",
            remarks: "",
            incharge: "",
          }
    );
  
  
  };

  const handleSearchStatus = (status) => {
    setSearchStatus(status);
    setSearchAnchorEl(null);
  };

  const handleSortTime = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    // Implement sorting logic here
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const downloadLogs = () => {
    let logsContent = "";

    if (downloadFormat === "json") {
      logsContent = JSON.stringify(items);
    } else if (downloadFormat === "csv") {
      const header = Object.keys(items[0]).join(",") + "\n";
      const rows = items
        .map((item) => Object.values(item).join(","))
        .join("\n");
      logsContent = header + rows;
    }

    const blob = new Blob([logsContent], {
      type: downloadFormat === "json" ? "application/json" : "text/csv",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `alarm_logs.${downloadFormat}`
    );
    document.body.appendChild(link);
    link.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  return (
    <div className={classes.root}>
     <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
      <Hidden xsDown>
      <img
            src={yourImage}
            alt="Logo"
            className={classes.logo}
            onClick={() => navigate(-1)} // Navigate to previous page on click
          />
          </Hidden>
        <Button
          component={Link}
          to="/logstore"
          color="inherit"
          style={{ color: "#fff" }}
        >
          History
        </Button>
        <Button
          color="inherit"
          onClick={() => setOpenAddDialog(true)}
          style={{ color: "#fff" }}
        >
          ADD
        </Button>
        
        <div className={classes.title} style={{ marginLeft: "auto", marginRight: "auto" }}>
          <Alarm className={classes.alarmIcon} />
          <Typography variant="h6" style={{ lineHeight: "2.4rem" }}>
            Alarm
          </Typography>
        </div>
        <Button
          color="inherit"
          onClick={downloadLogs}
          style={{ color: "#fff" }}
        >
          Download Logs
        </Button>
      </Toolbar>
    </AppBar>
    <Toolbar /> {/* To push the content below the AppBar */}
    <Container className={classes.container} maxWidth="md">
      <div className={classes.optionsContainer}>
        <Button
          className={classes.searchByTextButton}
          variant="contained"
          color="primary"
          onClick={(event) => setSearchAnchorEl(event.currentTarget)}
        >
          Search by Status
        </Button>
        <Menu
          anchorEl={searchAnchorEl}
          keepMounted
          open={Boolean(searchAnchorEl)}
          onClose={() => setSearchAnchorEl(null)}
        >
          <MenuItem onClick={() => handleSearchStatus("")}>
            All
          </MenuItem>
          <MenuItem onClick={() => handleSearchStatus("Error")}>
            Error
          </MenuItem>
          <MenuItem onClick={() => handleSearchStatus("Pending")}>
            Pending
          </MenuItem>
          <MenuItem onClick={() => handleSearchStatus("Resolved")}>
            Resolved
          </MenuItem>
        </Menu>
        <Button
          className={classes.sortButton}
          variant="contained"
          color="primary"
          onClick={handleSortTime}
        >
          Sort by Time {sortOrder === "asc" ? "▲" : "▼"}
        </Button>
      </div>



        <TableContainer component={Paper} className={classes.logTable}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableHeader}>ID</TableCell>
                <TableCell className={classes.tableHeader}>Status</TableCell>
                <TableCell className={classes.tableHeader}>Location</TableCell>
                <TableCell className={classes.tableHeader}>Occurrence</TableCell>
                <TableCell className={classes.tableHeader}>Time</TableCell>
                <TableCell className={classes.tableHeader}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items
                .filter((item) =>
                  searchStatus ? item.status === searchStatus : true
                )
                .sort((a, b) => {
                  const timeA = a.timeerror || ""; // Provide a default empty string if timeerror is undefined
                  const timeB = b.timeerror || ""; // Provide a default empty string if timeerror is undefined
                
                  if (sortOrder === "asc") {
                    return timeA.localeCompare(timeB);
                  } else {
                    return timeB.localeCompare(timeA);
                  }
                })
                .slice((currentPage - 1) * perPage, currentPage * perPage)
                .map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className={classes.tableCell}>{item.id}</TableCell>
                    <TableCell className={classes.tableCell}>{item.status}</TableCell>
                    <TableCell className={classes.tableCell}>{item.location}</TableCell>
                    <TableCell className={classes.tableCell}>{item.occurrence}</TableCell>
                    <TableCell className={classes.tableCell}>{item.timeerror}</TableCell>
                    <TableCell className={classes.tableCell}>
                      <Button
                        onClick={() => {
                          setOpenCloseDialog(true);
                          setId(item.id);
                          setCloseData({
                            occurrence: item.occurrence,
                            status: item.status,
                            remarks: item.remarks || "",
                            incharge: item.incharge || "",
                          });
                        }}
                        color="primary"
                      >
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div className={classes.optionsContainer}>
        {currentPage > 1 && (
          <Button
            className={classes.sortButton}
            variant="contained"
            color="primary"
            onClick={handlePrevPage}
          >
            Previous
          </Button>
        )}
        {items.length > currentPage * perPage && (
          <Button
            className={classes.sortButton}
            variant="contained"
            color="primary"
            onClick={handleNextPage}
          >
            Next
          </Button>
        )}
        <Typography style={{ color: "#002e41", marginLeft: "auto" }}>
          Page {currentPage} of {totalPages}
        </Typography>
      </div>
      </Container>

      {/* ADD condition dialog */}
  <Dialog
    open={openAddDialog}
    onClose={() => handleCloseDialog("add")}
  >
    <DialogTitle>Add Condition</DialogTitle>
    <DialogContent>
     <InputLabel shrink>Problem</InputLabel>
      <Select
        autoFocus
        margin="dense"
        fullWidth
        name="parameter"
        onChange={(event) => handleInputChange(event, "add")}
        error={!!addErrors.parameter}
        helperText={addErrors.parameter}
      >
        <MenuItem value="">Select problem</MenuItem>
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
        value={addData.phase}
        onChange={(event) => handleInputChange(event, "add")}
        error={!!addErrors.phase}
        helperText={addErrors.phase}
      >
        <MenuItem value="">Select Phase</MenuItem>
        <MenuItem value="phaseR">phaseR</MenuItem>
        <MenuItem value="phaseY">phaseY</MenuItem>
        <MenuItem value="phaseB">phaseB</MenuItem>
        <MenuItem value="phaseN">phaseN</MenuItem>

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

      {/* Close condition dialog */}
      <Dialog
        open={openCloseDialog}
        onClose={() => handleCloseDialog("close")}
      >
        <DialogTitle>Close Entry</DialogTitle>
        <DialogContent>
        <InputLabel shrink>Problem</InputLabel>
        <Select
            autoFocus
            margin="dense"
            fullWidth
            name="Problem"
            value={closeData.Problem}
            onChange={(event) => handleInputChange(event, "close")}
            error={!!closeErrors.Problem}
            helperText={closeErrors.Problem}
          >
            <MenuItem value="">Select Problem</MenuItem>
            <MenuItem value="Error">Overload LT Feeders</MenuItem>
            <MenuItem value="Pending">Loose Connection on LT side</MenuItem>
            <MenuItem value="Resolved">Fault on LT side</MenuItem>
            <MenuItem value="Resolved">Low Oil Level</MenuItem>
            <MenuItem value="Resolved">Oil Leakage</MenuItem>
            <MenuItem value="Resolved">ACB</MenuItem>
          </Select>

          <InputLabel shrink>Status</InputLabel>
          <Select
            autoFocus
            margin="dense"
            fullWidth
            name="status"
            value={closeData.status}
            onChange={(event) => handleInputChange(event, "close")}
            error={!!closeErrors.status}
            helperText={closeErrors.status}
          >
            <MenuItem value="">Select Status</MenuItem>
            <MenuItem value="Error">Error</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Resolved">Resolved</MenuItem>
          </Select>

          <TextField
            margin="dense"
            label="Remarks"
            type="text"
            fullWidth
            name="remarks"
            value={closeData.remarks}
            onChange={(event) => handleInputChange(event, "close")}
            error={!!closeErrors.remarks}
            helperText={closeErrors.remarks}
          />
          <TextField
            margin="dense"
            label="Incharge"
            type="text"
            fullWidth
            name="incharge"
            value={closeData.incharge}
            onChange={(event) => handleInputChange(event, "close")}
            error={!!closeErrors.incharge}
            helperText={closeErrors.incharge}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseDialog("close")} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleSubmit("close")} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Session Timeout Alert Dialog */}
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

export default AlarmLogPage;