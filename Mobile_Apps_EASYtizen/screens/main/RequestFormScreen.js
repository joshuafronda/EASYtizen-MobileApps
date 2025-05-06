import { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  Alert,
  RefreshControl 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { auth, db } from '../../config/firebase';
import { collection, addDoc, serverTimestamp, getDoc, doc } from 'firebase/firestore';

export default function RequestFormScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    documentType: '',
    fullName: '',
    age: '',
    civilStatus: '',
    purpose: '',
    requestDate: new Date().toLocaleDateString(),
    birthDate: '',
    birthPlace: '',
    motherName: '',
    fatherName: '',
  });

  const documentTypes = [
    'Barangay Clearance',
    'Certificate of Residency',
    'Certificate of Indigency'
  ];

  const civilStatusOptions = [
    'Single',
    'Married',
    'Widowed',
    'Divorced',
    'Separated'
  ];

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const calculateAge = (birthday) => {
    if (!birthday || birthday === '') return 'Not set';
    
    try {
      const parts = birthday.split('/');
      if (parts.length !== 3) return 'Not set';
      
      const birthDate = new Date(parts[2], parts[0] - 1, parts[1]);
      
      if (isNaN(birthDate.getTime())) return 'Not set';
      
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return `${age}`;
    } catch (error) {
      console.error('Error calculating age:', error);
      return 'Not set';
    }
  };

  const renderBarangayClearanceForm = () => (
    <>
      <Text style={styles.label}>Full Name *</Text>
<View style={[styles.input, styles.disabledInput]}>
  <Text>{userData?.fullName || 'Not set'}</Text>
</View>

      <View style={styles.label}>
        <Text style={styles.label}>Age *</Text>
        <TextInput
          style={[styles.input, { backgroundColor: '#f0f0f0' }]}
          value={calculateAge(userData?.birthday)}
          placeholder="Auto-calculated from birth date"
        />
        
      </View>
      <Text style={styles.label}>Civil Status *</Text>
<View style={[styles.input, styles.disabledInput]}>
  <Text>{userData?.civilStatus || 'Not set'}</Text>
</View>

      <Text style={styles.label}>Purpose *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        multiline
        value={formData.purpose}
        onChangeText={(text) => setFormData({...formData, purpose: text})}
        placeholder="State the purpose of your request"
      />

      <Text style={styles.label}>Request Date</Text>
      <View style={[styles.input, styles.disabledInput]}>
        <Text>{formData.requestDate}</Text>
      </View>
    </>
  );

  const renderCertificateOfResidencyForm = () => (
    <>
      <Text style={styles.label}>Full Name *</Text>
<View style={[styles.input, styles.disabledInput]}>
  <Text>{userData?.fullName || 'Not set'}</Text>
</View>

      <View style={styles.label}>
        <Text style={styles.label}>Age *</Text>
        <TextInput
          style={[styles.input, { backgroundColor: '#f0f0f0' }]}
          value={calculateAge(userData?.birthday)}
          editable={false}
          placeholder="Auto-calculated from birth date"
        />
      </View>

      <Text style={styles.label}>Civil Status *</Text>
<View style={[styles.input, styles.disabledInput]}>
  <Text>{userData?.civilStatus || 'Not set'}</Text>
</View>

      <Text style={styles.label}>Birth Date *</Text>
      <TextInput
        style={styles.input}
        value={userData?.birthday}
        onChangeText={(text) => setFormData({...formData, birthDate: text})}
        placeholder="MM/DD/YYYY"
      />

      <Text style={styles.label}>Birth Place *</Text>
      <TextInput
        style={styles.input}
        value={userData?.birthPlace}
        onChangeText={(text) => setFormData({...formData, birthPlace: text})}
        placeholder="Enter birth place"
      />

      <Text style={styles.label}>Mother's Name *</Text>
      <TextInput
        style={styles.input}
        value={formData.motherName}
        onChangeText={(text) => setFormData({...formData, motherName: text})}
        placeholder="Enter mother's name"
      />

      <Text style={styles.label}>Father's Name *</Text>
      <TextInput
        style={styles.input}
        value={formData.fatherName}
        onChangeText={(text) => setFormData({...formData, fatherName: text})}
        placeholder="Enter father's name"
      />

      <Text style={styles.label}>Purpose *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        multiline
        value={formData.purpose}
        onChangeText={(text) => setFormData({...formData, purpose: text})}
        placeholder="State the purpose of your request"
      />

      <Text style={styles.label}>Request Date</Text>
      <View style={[styles.input, styles.disabledInput]}>
        <Text>{formData.requestDate}</Text>
      </View>
    </>
  );

  const renderCertificateOfIndigencyForm = () => (
    <>
      <Text style={styles.label}>Full Name *</Text>
<View style={[styles.input, styles.disabledInput]}>
  <Text>{userData?.fullName || 'Not set'}</Text>
</View>

      <View style={styles.label}>
        <Text style={styles.label}>Age *</Text>
        <TextInput
          style={[styles.input, { backgroundColor: '#f0f0f0' }]}
          value={calculateAge(userData?.birthday)}
          editable={false}
          placeholder="Auto-calculated from birth date"
        />
      </View>

      <View style={styles.label}>
        <Text style={styles.label}>Civil Status *</Text>
        <TextInput
    style={[styles.input, { backgroundColor: '#f0f0f0' }]}
    value={userData?.civilStatus || 'Not set'}
    editable={false}
    placeholder="Auto-filled from profile"
  />
</View>

      <Text style={styles.label}>Purpose *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        multiline
        value={formData.purpose}
        onChangeText={(text) => setFormData({...formData, purpose: text})}
        placeholder="State the purpose of your request"
      />

      <Text style={styles.label}>Request Date</Text>
      <View style={[styles.input, styles.disabledInput]}>
        <Text>{formData.requestDate}</Text>
      </View>
    </>
  );

  const renderFormByDocumentType = () => {
    switch(formData.documentType) {
      case 'Barangay Clearance':
        return renderBarangayClearanceForm();
      case 'Certificate of Residency':
        return renderCertificateOfResidencyForm();
      case 'Certificate of Indigency':
        return renderCertificateOfIndigencyForm();
      default:
        return null;
    }
  };

  const validateForm = () => {
    const requiredFields = {
      'Barangay Clearance': ['fullName', 'age', 'civilStatus', 'purpose'],
      'Certificate of Residency': ['fullName', 'age', 'civilStatus', 'birthDate', 'birthPlace', 'motherName', 'fatherName', 'purpose'],
      'Certificate of Indigency': ['fullName', 'age', 'civilStatus', 'purpose']
    };

    const fields = requiredFields[formData.documentType] || [];
    const emptyFields = fields.filter(field => !formData[field]);

    if (emptyFields.length > 0) {
      Alert.alert('Invalid Input', 'Please check your input fields');
      return false;
    }
    return true;
  };

  // Add this reset function at the top with your other functions
