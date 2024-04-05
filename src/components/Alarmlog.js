import React, { useEffect, useState } from "react";
import {
  Typography,
  Container,
  makeStyles,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  InputLabel,
} from "@material-ui/core";
import { Alarm } from "@material-ui/icons";

const gradientColors = ["#33539E", "#7FACD6", "#BFB8DA", "#E8B7D4", "#A5678E"];

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "93vh",
    background: `linear-gradient(to bottom, ${gradientColors.join(", ")})`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(3),
    position: "relative",
  },
  container: {
    maxWidth: "800px",
    width: "100%",
  },
  alarmLogItem: {
    position: "relative",
    marginBottom: theme.spacing(3),
    padding: theme.spacing(3),
    backgroundColor: "#092b4d",
    borderRadius: theme.spacing(2),
    color: "#fff",
    "&:hover": {
      backgroundColor: "#0f3a6e",
    },
  },
  closeButton: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    color: "#fff",
  },
  addButton: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(7),
    borderRadius: "30%",
    backgroundColor: "#092b4d",
  },
  closeButtonText: {
    color: "#fff",
  },
  alarmIcon: {
    marginRight: theme.spacing(1),
    fontSize: "2rem",
    color: "#fff",
  },
  errorMessage: {
    color: "red",
    fontSize: "0.8rem",
    marginTop: theme.spacing(1),
  },
}));

