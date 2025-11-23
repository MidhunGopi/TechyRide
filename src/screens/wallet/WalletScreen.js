import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {usePayment} from '../../context/PaymentContext';

const WalletScreen = ({navigation}) => {
  const {points, transactions} = usePayment();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Reload payment data from storage
    setTimeout(() => setRefreshing(false), 1000);
  };

  const renderTransaction = ({item}) => {
    const isCredit = item.type === 'credit';
    return (
      <View style={styles.transactionCard}>
        <View style={styles.transactionIcon}>
          <Icon
            name={isCredit ? 'add-circle' : 'remove-circle'}
            size={24}
            color={isCredit ? '#34C759' : '#FF3B30'}
          />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionDescription}>{item.description}</Text>
          <Text style={styles.transactionDate}>
            {new Date(item.timestamp).toLocaleString()}
          </Text>
        </View>
        <View style={styles.transactionAmount}>
          <Text
            style={[
              styles.transactionAmountText,
              isCredit ? styles.creditText : styles.debitText,
            ]}>
            {isCredit ? '+' : '-'}₹{item.amount}
          </Text>
          <Text style={styles.balanceText}>Bal: ₹{item.balance}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Wallet</Text>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available Points</Text>
        <Text style={styles.balanceAmount}>₹{points}</Text>
        <Text style={styles.balanceNote}>
          1 Point = ₹1 INR
        </Text>
        <TouchableOpacity
          style={styles.redeemButton}
          onPress={() => navigation.navigate('Redeem')}>
          <Icon name="redeem" size={20} color="#fff" />
          <Text style={styles.redeemButtonText}>Redeem via UPI</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.transactionsHeader}>
        <Text style={styles.transactionsTitle}>Transaction History</Text>
      </View>

      {transactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="receipt" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No transactions yet</Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  balanceCard: {
    backgroundColor: '#007AFF',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  balanceNote: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    marginTop: 5,
  },
  redeemButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 15,
  },
  redeemButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  transactionsHeader: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  transactionCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionIcon: {
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionAmountText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  creditText: {
    color: '#34C759',
  },
  debitText: {
    color: '#FF3B30',
  },
  balanceText: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 15,
  },
});

export default WalletScreen;
