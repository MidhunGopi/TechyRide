import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {useAuth} from '../context/AuthContext';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Main Screens
import HomeScreen from '../screens/home/HomeScreen';
import CreateRideScreen from '../screens/ride/CreateRideScreen';
import RideDetailsScreen from '../screens/ride/RideDetailsScreen';
import MyRidesScreen from '../screens/ride/MyRidesScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import WalletScreen from '../screens/wallet/WalletScreen';
import RedeemScreen from '../screens/wallet/RedeemScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'MyRides') {
            iconName = 'directions-car';
          } else if (route.name === 'Wallet') {
            iconName = 'account-balance-wallet';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{title: 'Find Rides'}} 
      />
      <Tab.Screen 
        name="MyRides" 
        component={MyRidesScreen}
        options={{title: 'My Rides'}} 
      />
      <Tab.Screen 
        name="Wallet" 
        component={WalletScreen}
        options={{title: 'Wallet'}} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{title: 'Profile'}} 
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const {user, loading} = useAuth();

  if (loading) {
    return null; // Or a loading screen
  }

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {!user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen 
            name="CreateRide" 
            component={CreateRideScreen}
            options={{headerShown: true, title: 'Create Ride'}}
          />
          <Stack.Screen 
            name="RideDetails" 
            component={RideDetailsScreen}
            options={{headerShown: true, title: 'Ride Details'}}
          />
          <Stack.Screen 
            name="Redeem" 
            component={RedeemScreen}
            options={{headerShown: true, title: 'Redeem Points'}}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