const resetForm = () => {
  setFormData({
    documentType: '',
    fullName: userData?.fullName || '',  // Keep user data
    age: calculateAge(userData?.birthday) || '',  // Keep calculated age
    civilStatus: userData?.civilStatus || '',  // Keep civil status
    purpose: '',  // Reset purpose
    requestDate: new Date().toLocaleDateString(),
    birthDate: userData?.birthday || '',  // Keep birth date
    birthPlace: '',  // Reset birth place
    motherName: '',  // Reset mother's name
    fatherName: '',  // Reset father's name
  });
};


  const handleSubmit = async () => {
    if (!formData.documentType) {
      Alert.alert('Error', 'Please select a document type');
      return;
    }

    try {
      if (!userData?.barangayId || !userData?.barangayName) {
        Alert.alert('Error', 'Missing barangay information');
        return;
      }

      const userId = auth.currentUser.uid;
      const timestamp = serverTimestamp();
      const currentDate = new Date().toLocaleDateString();

      // Status timestamps
      const statusTimestamps = {
        pendingAt: serverTimestamp(),  // Add pending timestamp
        processedAt: null,             // Will be set when status changes to Processing
        receivedAt: null,              // Will be set when status changes to Accepted
      };

      if (formData.documentType === 'Certificate of Residency') {
        const residencyData = {
          name: userData.fullName,
          age: calculateAge(userData.birthday),
          civilStatus: userData.civilStatus,
          birthDate: userData.birthday,
          certificateType: formData.documentType,
          timestamp: timestamp,
          requestDate: currentDate,
          userId: userId,
          barangayName: userData.barangayName,
          barangayId: userData.barangayId,
          status: 'Pending',
          purpose: formData.purpose,
          requestSource: 'Mobile App',
          requestorType: 'Resident',
          birthPlace: formData.birthPlace,
          motherName: formData.motherName,
          fatherName: formData.fatherName,
          ...statusTimestamps  // Add all status timestamps
        };

        if (!formData.purpose || !formData.birthPlace || !formData.motherName || !formData.fatherName) {
          Alert.alert('Error', 'Please fill in all required fields');
          return;
        }

        await addDoc(collection(db, 'residencyRequests'), residencyData);
      } else {
        const commonFields = {
          name: userData.fullName,
          age: calculateAge(userData.birthday),
          civilStatus: userData.civilStatus,
          certificateType: formData.documentType,
          timestamp: timestamp,
          requestDate: currentDate,
          userId: userId,
          barangayName: userData.barangayName,
          barangayId: userData.barangayId,
          status: 'Pending',
          purpose: formData.purpose,
          requestSource: 'Mobile App',
          requestorType: 'Resident',
          ...statusTimestamps  // Add all status timestamps
        };

        if (!formData.purpose) {
          Alert.alert('Error', 'Please fill in the purpose field');
          return;
        }

        await addDoc(collection(db, 'documentRequests'), commonFields);
      }

      Alert.alert(
        'Success',
        'Your request has been submitted successfully',
        [{ 
          text: 'OK', 
          onPress: () => {
            resetForm();
            navigation.navigate('Home');
          }
        }]
      );

    } catch (error) {
      console.error('Error submitting request:', error);
      Alert.alert('Error', 'Failed to submit request. Please try again.');
    }
  };

  const handleDocumentTypeChange = (value) => {
    setFormData({
      documentType: value,
      fullName: '',
      age: '',
      civilStatus: '',
      purpose: '',
      requestDate: new Date().toLocaleDateString(),
      birthDate: '',
      birthPlace: '',
      motherName: '',
      fatherName: '',
    });
  };

  const renderRequestDateField = () => {
    const currentDate = new Date().toLocaleDateString();
    return (
      <>
        <Text style={styles.label}>Request Date</Text>
        <View style={[styles.input, styles.disabledInput]}>
          <Text>{currentDate}</Text>
        </View>
      </>
    );
  };

  // Add refreshing state
  const [refreshing, setRefreshing] = useState(false);

  // Add onRefresh function
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
      // Reset form data
      resetForm();
    } catch (error) {
      console.error('Error refreshing data:', error);
      Alert.alert('Error', 'Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#1679ab']} // Android
          tintColor="#1679ab"  // iOS
        />
      }
    >
      <View style={styles.formContainer}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Document Request Form</Text>
        </View>

        {/* Document Type Selection */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Select Document Type</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={formData.documentType}
              onValueChange={handleDocumentTypeChange}
              style={styles.picker}
            >
              <Picker.Item label="Choose document type" value="" />
              {documentTypes.map((type, index) => (
                <Picker.Item 
                  key={index} 
                  label={type} 
                  value={type}
                  color="#1679ab"
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Dynamic Form Fields */}
        {formData.documentType && (
          <View style={styles.formFields}>
            {renderFormByDocumentType()}
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity 
          style={[
            styles.submitButton,
            !userData && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!userData}
        >
          <Text style={styles.submitButtonText}>Submit Request</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    padding: 20,
  },
  headerSection: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1679ab',
    marginBottom: 12,
    textAlign: 'center',
  },
  barangayBadge: {
    backgroundColor: '#e8f4f8',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1679ab20',
  },
  barangayText: {
    color: '#1679ab',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  formFields: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#1679ab',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  submitButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  submitButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: '#666',
  },
  requiredField: {
    color: '#dc3545',
    marginLeft: 4,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
});