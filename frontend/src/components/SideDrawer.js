import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PersonIcon from '@material-ui/icons/Person';

const useStyles = makeStyles({
  drawer: {
    width: 240,
  },
});

const SideDrawer = () => {
  const classes = useStyles();

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      className={classes.drawer}
    >
      <List>
        <Link to="/analytical-view">
          <ListItem button>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Analytical View" />
          </ListItem>
        </Link>
        <Link to="/user-management">
          <ListItem button>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="User Management" />
          </ListItem>
        </Link>
      </List>
    </Drawer>
  );
};

export default SideDrawer;
