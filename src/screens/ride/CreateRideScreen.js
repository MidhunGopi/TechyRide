import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuth} from '../../context/AuthContext';
import {generateUniqueId} from '../../utils/helpers';

const CreateRideScreen = ({navigation}) => {
  const {user} = useAuth();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [seats, setSeats] = useState('');
  const [farePerKm, setFarePerKm] = useState('');
  const [distance, setDistance] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateRide = async () => {
    if (!from || !to || !date || !time || !seats || !farePerKm || !distance) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (isNaN(seats) || parseInt(seats) <= 0) {
      Alert.alert('Error', 'Please enter valid number of seats');
      return;
    }

    if (isNaN(farePerKm) || parseFloat(farePerKm) <= 0) {
      Alert.alert('Error', 'Please enter valid fare per km');
      return;
    }

    if (isNaN(distance) || parseFloat(distance) <= 0) {
      Alert.alert('Error', 'Please enter valid distance');
      return;
    }

    setLoading(true);

    try {
      const ride = {
        id: generateUniqueId(),
        from,
        to,
        date,
        time,
        availableSeats: parseInt(seats),
        totalSeats: parseInt(seats),
        farePerKm: parseFloat(farePerKm),
        distance: parseFloat(distance),
        driverId: user.id,
        driverName: user.name,
        status: 'active',
        passengers: [],
        createdAt: new Date().toISOString(),
      };

      // Load existing rides
      const ridesData = await AsyncStorage.getItem('allRides');
      const allRides = ridesData ? JSON.parse(ridesData) : [];
      
      // Add new ride
      allRides.push(ride);
      await AsyncStorage.setItem('allRides', JSON.stringify(allRides));

      // Add to user's rides
      const myRidesData = await AsyncStorage.getItem('myRides');
      const myRides = myRidesData ? JSON.parse(myRidesData) : [];
      myRides.push(ride);
      await AsyncStorage.setItem('myRides', JSON.stringify(myRides));

      Alert.alert('Success', 'Ride created successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create ride. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Route Details</Text>

        <View style={styles.inputContainer}>
          <Icon name="location-on" size={24} color="#007AFF" />
          <TextInput
            style={styles.input}
            placeholder="Starting Point"
            value={from}
            onChangeText={setFrom}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="location-on" size={24} color="#FF3B30" />
          <TextInput
            style={styles.input}
            placeholder="Destination"
            value={to}
            onChangeText={setTo}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="straighten" size={24} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Distance (km)"
            value={distance}
            onChangeText={setDistance}
            keyboardType="decimal-pad"
          />
        </View>

        <Text style={styles.sectionTitle}>Schedule</Text>

        <View style={styles.inputContainer}>
          <Icon name="event" size={24} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Date (YYYY-MM-DD)"
            value={date}
            onChangeText={setDate}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="access-time" size={24} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Time (HH:MM)"
            value={time}
            onChangeText={setTime}
          />
        </View>

        <Text style={styles.sectionTitle}>Ride Details</Text>

        <View style={styles.inputContainer}>
          <Icon name="event-seat" size={24} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Available Seats"
            value={seats}
            onChangeText={setSeats}
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="attach-money" size={24} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Fare per km (₹)"
            value={farePerKm}
            onChangeText={setFarePerKm}
            keyboardType="decimal-pad"
          />
        </View>

        {farePerKm && distance && (
          <View style={styles.totalFareContainer}>
            <Text style={styles.totalFareLabel}>Total Fare:</Text>
            <Text style={styles.totalFareValue}>
              ₹{Math.round(parseFloat(farePerKm) * parseFloat(distance))}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.createButton, loading && styles.buttonDisabled]}
          onPress={handleCreateRide}
          disabled={loading}>
          <Text style={styles.createButtonText}>
            {loading ? 'Creating...' : 'Create Ride'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.noteText}>
          Note: In production, Google Maps integration will allow you to select
          locations on the map and calculate distance automatically.
        </Text>
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
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  totalFareContainer: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  totalFareLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalFareValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  createButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noteText: {
    fontSize: 12,
    color: '#999',
    marginTop: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default CreateRideScreen;
