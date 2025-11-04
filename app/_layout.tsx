import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import Geocoder from 'react-native-geocoding';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootSiblingParent } from 'react-native-root-siblings';

// const NativeStack = createNativeStackNavigator();
Geocoder.init('AIzaSyCTA7SmV7Bl04oUmgEjHNGZK_Adre19WxI');

export default function Layout() {
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
         {/* <NativeStack.Screen name="Login" component={LoginScreen} /> */}
      </GestureHandlerRootView>
    </RootSiblingParent>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
