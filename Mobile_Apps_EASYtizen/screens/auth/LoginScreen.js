import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import * as Location from 'expo-location';

export default function LoginScreen({ navigation, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if email is verified
      if (!userCredential.user.emailVerified) {
        // Navigate to verification screen if not verified
        navigation.navigate('Verification', { 
          email: userCredential.user.email 
        });
        return;
      }

      // Only proceed with login if email is verified
      onLogin();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          bounces={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <Image
                source={require('../../assets/Municipal.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <View style={styles.titleContainer}>
                <Text style={[styles.title, { color: '#1679AB' }]}>EASY</Text>
                <Text style={[styles.titles, { color: '#ff0a0a' }]}>tizen</Text>
              </View>
              <Text style={styles.subtitle}>Document Request System</Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#1679ab" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#666"
                  value={email}
                  onChangeText={setEmail}
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
                  value={password}
                  onChangeText={setPassword}
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

              <TouchableOpacity 
                style={styles.forgotPassword}
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.loginButton}
                onPress={handleLogin}
              >
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.bottomContainer}>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Register')}
              >
                <Text style={styles.registerText}>
                  Don't have an account? <Text style={styles.registerHighlight}>Register here</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
    paddingBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginTop: 60,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Italic',
  },
  titles: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    fontStyle: 'italic'  // The exact name of your font file
},
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  formContainer: {
    width: '100%',
    paddingVertical: 20,
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
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#1679ab',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#1679ab',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomContainer: {
    width: '100%',
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    alignItems: 'center',
  },
  registerText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
  registerHighlight: {
    color: '#1679ab',
    fontWeight: 'bold',
  },
});