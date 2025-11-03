import { View, StyleSheet, Dimensions,ActivityIndicator  } from 'react-native';
import React, { useRef, useState, useEffect } from 'react'
import { Input } from '../../app-widget';
import { preAdd } from '../../service/CustomerService';

const CustRegisteration = ({ formData, invalidInputs, setFormData, loading }) => {
  const [customerData, setCustomerData] = useState(null);

  

  // Rest of your component code...
// };
// console.log(formData);
  console.log("Got invalid inputs ", JSON.stringify(invalidInputs))
  return (
    <View style={styles.formContainer}>
       {loading ? (
    <ActivityIndicator size="small" color="#0000FF" />
  ) : (
    <>
      <Input
        placeholder="Customer Code"
        secureTextEntry={false}
        onChangeText={(custCode) => setFormData({ ...formData,custCode })}
        value={formData?.custCode || ''} // Set the value with custCode from customerData
        disabled={true}
      />
      <Input
        placeholder="GSTIN No."
        secureTextEntry={false}
        onChangeText={(gstIn) => setFormData({ ...formData, gstIn })}
        value={formData.gstIn}
      />

      <Input
        placeholder= {"Customer Name" }
        secureTextEntry={false}
        onChangeText={(custName) => setFormData({ ...formData, custName })}
        value={formData.custName}
        style={[styles.input]}
        invalidInput = {invalidInputs.custName !== ''}
      />
       <Input 
      
      placeholder={"Phone No."}
        secureTextEntry={false}
        onChangeText={(phone) => setFormData({ ...formData, phone })}
        value={formData.phone} 
        style={[styles.input]}
        invalidInput = {invalidInputs.phone !== ''}
      />

      <Input 
      placeholder="Email"
      secureTextEntry={false}
      onChangeText={(email) => setFormData({ ...formData, email })}
      value={formData.email}
      />
      
      <Input placeholder="Adderss"
      secureTextEntry={false}
      onChangeText={(address) => setFormData({ ...formData, address })}
      value={formData.address} 
      style={[styles.input]}
        invalidInput = {invalidInputs.address !== ''}
      />
    </>
  )}
     

      {/* <Input
        placeholder="Customer Alias Name"
        secureTextEntry={false}
        onChangeText={(custNameAlias) => setFormData({ ...formData, custNameAlias })}
        value={formData.custNameAlias}
      /> */}
    </View>
  );
};

export default CustRegisteration;

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
 inValidBorder:{
    borderColor: 'red',
 },
});