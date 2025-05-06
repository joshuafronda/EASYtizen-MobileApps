import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { auth, db } from '../../config/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function EditProfileScreen({ navigation, route }) {
  const { userData } = route.params;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Information
    fullName: userData?.fullName || '',
    birthday: userData?.birthday || '',
    gender: userData?.gender || '',
    civilStatus: userData?.civilStatus || '',
    nationality: userData?.nationality || 'Filipino',

    // Contact Information
    phoneNumber: userData?.phoneNumber || '',
    address: userData?.address || '',

    // Employment & Education
    occupation: userData?.occupation || '',
    employmentStatus: userData?.employmentStatus || '',
    educationalAttainment: userData?.educationalAttainment || '',
    monthlyIncome: userData?.monthlyIncome || '',

    // Government Information
    voterStatus: userData?.voterStatus || '',
    sssNumber: userData?.sssNumber || '',
    philhealthNumber: userData?.philhealthNumber || '',
    pagibigNumber: userData?.pagibigNumber || '',

    // Health Information
    bloodType: userData?.bloodType || '',
    healthConditions: userData?.healthConditions || '',
    pwdStatus: userData?.pwdStatus || 'No',
    vaccineStatus: userData?.vaccineStatus || '',

    // Emergency Contact
    emergencyContact: userData?.emergencyContact || '',
    emergencyNumber: userData?.emergencyNumber || '',
    emergencyRelationship: userData?.emergencyRelationship || '',

    // Household Information
    householdRole: userData?.householdRole || '',
    numberOfHouseholdMembers: userData?.numberOfHouseholdMembers || '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  // Dropdown Options
  const genderOptions = ['Male', 'Female', 'Prefer not to say'];
  const civilStatusOptions = ['Single', 'Married', 'Widowed', 'Separated', 'Divorced'];
  const educationalOptions = [
    'Elementary',
    'High School',
    'Senior High School',
    'College',
    'Vocational',
    'Post Graduate',
    'None'
  ];
  const employmentOptions = [
    'Employed',
    'Unemployed',
    'Self-employed',
    'Student',
    'Retired'
  ];
  const bloodTypeOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const voterOptions = ['Yes', 'No'];
  const vaccineOptions = [
    'Not Vaccinated',
    'Partially Vaccinated',
    'Fully Vaccinated',
    'With Booster'
  ];
  const householdRoleOptions = [
    'Head of Family',
    'Spouse',
    'Child',
    'Parent',
    'Other Relative'
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userId = auth.currentUser.uid;
        const userDoc = await getDoc(doc(db, 'users', userId));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log('Fetched user data:', userData); // For debugging
          
          setFormData({
            ...formData,
            // Convert timestamp to Date if it exists, otherwise leave empty
            birthday: userData.birthday ? userData.birthday : '',
            // ... other fields ...
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to load user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      const userId = auth.currentUser.uid;
      const userRef = doc(db, 'users', userId);

      await updateDoc(userRef, formData);
      Alert.alert('Success', 'Profile updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate && event.type !== 'dismissed') {
      handleInputChange('birthday', selectedDate.toLocaleDateString());
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#1679ab" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Basic Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name <Text style={styles.required}></Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            value={formData.fullName}
            onChangeText={(text) => handleInputChange('fullName', text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Birthday <Text style={styles.required}></Text></Text>
          <TouchableOpacity
            style={[styles.input, styles.dateInput]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{formData.birthday || 'Select birth date'}</Text>
            <FontAwesome name="calendar" size={20} color="#666" />
          </TouchableOpacity>
          
          {showDatePicker && (
            <DateTimePicker
              value={formData.birthday ? new Date(formData.birthday) : new Date()}
              mode="date"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Gender <Text style={styles.required}></Text></Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.gender}
              onValueChange={(value) => handleInputChange('gender', value)}
              style={styles.picker}
            >
              <Picker.Item label="Select Gender" value="" />
              {genderOptions.map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Civil Status <Text style={styles.required}></Text></Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.civilStatus}
              onValueChange={(value) => handleInputChange('civilStatus', value)}
              style={styles.picker}
            >
              <Picker.Item label="Select Civil Status" value="" />
              {civilStatusOptions.map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Registered Voter <Text style={styles.required}></Text></Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.voterStatus}
              onValueChange={(value) => handleInputChange('voterStatus', value)}
              style={styles.picker}
            >
              <Picker.Item label="Are you a registered voter?" value="" />
              <Picker.Item label="Registered" value="Registered" />
              <Picker.Item label="Not Registered" value="Not Registered" />
            </Picker>
          </View>
        </View>
      </View>

      {/* Contact Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number <Text style={styles.required}></Text></Text>
          <TextInput
            style={styles.input}
            placeholder="11-digit phone number"
            value={formData.phoneNumber}
            onChangeText={(text) => handleInputChange('phoneNumber', text)}
            keyboardType="numeric"
            maxLength={11}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Complete Address <Text style={styles.required}></Text></Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Enter your complete address"
            value={formData.address}
            onChangeText={(text) => handleInputChange('address', text)}
            multiline
            numberOfLines={3}
          />
        </View>
      </View>

      {/* Employment & Education */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Employment & Education</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Educational Attainment</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.educationalAttainment}
              onValueChange={(value) => handleInputChange('educationalAttainment', value)}
              style={styles.picker}
            >
              <Picker.Item label="Select Educational Attainment" value="" />
              {educationalOptions.map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Employment Status</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.employmentStatus}
              onValueChange={(value) => handleInputChange('employmentStatus', value)}
              style={styles.picker}
            >
              <Picker.Item label="Select Employment Status" value="" />
              {employmentOptions.map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Occupation</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your occupation"
            value={formData.occupation}
            onChangeText={(text) => handleInputChange('occupation', text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Monthly Income</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter monthly income"
            value={formData.monthlyIncome}
            onChangeText={(text) => handleInputChange('monthlyIncome', text)}
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Health Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Information</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Blood Type</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.bloodType}
              onValueChange={(value) => handleInputChange('bloodType', value)}
              style={styles.picker}
            >
              <Picker.Item label="Select Blood Type" value="" />
              {bloodTypeOptions.map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Health Conditions</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Enter any health conditions"
            value={formData.healthConditions}
            onChangeText={(text) => handleInputChange('healthConditions', text)}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Vaccine Status</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.vaccineStatus}
              onValueChange={(value) => handleInputChange('vaccineStatus', value)}
              style={styles.picker}
            >
              <Picker.Item label="Select Vaccine Status" value="" />
              {vaccineOptions.map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      {/* Emergency Contact */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Contact</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contact Name <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Enter emergency contact name"
            value={formData.emergencyContact}
            onChangeText={(text) => handleInputChange('emergencyContact', text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contact Number <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="11-digit phone number"
            value={formData.emergencyNumber}
            onChangeText={(text) => handleInputChange('emergencyNumber', text)}
            keyboardType="numeric"
            maxLength={11}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Relationship</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter relationship to contact"
            value={formData.emergencyRelationship}
            onChangeText={(text) => handleInputChange('emergencyRelationship', text)}
          />
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity 
        style={styles.saveButton}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
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
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#1679ab',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1679ab',
    marginBottom: 5,
  },
  required: {
    color: 'red',
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});