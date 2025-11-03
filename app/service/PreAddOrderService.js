import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL,PRE_ADD_PRODUCT_ORDER} from '../url/ConstantURL';
import axios from 'axios';

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

export default PreAddOrderService;