import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ADD_CUSTOMER, BASE_URL, CUSTOMER_CUST_CODE, EDIT_CUSTOMER, PRE_ADD_CUSTOMER } from '../url/ConstantURL';

const CustomerService = () => {

    // const getCustomer=()=>{

    // }

  

}

const preAdd =async() => {
  try {
    const accessToken = await AsyncStorage.getItem('accessToken');
    const response = await axios.get(
      `${BASE_URL()}${PRE_ADD_CUSTOMER()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = response.data.data;
    // await AsyncStorage.setItem('productData', JSON.stringify(data));
    console.log(data);
    return data
  } catch (error) {
     console.error(error);
  }
}
const addCustomer = async (formData) =>{
  try {  
      let jsonRequest = JSON.stringify(
          {
              data:{
                  customer: {
                    custCode: formData.custCode,
                    custName: formData.custName,
                    typNo: 1,
                    acCode: "115",
                    gstIn: formData.gstIn,
                    actAddress: [
                          {
                              rowStatus: "new",
                              phone: formData.phone,
                              email: formData.email,
                              addressLine1: formData.address,
                          }
                      ],
                  }
              }
          });
      console.log('addCustomer: ',jsonRequest);
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await fetch(`${BASE_URL()}${ADD_CUSTOMER()}`,{
          method: 'POST',
          headers:{
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
          },
          body: jsonRequest
      });
       const data = await response.json();
       console.log("Got data===>", data);
     if (data.result.errNo!==200) {
       throw new Error(data.message);
       
     }
     return data;
   } catch (error) {
    console.log(error)
     throw new Error(error);
   }
}

const custCodeService = async(custCode) =>{
  try {
    const accessToekn = await AsyncStorage.getItem('accessToken');
    const response = await axios.get(
      `${BASE_URL()}${CUSTOMER_CUST_CODE()}/${custCode}`,
      {
        headers:{
          Authorization:`Bearer ${accessToekn}`,
      },
      }
    );
    const data = response.data.data.customer;
    return data;
  } catch (error) {
    console.log("getCustCode by Customer Service===>", error);
  }
}

const editCustomer = async(custCode, formData) =>{
  try {
    let jsonRequest =       {
          data:{
              customer: {
                custCode: formData.custCode,
                  custName: formData.custName,
                      typNo: 1,
                      acCode: "115",
                      grpNo: 1,
                  actAddress: [
                      {
                          rowStatus: "update",
                          phone: formData.phone,
                          email: formData.email,
                          addressLine1: formData.address,
                      }
                  ],
              }
          }
      };
    const accessToekn = await AsyncStorage.getItem('accessToken');
    const response = await axios.put(
      `${BASE_URL()}${EDIT_CUSTOMER()}/${custCode}`,
      jsonRequest,
      {
        headers:{
          'Content-Type': 'application/json',
          Authorization:`Bearer ${accessToekn}`,
      }
      
      }
    );
    const UpdateData = response.data.data.customer;
    return UpdateData;
  } catch (error) {
    console.log("editCustomer Error:", error);
  }
}
export { addCustomer, custCodeService, CustomerService, editCustomer, preAdd };
