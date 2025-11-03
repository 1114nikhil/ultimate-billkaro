import React, { useEffect, useState, useRef } from 'react';
import { View, Text, PermissionsAndroid, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { fetchGeographData } from './../service/GeographicService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Map = () => {
  const mapRef = useRef(null);

  const [location, setLocation] = useState({ latitude: 12.971599, longitude: 77.594566 });
  const [geogrphData, setGeogrphData] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    requestPermissionsAndLoadData();
    // getLocation();
  }, []);

  const requestPermissionsAndLoadData = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Geo-Location Permission',
          message: 'App needs your current Location',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // console.log('Location permission granted. Fetching data...');
        getLocation();
      } else {
        console.log('Location permission denied');
      }
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
        console.log('Map No data found in AsyncStorage.');
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

  const getLocation = () => {
    
    Geolocation.getCurrentPosition(
      (position) => {
        const currentLocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(currentLocationData);
        setCurrentLocation(currentLocationData);
        retrieveUserData();
        // fetchAndUpdateGeogrphData();
      },
      (error) => {
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
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

  // const formatDateToDdMmYyyy = (date) => {
  //   const dd = String(date.getDate()).padStart(2, '0');
  //   const mm = String(date.getMonth() + 1).padStart(2, '0');
  //   const yyyy = date.getFullYear();

  //   return `${dd}-${mm}-${yyyy}`;
  // };
  const formatDateToDdMmYyyy = (date) => {
    if (typeof date === 'string') {
      const dateObj = new Date(date); // Parse the date string to create a Date object
      const dd = String(dateObj.getDate()).padStart(2, '0');
      const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
      const yyyy = dateObj.getFullYear();
  
      return `${dd}-${mm}-${yyyy}`;
    } else {
      console.error('Invalid date object:', date);
      // You might want to handle this error gracefully or return a default value.
      return ''; // Return an empty string as a fallback.
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
            >
              {/* <Callout>
                <Text>{ userData.selectedUser.itemLbl}</Text>
              </Callout> */}
            </Marker>
          ))}

        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            title="Current Location"
            pinColor="red"
          />
        )}
      </MapView>

      <TouchableOpacity
        style={styles.locationButton}
        onPress={() => {
          requestPermissionsAndLoadData();
        }}
      >
        <Text style={{ color: '#fff' }}>Get Location</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
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
  userInfoContainer: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 5,
  },
  calendarContainer: {
    flex: 1,
    fontSize: 30,
    position: 'absolute',
    borderColor: 'blue',
    borderWidth: 1,
    top: 20,
    left: 20,
    width: '40%',
    height: 40,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 5,
    marginRight: 10,
  },
});

export default Map;