import { StyleSheet, View,Dimensions} from 'react-native'
import React from 'react'
import { Input } from '../../app-widget'

const Address = ({formData,setFormData}) => {
  // addressLine1:"",
  //       addressLine2:"",
  return (
    <View style={styles.addressContiner}> 
     <Input placeholder="Address 1"  secureTextEntry={false}
        onChangeText={(addressLine1) => setFormData({ ...formData, addressLine1})}
        value={formData.addressLine1}/>
    <Input placeholder="Address 2"  secureTextEntry={false}
        onChangeText={(addressLine2) => setFormData({ ...formData, addressLine2})}
        value={formData.addressLine2}/>
    </View>
  )
}

export default Address
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const styles=StyleSheet.create({
  
})