import { useState, useEffect } from 'react';
import { TouchableOpacity, Alert, ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';

// Auth Screens
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import ForgotPasswordScreen from './screens/auth/ForgotPassword';
import VerificationScreen from './screens/auth/VerificationScreen';

// Main Screens
import HomeScreen from './screens/main/HomeScreen';
import RequestFormScreen from './screens/main/RequestFormScreen';
import NotificationsScreen from './screens/main/NotificationsScreen';
import ProfileScreen from './screens/main/ProfileScreen';
import TransactionScreen from './screens/main/TransactionScreen';
import EditProfileScreen from './screens/main/EditProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator({ onLogout }) {
  const handleLogout = async () => {
    try {
      await auth.signOut();
      onLogout();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to logout');
    }
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Transaction':
              iconName = focused ? 'file-tray-full' : 'file-tray-full-outline';
              break;
            case 'Request':
              iconName = focused ? 'add-circle' : 'add-circle-outline';
              break;
            case 'Notifications':
              iconName = focused ? 'notifications' : 'notifications-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1679ab',
        tabBarInactiveTintColor: '#1679ab',
        headerStyle: {
          backgroundColor: '#1679ab',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="Transaction" 
        component={TransactionScreen}
        options={{ title: 'Transactions' }}
      />
      <Tab.Screen 
        name="Request" 
        component={RequestFormScreen}
        options={{ title: 'Request' }}
      />
      <Tab.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{ title: 'Notifications' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ 
          title: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  // Add loading state
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1679ab" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          // Add transition animation
          animation: 'slide_from_right',
        }}
      >
        {!isAuthenticated ? (
          // Auth Stack
          <>
            <Stack.Screen name="Login">
              {props => (
                <LoginScreen {...props} onLogin={() => setIsAuthenticated(true)} />
              )}
            </Stack.Screen>
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="Verification" component={VerificationScreen} options={{ headerShown: false }} />
          </>
        ) : (
          // Main App Stack
          <Stack.Screen name="MainApp">
            {props => (
              <TabNavigator {...props} onLogout={() => setIsAuthenticated(false)} />
            )}
          </Stack.Screen>
        )}
        <Stack.Screen 
          name="EditProfile" 
          component={EditProfileScreen}
          options={{
            headerShown: true,
            headerTitle: 'Edit Profile',
            headerStyle: {
              backgroundColor: '#1679ab',
            },
            headerTintColor: '#fff',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}