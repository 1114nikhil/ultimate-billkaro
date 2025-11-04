import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location'; // ✅ Use Expo Location API
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { fetchGeographData } from './../service/GeographicService';

const Map = () => {
  const mapRef = useRef(null);

  const [location, setLocation] = useState({ latitude: 12.971599, longitude: 77.594566 });
  const [geogrphData, setGeogrphData] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    requestPermissionsAndLoadData();
  }, []);

  const requestPermissionsAndLoadData = async () => {
    try {
      // ✅ Request permission using Expo's API
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
      getLocation();
    } catch (err) {
      console.warn(err);
    }
  };

  const retrieveUserData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('userAndDate');
      if (storedData) {
        const userData = JSON.parse(storedData);
        fetchAndUpdateGeogrphData(userData.selectedUser, userData.selectedDate);
      } else {
        console.log('Map: No data found in AsyncStorage.');
      }
    } catch (error) {
      console.error('Error retrieving data from AsyncStorage:', error);
    }
  };

  const fetchAndUpdateGeogrphData = async (selectedUser, selectedDate) => {
    if (selectedUser && selectedDate) {
      const formattedDate = formatDateToDdMmYyyy(selectedDate);
      try {
        const data = await fetchGeographData(selectedUser.itemVal, formattedDate);
        if (data.result.errNo === 200) {
          setGeogrphData(data.data.geogrphRgn);
        } else {
          console.error('Failed to fetch geographical data');
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const getLocation = async () => {
    try {
      // ✅ Use Expo’s Location API
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const currentLocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      setLocation(currentLocationData);
      setCurrentLocation(currentLocationData);
      retrieveUserData();
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const moveToMarker = (latitude, longitude) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.04,
        longitudeDelta: 0.05,
      });
    }
  };

  const formatDateToDdMmYyyy = (date) => {
    if (typeof date === 'string') {
      const dateObj = new Date(date);
      const dd = String(dateObj.getDate()).padStart(2, '0');
      const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
      const yyyy = dateObj.getFullYear();
      return `${dd}-${mm}-${yyyy}`;
    } else {
      console.error('Invalid date object:', date);
      return '';
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={{
          ...location,
          latitudeDelta: 0.04,
          longitudeDelta: 0.05,
        }}
      >
        {geogrphData
          .filter((data) => !isNaN(data.latitudeY) && !isNaN(data.longitudeX))
          .map((data, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: parseFloat(data.latitudeY),
                longitude: parseFloat(data.longitudeX),
              }}
              onLayout={() => {
                moveToMarker(parseFloat(data.latitudeY), parseFloat(data.longitudeX));
              }}
            />
          ))}

        {currentLocation && (
          <Marker coordinate={currentLocation} title="Current Location" pinColor="red" />
        )}
      </MapView>

      <TouchableOpacity style={styles.locationButton} onPress={requestPermissionsAndLoadData}>
        <Text style={{ color: '#fff' }}>Get Location</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  locationButton: {
    width: '90%',
    height: 50,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    borderRadius: 5,
  },
});

export default Map;
