import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {usePayment} from '../../context/PaymentContext';

const RedeemScreen = ({navigation}) => {
  const {points, redeemPoints} = usePayment();
  const [amount, setAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRedeem = async () => {
    if (!amount || !upiId) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const redeemAmount = parseFloat(amount);

    if (isNaN(redeemAmount) || redeemAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (redeemAmount > points) {
      Alert.alert('Error', 'Insufficient points');
      return;
    }

    if (redeemAmount < 10) {
      Alert.alert('Error', 'Minimum redemption amount is ₹10');
      return;
    }

    // UPI ID validation - supports various formats
    const upiPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
    if (!upiPattern.test(upiId)) {
      Alert.alert('Error', 'Please enter a valid UPI ID (e.g., user@bank)');
      return;
    }

    Alert.alert(
      'Confirm Redemption',
      `Redeem ₹${redeemAmount} to ${upiId}?\n\nThis action cannot be undone.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Confirm',
          onPress: async () => {
            setLoading(true);
            const result = await redeemPoints(redeemAmount, upiId);
            setLoading(false);

            if (result.success) {
              Alert.alert('Success', result.message, [
                {text: 'OK', onPress: () => navigation.goBack()},
              ]);
            } else {
              Alert.alert('Error', result.error);
            }
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.balanceCard}>
          <Icon name="account-balance-wallet" size={48} color="#007AFF" />
          <Text style={styles.balanceLabel}>Available Points</Text>
          <Text style={styles.balanceAmount}>₹{points}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Redemption Details</Text>

          <View style={styles.inputContainer}>
            <Icon name="money" size={24} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Amount to redeem (₹)"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="payment" size={24} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="UPI ID (e.g., user@upi)"
              value={upiId}
              onChangeText={setUpiId}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.infoBox}>
            <Icon name="info" size={20} color="#007AFF" />
            <Text style={styles.infoText}>
              Minimum redemption: ₹10{'\n'}
              Processing time: Instant{'\n'}
              1 Point = ₹1 INR
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.redeemButton, loading && styles.buttonDisabled]}
            onPress={handleRedeem}
            disabled={loading}>
            <Icon name="redeem" size={20} color="#fff" />
            <Text style={styles.redeemButtonText}>
              {loading ? 'Processing...' : 'Redeem Now'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>Note:</Text>
          <Text style={styles.noteText}>
            • Points will be instantly transferred to your UPI ID{'\n'}
            • Make sure your UPI ID is correct{'\n'}
            • Transaction cannot be reversed once processed{'\n'}
            • For any issues, contact support
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 15,
  },
  balanceCard: {
    backgroundColor: '#E3F2FD',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    flexDirection: 'row',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#007AFF',
    lineHeight: 20,
  },
  redeemButton: {
    backgroundColor: '#34C759',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  redeemButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  noteCard: {
    backgroundColor: '#FFF3CD',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  noteText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
});

export default RedeemScreen;
