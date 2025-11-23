import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuth} from '../../context/AuthContext';
import {usePayment} from '../../context/PaymentContext';

const RideDetailsScreen = ({route, navigation}) => {
  const {ride} = route.params;
  const {user} = useAuth();
  const {addPoints, deductPoints, calculateRideFare} = usePayment();
  const [loading, setLoading] = useState(false);

  const isDriver = ride.driverId === user.id;
  const totalFare = calculateRideFare(ride.distance, ride.farePerKm);

  const handleBookRide = async () => {
    if (ride.availableSeats <= 0) {
      Alert.alert('Error', 'No seats available');
      return;
    }

    Alert.alert(
      'Confirm Booking',
      `Book this ride for ₹${totalFare}?\n\nPoints will be deducted from your wallet.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Confirm',
          onPress: async () => {
            setLoading(true);
            try {
              // Deduct points from passenger
              const result = await deductPoints(
                totalFare,
                `Ride from ${ride.from} to ${ride.to}`,
              );

              if (!result.success) {
                Alert.alert('Error', result.error);
                return;
              }

              // Update ride
              const updatedRide = {
                ...ride,
                availableSeats: ride.availableSeats - 1,
                passengers: [
                  ...ride.passengers,
                  {
                    userId: user.id,
                    userName: user.name,
                    bookedAt: new Date().toISOString(),
                  },
                ],
              };

              // Update in all rides
              const ridesData = await AsyncStorage.getItem('allRides');
              const allRides = ridesData ? JSON.parse(ridesData) : [];
              const rideIndex = allRides.findIndex(r => r.id === ride.id);
              if (rideIndex !== -1) {
                allRides[rideIndex] = updatedRide;
                await AsyncStorage.setItem('allRides', JSON.stringify(allRides));
              }

              // Add to driver's earnings
              await addPoints(totalFare, `Passenger booked ride to ${ride.to}`);

              Alert.alert('Success', 'Ride booked successfully!', [
                {text: 'OK', onPress: () => navigation.goBack()},
              ]);
            } catch (error) {
              Alert.alert('Error', 'Failed to book ride. Please try again.');
              console.error(error);
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Route</Text>
          <View style={styles.routeContainer}>
            <View style={styles.locationRow}>
              <Icon name="location-on" size={24} color="#007AFF" />
              <View style={styles.locationInfo}>
                <Text style={styles.locationLabel}>From</Text>
                <Text style={styles.locationText}>{ride.from}</Text>
              </View>
            </View>

            <View style={styles.routeLine} />

            <View style={styles.locationRow}>
              <Icon name="location-on" size={24} color="#FF3B30" />
              <View style={styles.locationInfo}>
                <Text style={styles.locationLabel}>To</Text>
                <Text style={styles.locationText}>{ride.to}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Schedule</Text>
          <View style={styles.detailRow}>
            <Icon name="event" size={20} color="#666" />
            <Text style={styles.detailText}>
              {new Date(ride.date).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="access-time" size={20} color="#666" />
            <Text style={styles.detailText}>{ride.time}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Ride Details</Text>
          <View style={styles.detailRow}>
            <Icon name="straighten" size={20} color="#666" />
            <Text style={styles.detailText}>{ride.distance} km</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="event-seat" size={20} color="#666" />
            <Text style={styles.detailText}>
              {ride.availableSeats} of {ride.totalSeats} seats available
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="attach-money" size={20} color="#666" />
            <Text style={styles.detailText}>₹{ride.farePerKm}/km</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Driver</Text>
          <View style={styles.driverInfo}>
            <Icon name="account-circle" size={40} color="#007AFF" />
            <View style={styles.driverDetails}>
              <Text style={styles.driverName}>{ride.driverName}</Text>
              {isDriver && (
                <Text style={styles.driverBadge}>You are the driver</Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.fareCard}>
          <Text style={styles.fareLabel}>Total Fare</Text>
          <Text style={styles.fareAmount}>₹{totalFare}</Text>
        </View>

        {!isDriver && ride.availableSeats > 0 && (
          <TouchableOpacity
            style={[styles.bookButton, loading && styles.buttonDisabled]}
            onPress={handleBookRide}
            disabled={loading}>
            <Text style={styles.bookButtonText}>
              {loading ? 'Booking...' : 'Book Ride'}
            </Text>
          </TouchableOpacity>
        )}

        {!isDriver && ride.availableSeats === 0 && (
          <View style={styles.unavailableButton}>
            <Text style={styles.unavailableText}>Ride Full</Text>
          </View>
        )}

        {isDriver && (
          <View style={styles.driverNote}>
            <Icon name="info" size={20} color="#007AFF" />
            <Text style={styles.driverNoteText}>
              This is your ride. Passengers will see this listing.
            </Text>
          </View>
        )}
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
  card: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  routeContainer: {
    paddingVertical: 10,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationInfo: {
    marginLeft: 10,
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: '#999',
  },
  locationText: {
    fontSize: 16,
    color: '#333',
    marginTop: 2,
  },
  routeLine: {
    width: 2,
    height: 30,
    backgroundColor: '#ddd',
    marginLeft: 11,
    marginVertical: 5,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverDetails: {
    marginLeft: 10,
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  driverBadge: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 4,
  },
  fareCard: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
  fareLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  fareAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 5,
  },
  bookButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  unavailableButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  unavailableText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  driverNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 8,
  },
  driverNoteText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#007AFF',
  },
});

export default RideDetailsScreen;
