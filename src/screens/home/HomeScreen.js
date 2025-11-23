import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({navigation}) => {
  const [rides, setRides] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadRides();
  }, []);

  const loadRides = async () => {
    try {
      const ridesData = await AsyncStorage.getItem('allRides');
      if (ridesData) {
        const allRides = JSON.parse(ridesData);
        // Filter only upcoming rides
        const upcomingRides = allRides.filter(
          ride => new Date(ride.date) >= new Date() && ride.status === 'active',
        );
        setRides(upcomingRides);
      }
    } catch (error) {
      console.error('Failed to load rides:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRides();
    setRefreshing(false);
  };

  const renderRideItem = ({item}) => (
    <TouchableOpacity
      style={styles.rideCard}
      onPress={() => navigation.navigate('RideDetails', {ride: item})}>
      <View style={styles.rideHeader}>
        <View style={styles.routeInfo}>
          <View style={styles.locationRow}>
            <Icon name="location-on" size={20} color="#007AFF" />
            <Text style={styles.locationText}>{item.from}</Text>
          </View>
          <View style={styles.arrow}>
            <Icon name="arrow-downward" size={16} color="#999" />
          </View>
          <View style={styles.locationRow}>
            <Icon name="location-on" size={20} color="#FF3B30" />
            <Text style={styles.locationText}>{item.to}</Text>
          </View>
        </View>
      </View>

      <View style={styles.rideDetails}>
        <View style={styles.detailRow}>
          <Icon name="event" size={18} color="#666" />
          <Text style={styles.detailText}>
            {new Date(item.date).toLocaleDateString()} at {item.time}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="person" size={18} color="#666" />
          <Text style={styles.detailText}>
            {item.availableSeats} seat(s) available
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="attach-money" size={18} color="#666" />
          <Text style={styles.detailText}>₹{item.farePerKm}/km</Text>
        </View>
      </View>

      <View style={styles.rideFooter}>
        <Text style={styles.driverName}>By {item.driverName}</Text>
        <Text style={styles.totalFare}>
          Total: ₹{Math.round(item.distance * item.farePerKm)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Available Rides</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('CreateRide')}>
          <Icon name="add" size={24} color="#fff" />
          <Text style={styles.createButtonText}>Create Ride</Text>
        </TouchableOpacity>
      </View>

      {rides.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="directions-car" size={80} color="#ccc" />
          <Text style={styles.emptyText}>No rides available</Text>
          <Text style={styles.emptySubtext}>
            Be the first to create a ride!
          </Text>
        </View>
      ) : (
        <FlatList
          data={rides}
          renderItem={renderRideItem}
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
    marginBottom: 10,
  },
  createButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  listContent: {
    padding: 15,
  },
  rideCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rideHeader: {
    marginBottom: 12,
  },
  routeInfo: {
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  locationText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  arrow: {
    marginLeft: 4,
    marginVertical: 2,
  },
  rideDetails: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  rideFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  driverName: {
    fontSize: 14,
    color: '#666',
  },
  totalFare: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
});

export default HomeScreen;
