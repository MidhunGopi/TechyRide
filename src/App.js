/**
 * TechyRide - Main Application Component
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {AuthProvider} from './context/AuthContext';
import {PaymentProvider} from './context/PaymentContext';
import AppNavigator from './navigation/AppNavigator';

const App = () => {
  return (
    <AuthProvider>
      <PaymentProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </PaymentProvider>
    </AuthProvider>
  );
};

export default App;
