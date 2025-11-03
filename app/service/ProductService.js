
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, PRODUCT_LIST, PRE_ADD_PRODUCT_ORDER , ADD_PRODUCT} from '../url/ConstantURL';
import axios from 'axios';

const addProductService = async(payload)=>{
  try{

      
  var jsonRequest = JSON.stringify(
      {
          data:{
              salesOrder: payload
      }});
      console.log("JsonRequest========>",jsonRequest);
      const accessToken = await AsyncStorage.getItem('accessToken');
      const userName = await AsyncStorage.getItem('userName');
      console.log("Sending token ", accessToken)
      console.log("Sending Useranme ", userName)
      
      var headers = {
          'Content-Type': 'application/json',
         
             Authorization: `Bearer ${accessToken}`,
           
     };

      const response = await fetch(`${BASE_URL()}${ADD_PRODUCT()}`,{
          method: 'POST',
          headers:headers,
          body: jsonRequest

      });
      console.log("Add Product Service==========>",response);
      const data = await response.json();
      console.log("Got data===>", data)
      if (data.result.errNo!==200) {
          throw new Error(data.message);
          
      }
      return data;
  }catch(error){
      console.error(error);
      throw new Error(error);
  }
}

const PreAddOrderService = async () =>{
  try {   
     
      const accessToken = await AsyncStorage.getItem('accessToken');
      
      // console.log("Access Token ====> Pre order Service",accessToken );
      const response = await axios.get(
          `${BASE_URL()}${PRE_ADD_PRODUCT_ORDER()}`,
          {
          headers:{
              
                  Authorization: `Bearer ${accessToken}`, 
          },
      });
      
      console.log('fetch pre ====',response);
      
  
       const data =  response.data.data.salesOrder.orderNo;
      console.log("Data======>",data);
     return data;
   } catch (error) {
    console.error(error);
    throw new Error(error);
   }
}



const ProductService = async () => {


  // console.log('fetchProduct',BASE_URL(),ITEM_LIST());
  try {
    const accessToken = await AsyncStorage.getItem('accessToken');
    // const username = await AsyncStorage.getItem('userName');
    // console.log('username :', username);
    const response = await axios.get(
      `${BASE_URL()}${PRODUCT_LIST()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    // console.log('Item data ============',response.data.data);
    const data = response.data.data;


    // console.log('Product service data',data);
    // console.log('Item name',response.data.data.itemList[0].itmName);
    // console.log('Item price',response.data.data.itemList[0].itemPriceList[0].itmPrice);
    // await AsyncStorage.setItem('productData', JSON.stringify(data));
    return data
  } catch (error) {
    //  console.error(error);
  }
}

export {ProductService,addProductService,PreAddOrderService}