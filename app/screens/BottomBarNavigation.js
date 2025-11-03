// import { View, Text, StyleSheet } from 'react-native'
// import React, { useState,useEffect } from 'react'
// import Report from './Report';
// import Map from './Map'
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const Tab = createBottomTabNavigator();
// const BottomBarNavigation = () => {
//   const [role, setRole] = useState('');

//   // Load the role from AsyncStorage when the component mounts
//   useEffect(() => {
//     const loadRole = async () => {
//       try {
//         const storedRole = await AsyncStorage.getItem('role');
//         if (storedRole) {
//           setRole(storedRole);
//         }
//       } catch (error) {
//         // Handle error loading role
//       }
//     };

//     loadRole();
//   }, []);
//   return (
//     <Tab.Navigator
    
//     screenOptions={{
//       tabBarLabelStyle: { fontSize:15 },
//       tabBarStyle:{width:'100%',borderRadius:15,height:40,marginBottom:20},
//       headerShown:false
//     }}
//   >
//       <Tab.Screen 
//       name="Report"
//       component={Report}
//       options={{
//         tabBarIcon: ({ color, size }) => (
//           <Icon name="currency-inr" color={"#00ABF0"} size={15} />
//         ),
//       }} />
   
//         <Tab.Screen
//           name="Map"
//           component={Map}
//           options={{
//             tabBarIcon: ({ color, size }) => (
//               <Icon name="map-search-outline" color={"#00ABF0"} size={15} />
//             ),
//           }}
//         />
    
//     </Tab.Navigator>
//   );
// };

// export default BottomBarNavigation