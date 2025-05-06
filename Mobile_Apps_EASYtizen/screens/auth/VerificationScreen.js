import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { sendEmailVerification, reload } from 'firebase/auth';
import { auth } from '../../config/firebase';

export default function VerificationScreen({ navigation, route }) {
  const { email } = route.params;
  const [loading, setLoading] = useState(false);

  const handleResendEmail = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      await sendEmailVerification(user);
      Alert.alert('Success', 'Verification email has been resent. Please check your inbox.');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const checkVerificationStatus = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      await reload(user); // Refresh the user's token

      if (user.emailVerified) {
        Alert.alert(
          'Verified!',
          'Your email has been verified successfully.',
          [{ text: 'OK', onPress: () => navigation.replace('Login') }]
        );
      } else {
        Alert.alert('Not Verified', 'Please check your email and click the verification link.');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Email</Text>
      <Text style={styles.description}>
        A verification link has been sent to {email}. Please verify your email to continue.
      </Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleResendEmail}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="refresh" size={20} color="#fff" />
            <Text style={styles.buttonText}>Resend Verification Email</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button}
        onPress={checkVerificationStatus}
        disabled={loading}
      >
        <Ionicons name="checkmark-circle" size={20} color="#fff" />
        <Text style={styles.buttonText}>I've Verified My Email</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.secondaryButton]}
        onPress={() => navigation.navigate('Login')}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1679ab',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  secondaryButton: {
    backgroundColor: '#666',
  }
});