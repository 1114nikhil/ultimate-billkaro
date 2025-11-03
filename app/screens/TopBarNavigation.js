import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import DropdownPicker from '../app-widget/DropdownPicker';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import ItemReport from './ItemReport';
import Report from './Report';
import Map from './Map';
import DateTimePicker from '@react-native-community/datetimepicker';
import {fetchSalesExecutiveList} from './../service/GeographicService';
import {Button} from '../app-widget';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-root-toast';

const Tab = createMaterialTopTabNavigator();

const STORAGE_KEY = 'userAndDate';

const TopBarNavigation = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownScrolling, setIsDropdownScrolling] = useState(false);

  useEffect(() => {
    fetchData(page);
  }, [page]);

  // const handleDropdownScroll = () => {
  //   setIsDropdownScrolling(true);
  //   fetchData(page);
  // };

  const fetchData = async page => {
    try {
      setIsLoading(true);
      const data = await fetchSalesExecutiveList(page);
      console.log(`UserData ${JSON.stringify(data)}`)
      if (data.result.errNo === 200) {
        const newSalesExecutives = data?.data?.salesExecutiveList.map(user => ({
          itemLbl: `${user.userFirstName} ${user.userLastName}`,
          itemVal: user.userNo,
        }));

        // Filter out duplicate users before adding to the state
        const filteredNewUsers = newSalesExecutives.filter(newUser => {
          return !users.some(
            existingUser => existingUser.itemVal === newUser.itemVal,
          );
        });

        // Update the state with the filtered new users
        setUsers(prevUsers => [...prevUsers, ...filteredNewUsers]);
        setIsLoading(false);
      } else {
        console.error('Failed to fetch data');
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleUserSelect = selectedItem => {
    setSelectedUser(selectedItem);
  };

  const handleDateChange = (event, selected) => {
    const currentDate = selected || selectedDate;
    setShowDatePicker(false);
    setSelectedDate(currentDate);
  };

  // const loadMoreData = () => {
  //   // if (distanceFromEnd > 0 && !isDropdownScrolling) {
  //   if (!isDropdownScrolling) {
  //     const nextPage = page + 1;
  //     setPage(nextPage);
  //   }
  // };
  
  const loadMoreData = () => {
    if (!isLoading) {
      setPage(prev => prev + 1); // ✅ increments properly for page 3+
    }
  };

  const handleDropdownScroll = () => {
    loadMoreData(); // ✅ trigger pagination instead of fetching same page
  };

  const handleSubmitBtn = async () => {
    try {
      // await AsyncStorage.removeItem(STORAGE_KEY);

      // Check if selectedUser and selectedDate are not null
      if (selectedUser && selectedDate) {
        Toast.show('User has been selected!', {duration: Toast.durations.LONG});
        // Convert selectedDate to a string (or any format you prefer)
        const formattedDate = selectedDate.toISOString();
        // Create an object to store both selectedUser and selectedDate
        const dataToStore = {
          selectedUser,
          selectedDate: formattedDate,
        };

        // Convert the object to a JSON string
        const dataString = JSON.stringify(dataToStore);

        // Store the data in AsyncStorage with a specific key
        await AsyncStorage.setItem(STORAGE_KEY, dataString);
        const storedData = await AsyncStorage.getItem(STORAGE_KEY);
        console.log('stored data:' + storedData);
        setPage(1);
        // Navigate to the Map screen with selectedUser and selectedDate as parameters
      } else {
        console.error('selectedUser or selectedDate is null');
      }
    } catch (error) {
      console.error('Error storing data in AsyncStorage:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.dropdownContainer}>
          <DropdownPicker
            data={users}
            placeholder="Select a user"
            onSelect={handleUserSelect}
            loadMoreData={loadMoreData}
            onDropdownScroll={handleDropdownScroll} // Pass the callback
          />
        </View>

        <View style={styles.calendarContainer}>
          <TouchableOpacity
            style={styles.calendarButton}
            onPress={() => {
              setShowDatePicker(true);
            }}>
            <Text style={styles.calendarText}>
              {selectedDate.getDate().toString().padStart(2, '0')}-
              {(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-
              {selectedDate.getFullYear()}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>
        <View style={styles.submitContainer}>
          <Button
            onPress={handleSubmitBtn}
            text={'Select'}
            style={styles.submitButton}
          />
        </View>
      </View>
      <Tab.Navigator
        screenOptions={{
          activeTintColor: 'blue',
          inactiveTintColor: 'gray',
          labelStyle: {fontSize: 16},
          tabStyle: {width: 120},
          style: {backgroundColor: 'white'},
        }}>
        <Tab.Screen name="Report" component={Report} />
        <Tab.Screen name="Item" component={ItemReport} />
        <Tab.Screen name="Map" component={Map} />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '15%',
    width: '100%',
    zIndex: 10,
    margin: '1%',
  },
  dropdownContainer: {
    flex: 1,             // let it resize naturally
    marginRight: 8,
    zIndex: 20,
  },
  calendarContainer: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    marginLeft:9,
    borderColor: 'blue',
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 8,
    backgroundColor: '#fff',
  },
   calendarButton: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  calendarText: {
    fontSize: 16,
    color: 'blue',
  },
  submitContainer: {
    width: '20%', // Adjust the width as needed
    zIndex: 2,
    borderRadius: 5,
  },
  submitButton: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  submitText: {
    fontSize: 16,
    color: 'white',
  },
});

export default TopBarNavigation;
