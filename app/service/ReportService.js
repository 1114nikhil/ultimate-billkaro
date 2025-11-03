import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL, GET_REPORT,EXPORT_REPORT } from '../url/ConstantURL';
import Toast from 'react-native-root-toast';

const getAccessToken = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      return accessToken;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  };

 export const fetchReportData = async (userId, formattedDate, page) => {
    const accessToken = await getAccessToken();
    const url = `${BASE_URL()}${GET_REPORT()}/${userId}/${formattedDate}?itemSize=5&page=${page}`;
    console.log(url);
    try {
      const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('Report response:', response.data.data.billsReportList);
      if (response.data && response.data.data.billsReportList) {
        return response;
      } else {
        console.error('Invalid response data:', response.data.data);
        Toast.show("No record found!", {duration:Toast.durations.LONG});
        throw new Error('Invalid response data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };

  export const exportReportData = async(userId, formattedDate,)=>{
    const accessToken = await getAccessToken();
    const exportUrl = `${BASE_URL()}${EXPORT_REPORT()}/${userId}/${formattedDate}`;
    try {
    // Make a request to get the export file
    const response = await axios.get(exportUrl, {
       responseType: 'arraybuffer', // Receive data as a binary buffer
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('exportReportData===>',response);
    return response;
    
} catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
  };