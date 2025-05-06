import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const QRCodeScreen = ({ route }) => {
  const { userData } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Resident QR Code</Text>
      
      <View style={styles.qrWrapper}>
        <Image 
          source={{ uri: userData?.qrCode }}
          style={styles.qrImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle-outline" size={24} color="#666" />
        <Text style={styles.infoText}>
          Present this QR code at the Barangay Office for verification
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  qrWrapper: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  qrImage: {
    width: 250,
    height: 250,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    gap: 10,
  },
  infoText: {
    flex: 1,
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default QRCodeScreen;