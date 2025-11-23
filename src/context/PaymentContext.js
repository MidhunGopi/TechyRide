import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {generateUniqueId} from '../utils/helpers';

const PaymentContext = createContext();

// Configuration constants
const POINTS_TO_INR_RATE = 1; // 1 Point = 1 INR

export const PaymentProvider = ({children}) => {
  const [points, setPoints] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    loadPaymentData();
  }, []);

  const loadPaymentData = async () => {
    try {
      const pointsData = await AsyncStorage.getItem('points');
      const transactionsData = await AsyncStorage.getItem('transactions');
      
      if (pointsData) {
        setPoints(JSON.parse(pointsData));
      }
      if (transactionsData) {
        setTransactions(JSON.parse(transactionsData));
      }
    } catch (error) {
      console.error('Failed to load payment data:', error);
    }
  };

  const addPoints = async (amount, description) => {
    try {
      const newPoints = points + amount;
      const transaction = {
        id: generateUniqueId(),
        type: 'credit',
        amount,
        description,
        timestamp: new Date().toISOString(),
        balance: newPoints,
      };

      const updatedTransactions = [transaction, ...transactions];
      
      await AsyncStorage.setItem('points', JSON.stringify(newPoints));
      await AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));
      
      setPoints(newPoints);
      setTransactions(updatedTransactions);
      
      return {success: true};
    } catch (error) {
      return {success: false, error: error.message};
    }
  };

  const deductPoints = async (amount, description) => {
    try {
      if (points < amount) {
        throw new Error('Insufficient points');
      }

      const newPoints = points - amount;
      const transaction = {
        id: generateUniqueId(),
        type: 'debit',
        amount,
        description,
        timestamp: new Date().toISOString(),
        balance: newPoints,
      };

      const updatedTransactions = [transaction, ...transactions];
      
      await AsyncStorage.setItem('points', JSON.stringify(newPoints));
      await AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));
      
      setPoints(newPoints);
      setTransactions(updatedTransactions);
      
      return {success: true};
    } catch (error) {
      return {success: false, error: error.message};
    }
  };

  const redeemPoints = async (amount, upiId) => {
    try {
      // Points to INR conversion using configured rate
      const inrAmount = amount * POINTS_TO_INR_RATE;

      if (points < amount) {
        throw new Error('Insufficient points');
      }

      // In production, integrate with payment gateway for UPI transfer
      const result = await deductPoints(amount, `Redeemed to ${upiId}`);
      
      if (result.success) {
        // Simulate UPI transfer
        return {
          success: true,
          message: `₹${inrAmount} transferred to ${upiId}`,
          transactionId: `TXN${Date.now()}`,
        };
      }

      return result;
    } catch (error) {
      return {success: false, error: error.message};
    }
  };

  const calculateRideFare = (distance, farePerKm) => {
    return Math.round(distance * farePerKm);
  };

  return (
    <PaymentContext.Provider
      value={{
        points,
        transactions,
        addPoints,
        deductPoints,
        redeemPoints,
        calculateRideFare,
      }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within PaymentProvider');
  }
  return context;
};
