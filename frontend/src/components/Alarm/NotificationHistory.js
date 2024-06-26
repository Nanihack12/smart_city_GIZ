import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';

const NotificationHistory = ({ closedNotifications }) => {
  return (
    <div>
      <h2>Closed Notifications History</h2>
      {closedNotifications && closedNotifications.map(notification => (
        <Card key={notification.id} style={{ marginBottom: '10px' }}>
          <CardContent>
            <Typography variant="h6">Notification ID: {notification.id}</Typography>
            <Typography variant="body1">Status: {notification.status}</Typography>
            <Typography variant="body1">Occurrence: {notification.occurrence}</Typography>
            <Typography variant="body1">Location: {notification.location}</Typography>
            {/* Add more details as needed */}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NotificationHistory;
