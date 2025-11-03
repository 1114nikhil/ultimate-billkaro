import { View, StyleSheet, Dimensions, Text, TextInput, Modal, FlatList, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Input } from '../../app-widget'
import GeographicService from './../../service/GeographicService';
import DropdownPicker from '../../app-widget/DropdownPicker';

const PersonalDetail = ({ formData, setFormData }) => {
  const [dropdownStateData, setDropdownStateData] = useState([]);
  const [dropdownCityData, setDropdownCityData] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  
  useEffect(() => {
    const stateId = selectedState !== null ? selectedState : 5;
    console.log(stateId);
    GeographicService(stateId).then(data => {
      setDropdownStateData(data);
      if (selectedState !== null) {
        setDropdownCityData(data); // Update city dropdown data
      }
    });
  }, [selectedState]);

  const handleSelectState = selectedItem => {
    // Handle selected item here
    setSelectedState(selectedItem.itemVal); 
  };
  const handleSelectCity = selectedItem => {
    // Handle selected item here
    setSelectedCity(selectedItem.itemVal); 
  };

  return (
    <View>
      <Input placeholder="Phone No." secureTextEntry={false}
        onChangeText={(phone) => setFormData({ ...formData, phone })}
        value={formData.phone} />
      <Input placeholder="Email" secureTextEntry={false}
        onChangeText={(email) => setFormData({ ...formData, email })}
        value={formData.email} />
        <Input placeholder="Adderss" secureTextEntry={false}
        onChangeText={(email) => setFormData({ ...formData, email })}
        value={formData.email} />
      {/* <Input placeholder="Country" secureTextEntry={false}
        onChangeText={(country) => setFormData({ ...formData, country })}
        value={formData.country} />
      <DropdownPicker data={dropdownStateData} placeholder="Select a state" onSelect={handleSelectState}  />
      <DropdownPicker data={dropdownCityData} placeholder="Select a city" onSelect={handleSelectCity}  /> */}
    </View>
  )
}

export default PersonalDetail
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({});