const AlarmLogPage = () => {
  const classes = useStyles();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openCloseDialog, setOpenCloseDialog] = useState(false);
  const [items, setItems] = useState(null);
  const [addData, setAddData] = useState({
    id: "",
    status: "",
    location: "",
    occurrence: "",
    incharge: "",
  });
  const [closeData, setCloseData] = useState({
    Problem: "",
    Reason: "",
    Statement: "",
  });
  const [addErrors, setAddErrors] = useState({});
  const [closeErrors, setCloseErrors] = useState({});

  const handleAddButtonClick = () => {
    setOpenAddDialog(true);
  };

  const handleAddDialogClose = () => {
    setOpenAddDialog(false);
    setAddErrors({});
  };

  const handleInputChangeAdd = (event) => {
    setAddData({ ...addData, [event.target.name]: event.target.value });
  };

  const handleSubmitAdd = () => {
    const errors = {};
    let hasErrors = false;

    // Check for empty fields
    for (const key in addData) {
      if (!addData[key]) {
        errors[key] = "Required";
        hasErrors = true;
      }
    }

    if (hasErrors) {
      setAddErrors(errors);
      return;
    }

    // Proceed with submission if no errors
    console.log("Data to be stored:", addData);
    setAddData({
      id: "",
      status: "",
      location: "",
      occurrence: "",
      incharge: "",
    });
    setOpenAddDialog(false);
    setAddErrors({});
  };

  const handleCloseButtonClick = (item) => () => {
    setOpenCloseDialog(true);
    fetch(`http://127.0.0.1:8000/alarm/log/${item.id}`, { method: "PUT" })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleCloseDialogClose = () => {
    setOpenCloseDialog(false);
    setCloseErrors({});
  };

  const handleInputChangeClose = (event) => {
    setCloseData({ ...closeData, [event.target.name]: event.target.value });
  };

  const handleSubmitClose = () => {
    const errors = {};
    let hasErrors = false;

    // Check for empty fields
    for (const key in closeData) {
      if (!closeData[key]) {
        errors[key] = "Required";
        hasErrors = true;
      }
    }

    if (hasErrors) {
      setCloseErrors(errors);
      return;
    }

    // Proceed with submission if no errors
    console.log("Data to be stored:", closeData);
    setCloseData({
      Problem: "",
      Reason: "",
      Statement: "",
    });
    setOpenCloseDialog(false);
    setCloseErrors({});
  };

  useEffect(() => {
    fetch("http://127.0.0.1:8000/alarm/getdata", { method: "GET" })
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return (
    <div className={classes.root}>
      <Container className={classes.container} maxWidth="md">
        <Typography variant="h4" align="center" gutterBottom>
          <Alarm className={classes.alarmIcon} />
          Alarm Log
        </Typography>
        {items &&
          items.map((item, index) => {
            return (
              <div className={classes.alarmLogItem} key={index}>
                <Typography variant="h6">Log 1</Typography>
                <Typography variant="body1">
                  ID: {item["id"]} <br />
                  Status: {item["status"]} <br />
                  Location: {item["location"]} <br />
                  Occurrence: {item["occurrence"]} <br />
                  Time : {item["timeerror"]}
                  <br />
                </Typography>
                <Button
                  className={classes.closeButton}
                  onClick={handleCloseButtonClick(item)}
                >
                  <Typography className={classes.closeButtonText}>
                    Close
                  </Typography>
                </Button>
              </div>
            );
          })}
      </Container>

      <Button
        className={classes.addButton}
        variant="contained"
        color="primary"
        onClick={handleAddButtonClick}
      >
        ADD
      </Button>

      <Dialog open={openAddDialog} onClose={handleAddDialogClose}>
        <DialogTitle>Add Entry</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="ID"
            type="text"
            fullWidth
            name="id"
            value={addData.id}
            onChange={handleInputChangeAdd}
            error={addErrors.id}
            helperText={addErrors.id}
          />
          <TextField
            margin="dense"
            label="Status"
            type="text"
            fullWidth
            name="status"
            value={addData.status}
            onChange={handleInputChangeAdd}
            error={addErrors.status}
            helperText={addErrors.status}
          />
          <TextField
            margin="dense"
            label="Location"
            type="text"
            fullWidth
            name="location"
            value={addData.location}
            onChange={handleInputChangeAdd}
            error={addErrors.location}
            helperText={addErrors.location}
          />
          <TextField
            margin="dense"
            label="Occurrence"
            type="text"
            fullWidth
            name="occurrence"
            value={addData.occurrence}
            onChange={handleInputChangeAdd}
            error={addErrors.occurrence}
            helperText={addErrors.occurrence}
          />
          <TextField
            margin="dense"
            label="Incharge"
            type="text"
            fullWidth
            name="incharge"
            value={addData.incharge}
            onChange={handleInputChangeAdd}
            error={addErrors.incharge}
            helperText={addErrors.incharge}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmitAdd} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openCloseDialog} onClose={handleCloseDialogClose}>
        <DialogTitle>Close Entry</DialogTitle>
        <DialogContent>
          <InputLabel shrink>Problem</InputLabel>
          <Select
            autoFocus
            margin="dense"
            fullWidth
            name="Problem"
            onChange={handleInputChangeClose}
            error={closeErrors.Problem}
            helperText={closeErrors.Problem}
          >
            <MenuItem value="">Select Problem</MenuItem>
            <MenuItem value="Reason 1">Overloaded LT Feeders</MenuItem>
            <MenuItem value="Reason 2">Loose connection on LT side</MenuItem>
            <MenuItem value="Reason 3">Fault on LT side</MenuItem>
            <MenuItem value="Reason 4">Low oil level</MenuItem>
            <MenuItem value="Reason 5">Oil leakage</MenuItem>
            <MenuItem value="Reason 6">Reason 6</MenuItem>
          </Select>

          <InputLabel shrink>Status</InputLabel>
          <Select
            autoFocus
            margin="dense"
            type="text"
            fullWidth
            name="Status"
            onChange={handleInputChangeClose}
            error={closeErrors.Status}
            helperText={closeErrors.Status}
          >
            <MenuItem value="">Select Status</MenuItem>
            <MenuItem value="Reason 1">Error</MenuItem>
            <MenuItem value="Reason 2">Under Progress</MenuItem>
            <MenuItem value="Reason 3">Repair</MenuItem>
            <MenuItem value="Reason 4">Successfully Working</MenuItem>
          </Select>

          <TextField
            margin="dense"
            label="Statement"
            type="text"
            fullWidth
            name="Statement"
            onChange={handleInputChangeClose}
            error={closeErrors.Statement}
            helperText={closeErrors.Statement}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmitClose} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AlarmLogPage;
