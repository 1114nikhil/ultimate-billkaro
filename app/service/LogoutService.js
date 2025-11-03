import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, LOGOUT_URL } from '../url/ConstantURL';

const logoutService = async () => {
  try {
    const url=BASE_URL()+LOGOUT_URL();
    // Get the access token from AsyncStorage
    console.log('Logout failed.URL:', url);
    const accessToken = await AsyncStorage.getItem('accessToken');
    console.log('Logout accessToken:', accessToken);
   
    // Make a network request to the logout endpoint
    const response = await axios.post(`${url}`, null,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    console.log('Logout failed. response:', response);
    // Check if the response status is 200
    if (response.status === 200) {
      // Clear AsyncStorage
     
      await AsyncStorage.clear();
      return true; // Logout successful
    } else {
      // Handle other status codes if needed
      console.log('Logout failed. Status code:', response.status);
      return false; // Logout failed
    }
  } catch (error) {
    
    console.error('Error during logout:', error);
    return false; // Logout failed
  }
};

export default logoutService
