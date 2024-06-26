import React, { useState } from "react";
import {
  makeStyles,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  TableSortLabel,
  MenuItem,
  Select,
  Grid,
  InputLabel,
  DialogActions,
} from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f0f0f0",
    padding: theme.spacing(4),
  },
  categoryContainer: {
    width: "100%",
    maxWidth: 800,
    marginBottom: theme.spacing(4),
    backgroundColor: "#ffffff",
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
  },
  table: {
    width: "100%",
  },
  addButton: {
    position: "fixed",
    bottom: theme.spacing(4),
    right: theme.spacing(4),
    borderRadius: 50,
  },
  downloadButton: {
    position: "fixed",
    bottom: theme.spacing(4),
    right: theme.spacing(4),
    borderRadius: 50,
  },
}));

const AlarmLogPage = () => {
  const classes = useStyles();

  const [setOpenAddDialog] = useState(false);
  const [ setOpenCloseDialog] = useState(false);
  // const [items, setItems] = useState([]);
  // const [id, setId] = useState(null);
  const [addData, setAddData] = useState({
    phase: "",
    parameter: "",
    range_min: 0,
    range_max: 0,
    parameter_units: "",
  });
  const [ setAddErrors] = useState({});
  const [closeData, setCloseData] = useState({
    problem: "",
    status: "",
    remark: "",
  });
  const [closeErrors, setCloseErrors] = useState({});
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [sortColumn, setSortColumn] = useState("time");
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchStatus, setSearchStatus] = useState("");
  const [searchTime, setSearchTime] = useState("");

  const allLogs = [
    {
      id: "ABCD1",
      status: "Error",
      location: "Building A",
      occurrence: "Yearly",
      time: "2024-04-01T15:37:42.887Z",
    },
    {
      id: "EFGH2",
      status: "Warning",
      location: "Building B",
      occurrence: "Yearly",
      time: "2025-04-02T15:37:42.887Z",
    },
    {
      id: "IJKL3",
      status: "Error",
      location: "Building C",
      occurrence: "Monthly",
      time: "2024-04-03T15:37:42.887Z",
    },
    {
      id: "MNOP4",
      status: "Warning",
      location: "Building D",
      occurrence: "Monthly",
      time: "2024-05-04T15:37:42.887Z",
    },
    {
      id: "QRST5",
      status: "Error",
      location: "Building E",
      occurrence: "Daily",
      time: "2024-04-05T15:37:42.887Z",
    },
    {
      id: "UVWX6",
      status: "Warning",
      location: "Building F",
      occurrence: "Daily",
      time: "2024-04-06T15:37:42.887Z",
    },
  ];

  const handleLogClose = (log) => {
    console.log("Closed log:", log);
    setCloseDialogOpen(true);
  };

  const handleAddButtonClick = () => {
    handleDownload();
  };

  const handleSort = (column) => {
    const isAsc = sortColumn === column && sortDirection === "asc";
    setSortColumn(column);
    setSortDirection(isAsc ? "desc" : "asc");
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

    console.log(data);

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

  const handleSearch = (event) => {
    const { name, value } = event.target;
    if (name === "status") {
      setSearchStatus(value);
    } else if (name === "time") {
      setSearchTime(value);
    }
  };

  const handleDownload = () => {
    const filteredLogs = allLogs.filter(
      (log) =>
        log.status.toLowerCase().includes(searchStatus.toLowerCase()) &&
        (log.time.includes(searchTime) ||
          moment(log.time).format("YYYY-MM-DD HH:mm:ss").includes(searchTime))
    );
    const csvData = [
      ["ID", "Status", "Location", "Occurrence", "Time"],
      ...filteredLogs.map((log) => [
        log.id,
        log.status,
        log.location,
        log.occurrence,
        moment(log.time).format("YYYY-MM-DD HH:mm:ss"),
      ]),
    ];
    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const downloadLink = document.createElement("a");
    downloadLink.setAttribute(
      "href",
      "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent)
    );
    downloadLink.setAttribute("download", "alarm_logs.csv");
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const filteredLogs = allLogs.filter(
    (log) =>
      log.status.toLowerCase().includes(searchStatus.toLowerCase()) &&
      (log.time.includes(searchTime) ||
        moment(log.time).format("YYYY-MM-DD HH:mm:ss").includes(searchTime))
  );

  const sortedLogs = filteredLogs.sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className={classes.container}>
      <div className={classes.categoryContainer}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              margin="normal"
              label="Search by Status"
              type="text"
              fullWidth
              name="status"
              value={searchStatus}
              onChange={handleSearch}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              margin="normal"
              label="Search by Time"
              type="text"
              fullWidth
              name="time"
              value={searchTime}
              onChange={handleSearch}
            />
          </Grid>
        </Grid>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === "id"}
                  direction={sortColumn === "id" ? sortDirection : "asc"}
                  onClick={() => handleSort("id")}
                >
                  ID
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === "status"}
                  direction={sortColumn === "status" ? sortDirection : "asc"}
                  onClick={() => handleSort("status")}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === "location"}
                  direction={sortColumn === "location" ? sortDirection : "asc"}
                  onClick={() => handleSort("location")}
                >
                  Location
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === "occurrence"}
                  direction={
                    sortColumn === "occurrence" ? sortDirection : "asc"
                  }
                  onClick={() => handleSort("occurrence")}
                >
                  Occurrence
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === "time"}
                  direction={sortColumn === "time" ? sortDirection : "asc"}
                  onClick={() => handleSort("time")}
                >
                  Time
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">Close</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.id}</TableCell>
                <TableCell>{log.status}</TableCell>
                <TableCell>{log.location}</TableCell>
                <TableCell>{log.occurrence}</TableCell>
                <TableCell>
                  {moment(log.time).format("YYYY-MM-DD HH:mm:ss")}
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleLogClose(log)}>
                    <CloseIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Button
        className={classes.downloadButton}
        variant="contained"
        color="primary"
        onClick={handleAddButtonClick}
      >
        Download
      </Button>

      <Dialog open={closeDialogOpen} onClose={() => setCloseDialogOpen(false)}>
        <DialogTitle>Close Entry</DialogTitle>
        <DialogContent>
          <InputLabel shrink>Problem</InputLabel>
          <Select
            autoFocus
            margin="dense"
            fullWidth
            name="problem"
            onChange={(event) => handleInputChange(event, "close")}
            error={!!closeErrors.problem}
            helperText={closeErrors.problem}
          >
            <MenuItem value="">Select Problem</MenuItem>
            <MenuItem value="Overloaded LT Feeders">
              Overloaded LT Feeders
            </MenuItem>
            <MenuItem value="Loose connection on LT side">
              Loose connection on LT side
            </MenuItem>
            <MenuItem value="Fault on LT side">Fault on LT side</MenuItem>
            <MenuItem value="Low oil level">Low oil level</MenuItem>
            <MenuItem value="Oil leakage">Oil leakage</MenuItem>
            <MenuItem value="Reason 6">acb_3_current</MenuItem>
          </Select>

          <InputLabel shrink>Status</InputLabel>
          <Select
            autoFocus
            margin="dense"
            type="text"
            fullWidth
            name="status"
            onChange={(event) => handleInputChange(event, "close")}
            error={!!closeErrors.status}
            helperText={closeErrors.status}
          >
            <MenuItem value="">Select Status</MenuItem>
            <MenuItem value="Error">Error</MenuItem>
            <MenuItem value="Under Progress">Under Progress</MenuItem>
            <MenuItem value="Repair">Repair</MenuItem>
            <MenuItem value="Successfully Working">
              Successfully Working
            </MenuItem>
          </Select>

          <TextField
            margin="dense"
            label="Remark"
            type="text"
            fullWidth
            name="remark"
            onChange={(event) => handleInputChange(event, "close")}
            error={!!closeErrors.remark}
            helperText={closeErrors.remark}
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
    </div>
  );
};

export default AlarmLogPage;
