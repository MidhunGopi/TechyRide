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
import {useAuth} from '../../context/AuthContext';

const MyRidesScreen = ({navigation}) => {
  const {user} = useAuth();
  const [rides, setRides] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMyRides();
  }, []);

  const loadMyRides = async () => {
    try {
      const ridesData = await AsyncStorage.getItem('allRides');
      if (ridesData) {
        const allRides = JSON.parse(ridesData);
        // Filter rides where user is driver or passenger
        const myRides = allRides.filter(
          ride =>
            ride.driverId === user.id ||
            ride.passengers.some(p => p.userId === user.id),
        );
        setRides(myRides);
      }
    } catch (error) {
      console.error('Failed to load rides:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMyRides();
    setRefreshing(false);
  };

  const renderRideItem = ({item}) => {
    const isDriver = item.driverId === user.id;
    const isPast = new Date(item.date) < new Date();

    return (
      <TouchableOpacity
        style={styles.rideCard}
        onPress={() => navigation.navigate('RideDetails', {ride: item})}>
        <View style={styles.rideHeader}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {isDriver ? 'Driver' : 'Passenger'}
            </Text>
          </View>
          {isPast && (
            <View style={[styles.badge, styles.pastBadge]}>
              <Text style={styles.badgeText}>Completed</Text>
            </View>
          )}
        </View>

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

        <View style={styles.rideDetails}>
          <View style={styles.detailRow}>
            <Icon name="event" size={18} color="#666" />
            <Text style={styles.detailText}>
              {new Date(item.date).toLocaleDateString()} at {item.time}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="attach-money" size={18} color="#666" />
            <Text style={styles.detailText}>
              ₹{Math.round(item.distance * item.farePerKm)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Rides</Text>
      </View>

      {rides.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="directions-car" size={80} color="#ccc" />
          <Text style={styles.emptyText}>No rides yet</Text>
          <Text style={styles.emptySubtext}>
            Create or book a ride to get started
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
    flexDirection: 'row',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  pastBadge: {
    backgroundColor: '#999',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  routeInfo: {
    marginBottom: 12,
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

export default MyRidesScreen;
