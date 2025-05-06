import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NotificationDetails = ({ route }) => {
  const { notification } = route.params; // Get the notification data passed from the previous screen

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{notification.title}</Text>
      <Text style={styles.message}>{notification.message}</Text>
      <Text style={styles.details}>Additional details about the request:</Text>
      {/* Display more details as needed */}
      <Text>Status: {notification.status}</Text>
      <Text>Request Date: {notification.requestDate}</Text>
      {/* Add more fields as necessary */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 16,
    marginVertical: 10,
  },
  details: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default NotificationDetails;