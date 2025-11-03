import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL, GET_ITEM,EXPORT_ITEM } from '../url/ConstantURL';


const getAccessToken = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      return accessToken;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  };

 export const fetchItemData = async (userId, formattedDate, page) => {
  console.log('fetchItemData-page:',page);
    const accessToken = await getAccessToken();
    const url = `${BASE_URL()}${GET_ITEM()}/${userId}/${formattedDate}?itemSize=5&page=${page}`;
    try {
      const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('Report response:', response.data.data.billsReportList);
      if (response.data && response.data.data.itemsReportList) {
       return response;
      } else {
        console.error('Invalid response data:', response.data.data);
        throw new Error('Invalid response data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };

  export const exportItemData = async(userId, formattedDate,)=>{
    const accessToken = await getAccessToken();
    const exportUrl = `${BASE_URL()}${EXPORT_ITEM()}/${userId}/${formattedDate}`;
    try {
    // Make a request to get the export file
    const response = await axios.get(exportUrl, {
      responseType: 'arraybuffer', // Receive data as a binary buffer
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(response)
    return response;
} catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
  };