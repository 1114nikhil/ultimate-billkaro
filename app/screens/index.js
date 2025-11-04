import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { Animated, Image, Text, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { logoutService } from '../service/LogoutService';
import SalesScreen from './SalesScreen';
import TopBarNavigation from './TopBarNavigation';


const Index = () => {
  // State to store the username
  const [userName, setUserName] = useState('');
  const [role, setRole] = useState('');

  //#region menu
  const [showMenu, setShowMenu] = useState(false);
  const moveToRight = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const [selectedMenuItem, setSelectedMenuItem] = useState(0);
  const navigation = useNavigation(); // Use useNavigation to access navigation object

  // Define the handleLogout function
  const handleLogout = async () => {
    const isLogoutSuccessful = await logoutService();

    if (isLogoutSuccessful) {
      // Navigate to the login screen
      navigation.navigate('Login'); // Make sure you have a 'Login' screen defined in your navigation stack
    } else {
      // Handle logout failure as needed
    }
  };

  const menu = [
    { icon: require('../../assets/images/home.png'), title: 'Home' },
    { icon: require('../../assets/images/logout.png'), title: 'Logout', action: handleLogout },
  ];

  // Load the username from AsyncStorage when the component mounts
  useEffect(() => {
    const loadUserNameAndRole = async () => {
      try {
        const getUserName = await AsyncStorage.getItem('userName');
        const getRole = await AsyncStorage.getItem('role');
        if (getUserName) {
          setUserName(getUserName);
        }
        if (getRole) {
          setRole(getRole);
        }
      } catch (error) {
        // Handle error loading username
      }
    };

    loadUserNameAndRole();
  }, []);
console.log('role====>',role);
  const renderSelectedScreen = () => {
    switch (menu[selectedMenuItem].title) {
      case 'Home':
        // return role === '1' ? <BottomBarNavigation /> : role === '4' ? <SalesScreen /> : null;
        return role === '1' ? <TopBarNavigation /> : role === '4' ? <SalesScreen /> : null;
      default:
        return null;
    }
  };
  //#endRegion menu

  return (
    <LinearGradient
      colors={['#9DC5C3', '#5E5C5C']}
      style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {/* Menu Design */}
        {avatar()}
        {menuItem()}
        {drawer()}
      </View>
    </LinearGradient>
  );

  function avatar() {
    const roleText = role === '1' ? 'Admin' : role === '4' ? 'Sales' : '';
    return (
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 30,
        }}>
        <Image
          source={require('../../assets/images/person.png')}
          style={{
            width: 70,
            height: 70,
            borderRadius: 35,
            marginLeft: 20,
            backgroundColor: 'white',
            borderWidth: 3,
            borderColor: 'grey',
          }}
        />
        <View style={{ marginLeft: 10 }}>
          {/* Display the username */}
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
            {userName}
          </Text>
          <Text style={{ fontSize: 15, color: 'white' }}>{roleText}</Text>
        </View>
      </View>
    );
  }

  function menuItem() {
    return (
      <View style={{ marginTop: 30 }}>
        <FlatList
          data={menu}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                style={{
                  marginLeft: 20,
                  marginTop: 20,
                  backgroundColor: selectedMenuItem === index ? '#fff' : null,
                  borderRadius: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onPress={() => {
                  if (item.action) {
                    item.action();
                  } else {
                    setSelectedMenuItem(index);
                  }
                }}>
                <Image
                  source={item.icon}
                  style={{
                    width: 24,
                    height: 24,
                    marginLeft: 10,
                    tintColor: selectedMenuItem === index ? '#000' : '#fff',
                  }}
                />
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '800',
                    marginLeft: 15,
                    color: selectedMenuItem === index ? '#000' : '#fff',
                  }}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  }

  function drawer() {
    return (
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: '#f5f5f5',
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          top: 0,
          transform: [{ scale: scale }, { translateX: moveToRight }],
          borderRadius: showMenu ? 15 : 0,
        }}>
        <View style={{ flexDirection: 'row', marginTop: 30 }}>
          <TouchableOpacity
            style={{ marginLeft: 20 }}
            onPress={() => {
              Animated.timing(scale, {
                toValue: showMenu ? 1 : 0.8,
                duration: 200,
                useNativeDriver: true,
              }).start();
              Animated.timing(moveToRight, {
                toValue: showMenu ? 0 : 230,
                duration: 200,
                useNativeDriver: true,
              }).start();
              setShowMenu(!showMenu);
            }}>
            <Image
              source={require('../../assets/images/menu.png')}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
          <Text style={{ marginLeft: 20, fontSize: 20, fontWeight: '800' }}>
            {menu[selectedMenuItem].title}
          </Text>
        </View>
        {screenCall()}
      </Animated.View>
    );

    function screenCall() {
      return (
        <View
          style={{
            width: '100%',
            height: '92%',
            borderBottomLeftRadius: showMenu ? 15 : 0,
          }}>
          {renderSelectedScreen()}
        </View>
      );
    }
  }
};

export default Index;