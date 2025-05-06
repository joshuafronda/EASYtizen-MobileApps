import { useState, useEffect, useLayoutEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  Image, 
  Modal, 
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import QRCode from 'react-native-qrcode-svg';

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchUserData();
    });
    return unsubscribe;
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            setShowHistory(true);
          }}
          style={{ marginRight: 15 }}
        />
      ),
    });
  }, [navigation]);

  const fetchUserData = async () => {
    try {
      const userId = auth.currentUser?.uid;
      console.log('Fetching data for user:', userId);

      if (!userId) {
        console.log('No user ID found');
        return;
      }

      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        console.log('User data found:', userDoc.data());
        setUserData(userDoc.data());
      } else {
        console.log('No user document found');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format QR data to match the admin's scanner expectations
  const qrData = userData ? JSON.stringify({
    fullName: userData.fullName,
    barangayName: userData.barangayName,
    email: userData.email,
    role: 'Resident',  // Matching the ID card format
    // Add any other fields that the ID card displays
  }) : '';

  // Add or modify the calculateAge function
  const calculateAge = (birthday) => {
    if (!birthday || birthday === '') return '';
    
    try {
      // Parse the birthday string into a Date object
      const parts = birthday.split('/');
      if (parts.length !== 3) return '';
      
      // Create date from MM/DD/YYYY format
      const birthDate = new Date(parts[2], parts[0] - 1, parts[1]);
      
      // Validate the date
      if (isNaN(birthDate.getTime())) return '';
      
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      // Adjust age if birthday hasn't occurred this year
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return `${age}`;
    } catch (error) {
      console.error('Error calculating age:', error);
      return 'Not set';
    }
  };

  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        console.log('User signed out!');
        // Navigate to login screen or handle logout
      })
      .catch(error => console.error('Error signing out:', error));
  };

  const confirmLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: handleLogout,
        },
      ],
      { cancelable: false }
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1679ab" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
      <View style={styles.avatarContainer}>
          <View style={styles.avatarIcon}>
            <Ionicons name="person" size={50} color="#1679ab" />
          </View>
        </View>
        <Text style={styles.name}>{userData.fullName}</Text>
        <Text style={styles.subtitle}>Resident of {userData.barangayName}</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.qrButton}
            onPress={() => setShowQR(true)}
          >
            <Ionicons name="qr-code-outline" size={24} color="white" />
            <Text style={styles.buttonText}>QR Code</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.editProfileButton}
            onPress={() => navigation.navigate('EditProfile', { userData })}
          >
            <Ionicons name="create-outline" size={20} color="#fff" />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardContainer}>
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Informations</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <Text style={styles.value}>{userData?.fullName || ''}</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Birth Date</Text>
            <Text style={styles.value}>
              {userData?.birthday || 'Not set'}
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Age</Text>
            <Text style={styles.value}>
              {calculateAge(userData?.birthday)}
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Gender</Text>
            <Text style={styles.value}>{userData?.gender || ''}</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Civil Status</Text>
            <Text style={styles.value}>{userData?.civilStatus || ''}</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Voter Status</Text>
            <Text style={styles.value}>{userData?.voterStatus || ''}</Text>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <Text style={styles.value}>{userData?.phoneNumber || ''}</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Complete Address</Text>
            <Text style={styles.value}>{userData?.address || ''}</Text>
          </View>
        </View>

        {/* Employment & Education */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Employment & Education</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Educational Attainment</Text>
            <Text style={styles.value}>{userData?.educationalAttainment || ''}</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Employment Status</Text>
            <Text style={styles.value}>{userData?.employmentStatus || ''}</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Occupation</Text>
            <Text style={styles.value}>{userData?.occupation || ''}</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Monthly Income</Text>
            <Text style={styles.value}>{userData?.monthlyIncome || ''}</Text>
          </View>
        </View>

        {/* Health Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Information</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Blood Type</Text>
            <Text style={styles.value}>{userData?.bloodType || ''}</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Health Conditions</Text>
            <Text style={styles.value}>{userData?.healthConditions || ''}</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Vaccine Status</Text>
            <Text style={styles.value}>{userData?.vaccineStatus || ''}</Text>
          </View>
        </View>

        {/* Emergency Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contact</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contact Name</Text>
            <Text style={styles.value}>{userData?.emergencyContact || ''}</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contact Number</Text>
            <Text style={styles.value}>{userData?.emergencyNumber || ''}</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Relationship</Text>
            <Text style={styles.value}>{userData?.emergencyRelationship || ''}</Text>
          </View>
        </View>
      </View>

      {/* QR Code Modal */}
      <Modal
        visible={showQR}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowQR(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowQR(false)}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>

            <Text style={styles.qrTitle}>Your QR Code</Text>
            
            <View style={styles.qrWrapper}>
              <QRCode
                value={qrData}
                size={250}
                color="black"
                backgroundColor="white"
              />
            </View>

            <View style={styles.infoBox}>
              <Ionicons name="information-circle-outline" size={24} color="#666" />
              <Text style={styles.qrInfoText}>
                Present this QR code at the Barangay Office for verification
              </Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Logout Button */}
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={confirmLogout}
      >
        <Ionicons name="log-out-outline" size={24} color="#fff" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1679ab',
  },
  avatarContainer: {
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 15,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editProfileText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 14,
  },
  cardContainer: {
    padding: 15,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1679ab',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 10,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
    avatarIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 20,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 1,
  },
  qrTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#333',
  },
  qrWrapper: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
  },
  qrInfoText: {
    marginLeft: 10,
    color: '#666',
    flex: 1,
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    gap: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  historyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#333',
  },
  historyText: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F44336', // Red color for logout
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    marginRight: 10,
    marginBottom: 10,
    marginLeft: 10,
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});