import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CustomMarker = ({ name }) => {
  return (
    <View style={styles.markerContainer}>
      <Text style={styles.markerText}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.7)', // Customize the marker background color
    padding: 5,
    borderRadius: 5,
  },
  markerText: {
    color: '#fff', // Customize the text color
    fontWeight: 'bold',
  },
});

export default CustomMarker;