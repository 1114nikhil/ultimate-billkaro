import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, ADD_PRODUCT } from '../url/ConstantURL';

const addProductService = async (payload) => {
  try {
    var jsonRequest = JSON.stringify({
      data: {
        salesOrder: payload,
      },
    });
    console.log("JsonRequest========>", jsonRequest);
    const accessToken = await AsyncStorage.getItem('accessToken');
    console.log("Sending token ", accessToken);

    var headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await fetch(`${BASE_URL()}${ADD_PRODUCT()}`, {
      method: 'POST',
      headers: headers,
      body: jsonRequest,
    });
    console.log("Add Product Service==========>", response);

    // Check if the response status indicates success (HTTP status 200)
    if (response.status === 200) {
      const data = await response;
      console.log("Got data===>", data);

      // Check the errNo in the JSON response
    //   if (data.result.errNo !== 200) {
    //     throw new Error(data.message);
    //   }

      return data;
    } else {
      // Handle non-200 HTTP status codes here if needed
      throw new Error(`HTTP error: ${response.status}`);
    }
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

export default addProductService;