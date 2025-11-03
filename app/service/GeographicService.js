import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL, ADD_STATE,SALES_EXICUTIVE_URL,GET_GEOLOCATION_URL } from '../url/ConstantURL';

const getAccessToken = async () => {
  try {
    const accessToken = await AsyncStorage.getItem('accessToken');
    return accessToken;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
};

export const fetchGeogrphDtlList = async (geographicId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios.get(
      `${BASE_URL()}${ADD_STATE()}/${geographicId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.data.customer.geogrphDtlList;
  } catch (error) {
    console.error('Error fetching geogrphDtlList:', error);
    throw error;
  }
};

export const fetchSalesExecutiveList = async (page) => {
    const accessToken = await getAccessToken();
    // console.log('page====>',`${BASE_URL()}${SALES_EXICUTIVE_URL()}${page}`);
    const response = await axios.get(
      `${BASE_URL()}${SALES_EXICUTIVE_URL()}${page}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log('SalesExicutive Responce======>',response);
    return response.data;
};

export const fetchGeographData = async (itemVal,selectedDate)=>{
  console.log('GeographicService-fetchGeographData-itemVal,selectedDate',itemVal,selectedDate);
    const accessToken = await getAccessToken();
    const response = await axios.get(
      `${BASE_URL()}${GET_GEOLOCATION_URL()}/${itemVal}/${selectedDate}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
}