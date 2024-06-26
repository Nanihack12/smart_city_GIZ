import React, { useRef, useState, useEffect } from 'react';
import AppBarComponent from './AppBar';
import { Box, Container, Dialog, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ReplayIcon from "@mui/icons-material/Replay";
import { useNavigate } from 'react-router-dom';

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


const Subdivsionhead = () => {
  const [sessionTimeoutAlert, setSessionTimeoutAlert] = useState(false);
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

  return (
    <div>
      <AppBarComponent />
      <Container maxWidth={false} disableGutters sx={{ height: '100vh' }}>
        <Box
          sx={{
            border: '1px solid #ccc',
            borderRadius: 2,
            boxShadow: 2,
            height: '100%',
            marginTop: '-60px',
          }}
        > 
          <iframe
            src="https://public.tableau.com/views/BYPLDASHBOARD/Dashboard1?:language=en-US&:sid=&:display_count=n&:origin=viz_share_link
                // &:showVizHome=no
                &embed=true
                &:toolbar=no
                &:showShareOptions=no
                "
                  
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
            title="Tableau Dashboard">
              </iframe>
        </Box>
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
    </div>
  );
};

export default Subdivsionhead;