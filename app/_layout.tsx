import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Geocoder from 'react-native-geocoding';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Orientation from 'react-native-orientation-locker';
import { RootSiblingParent } from 'react-native-root-siblings';
import AdminScreen from './screens/AdminScreen';
import BillingScreen from './screens/BillingScreen';
import Index from './screens/index';
import ItemReport from './screens/ItemReport';
import LoginScreen from './screens/LoginScreen';
import Map from './screens/Map';
import Report from './screens/Report';
import SalesScreen from './screens/SalesScreen';
import TopBarNavigation from './screens/TopBarNavigation';
import { Stack } from 'expo-router';

const Stack = createNativeStackNavigator();
Geocoder.init('AIzaSyCTA7SmV7Bl04oUmgEjHNGZK_Adre19WxI');
const App = () => {

  useEffect(()=>{
    Orientation.lockToPortrait();
  },[]);
  return (
    // <RootSiblingParent>
    // <GestureHandlerRootView style={styles.root}>
    // <NavigationContainer>
    //   <Stack.Navigator screenOptions={{ headerShown: false }}>
    //     <Stack.Screen name="Login" component={LoginScreen} />
    //     <Stack.Screen name="Admin" component={AdminScreen} />
    //     <Stack.Screen name="Sales" component={SalesScreen} />
    //     <Stack.Screen name="Billing" component={BillingScreen} />
    //     <Stack.Screen name="TopBarNavigation" component={TopBarNavigation}/>
    //     <Stack.Screen name="Index" component={Index}/>
    //     {/* <Stack.Screen name='Form' component={Form}/> */}
    //     {/* <Stack.Screen name='InvoiceViewer' component={InvoiceViewer} /> */}
    //     <Stack.Screen name="Report" component={Report} />
    //         <Stack.Screen name="ItemReport" component={ItemReport} />
    //         <Stack.Screen name="Map" component={Map} />
    //   </Stack.Navigator>
    // </NavigationContainer>
    // </GestureHandlerRootView>
    // </RootSiblingParent>
    <RootSiblingParent>
      <GestureHandlerRootView style={styles.root}>
        <Stack screenOptions={{ headerShown: false }} />
      </GestureHandlerRootView>
    </RootSiblingParent>

  );
};

export default App
const styles=StyleSheet.create({
root:{
  flex:1
}
});