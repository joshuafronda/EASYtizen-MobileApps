import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    barangayId: '',
    barangayName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const barangayList = [
    'Select Barangay',
    'Alalum',
  'Antipolo',
  'Balimbing',
  'Banaba',
  'Bayanan',
  'Danglayan',
  'Del Pilar',
  'Gelerang Kawayan',
  'Ilat North',
  'Ilat South',
  'Kaingin',
  'Laurel',
  'Malaking Pook',
  'Mataas na Lupa',
  'Natunuan North',
  'Natunuan South',
  'Padre Castillo',
  'Palsahingin',
  'Pila',
  'Poblacion',
  'Pook ni Banal',
  'Pook ni Kapitan',
  'Resplandor',
  'Sambat',
  'San Antonio',
  'San Mariano',
  'San Mateo',
  'Santa Elena',
  'Santo Niño'
];

  const validateForm = () => {
    if (!formData.fullName || !formData.email || !formData.password || 
        !formData.confirmPassword || !formData.barangayId || 
        formData.barangayId === 'Select Barangay' || !formData.barangayName) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    try {
      console.log('Starting registration with data:', formData); // Debug log

      // Form validation
      if (!formData.fullName || !formData.email || !formData.password || 
          !formData.confirmPassword || !formData.barangayId) {
        console.log('Missing fields:', {
          fullName: !formData.fullName,
          email: !formData.email,
          password: !formData.password,
          confirmPassword: !formData.confirmPassword,
          barangayId: !formData.barangayId
        });
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }

      // Create user
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      console.log('User created:', userCredential.user.uid);

      // Send verification email
      await sendEmailVerification(userCredential.user);
      console.log('Verification email sent');

      // Save to Firestore
      const userRef = doc(db, 'users', userCredential.user.uid);
      const userData = {
        fullName: formData.fullName,
        email: formData.email,
        barangayId: formData.barangayId,
        barangayName: formData.barangayId,
        role: 'resident',
        status: 'pending',
        userType: 'mobile',
        emailVerified: false,
        createdAt: new Date().toISOString()
      };

      await setDoc(userRef, userData);
      console.log('User data saved to Firestore');

      // Navigate to verification
      navigation.navigate('Verification', { email: formData.email });

    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Registration failed: ' + error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Create Account</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#1679ab" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#666"
            value={formData.fullName}
            onChangeText={(text) => setFormData({...formData, fullName: text})}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#1679ab" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#666"
            value={formData.email}
            onChangeText={(text) => setFormData({...formData, email: text})}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#1679ab" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#666"
            value={formData.password}
            onChangeText={(text) => setFormData({...formData, password: text})}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity 
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons 
              name={showPassword ? "eye-outline" : "eye-off-outline"} 
              size={20} 
              color="#1679ab" 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#1679ab" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#666"
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity 
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons 
              name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
              size={20} 
              color="#1679ab" 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.pickerContainer}>
          <Ionicons name="location-outline" size={20} color="#1679ab" style={styles.inputIcon} />
          <Picker
            selectedValue={formData.barangayId}
            style={styles.picker}
            onValueChange={(itemValue) =>
              setFormData({...formData, barangayId: itemValue})
            }
          >
            {barangayList.map((barangay, index) => (
              <Picker.Item 
                key={index} 
                label={barangay} 
                value={barangay}
                enabled={index !== 0}
                color={index === 0 ? '#666' : '#333'}
              />
            ))}
          </Picker>
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={20} color="#1679ab" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#666"
            value={formData.phoneNumber}
            onChangeText={(text) => setFormData({...formData, phoneNumber: text})}
            keyboardType="phone-pad"
          />
        </View>

        <TouchableOpacity 
          style={styles.registerButton}
          onPress={handleRegister}
        >
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.loginHighlight}>Login here</Text>
          </Text>
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
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#1679ab',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: '100%',
    paddingVertical: 8,
  },
  eyeIcon: {
    padding: 8,
  },
  registerButton: {
    backgroundColor: '#1679ab',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  registerButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: 20,
  },
  loginText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 14,
  },
  loginHighlight: {
    color: '#1679ab',
    fontWeight: 'bold',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 15,
    height: 50,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  picker: {
    flex: 1,
    height: 50,
    color: '#333',
  },
});