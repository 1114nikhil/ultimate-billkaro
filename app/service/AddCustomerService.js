import AsyncStorage from '@react-native-async-storage/async-storage';
import { ADD_CUSTOMER, BASE_URL } from '../url/ConstantURL';

const addCustomerService = async (formData) =>{
    try {

        // custCode": "2001",
        //     "custName": "Test Customer",
        //     "custNameAlias": "Test Customer",
        //     "acCode": "5",
        //     "typNo": 1,
        //     "grpNo": 1,
        //     "taxNo": "326HF68",
        //     "panNo": "PAN6885856",
        //     "actAddress": [
        //         {
        //             "addressNo": 0,
        //             "rowStatus": "new",
        //             "phone": "7075434879",
        //             "email": "customer@gmail.com",
        //             "countryNo": 1,
        //             "stateNo": 1,
        //             "cityNo": 1,
        //             "addressLine1": "banglore",
        //             "addressLine2": "banglore"
             

        let jsonRequest = JSON.stringify(
            {
                data:{
                    customer: {
                        // custCode: formData.custCode,
                        custName: formData.custName,
                        // custNameAlias: formData.custNameAlias,
                        // custCode: "4506",
                        // custName: "Ramu Singh",
                        // custNameAlias: "Ramu Singh",
                        // acCode: "1",
                            typNo: 1,
                        // grpNo: 1,
                        //  taxNo: formData.,
                        // panNo: "ADEWE2332D",
                        actAddress: [
                            {
                                // addressNo: 0,
                                // rowStatus: "new",
                                rowStatus: "new",
                                phone: formData.phone,
                                // phone: "3456780912",
                                email: formData.email,
                                //  email: "ramu@gmail.com",
                                // countryNo: 1,
                                // stateNo: 1,
                                // cityNo: 1,
                                addressLine1: formData.address,
                                // addressLine2: formData.addressLine2
                                // addressLine1: "East Street",
                                // addressLine2: "West Phase II"
                            }
                        ],
                    }
                }
            });
        console.log(jsonRequest);
        
        const accessToken = await AsyncStorage.getItem('accessToken');
        const response = await fetch(`${BASE_URL()}${ADD_CUSTOMER()}`,{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
                
                    Authorization: `Bearer ${accessToken}`,
                  
            },
            body: jsonRequest
    /*            
            JSON.stringify(
                {
                    data:{
                        // customer:{
                        //     custCode: "4040",
                        //     custName: "Ramesh" ,
                        //     custNameAlias: "Singh",
                            
                        //     email: email,
                        //     // country: country,
                        //     // state: state,
                        //     // city: city,
                        //     addressLine1: addressLine1,
                        //     addressLine2: addressLine2                        
                        // }
                        customer: {
                            custCode: custCode,
                            custName: "Ramesh Kumar",
                            custNameAlias: "Ramesh Kumar",
                            acCode: "1",
                            typNo: 1,
                            grpNo: 1,
                            taxNo: "326GF08",
                            panNo: "PAN6909006"
                           
                           
                        }
                    }
                }
            ), */
        });
        
        console.log('add Customer ====',response);
        
        

        // const data = await response.json();
        

        //     console.log(data);
           

        //     if(data.result.errNo!==200){
        //         throw new Error(data.message);
        //     }
        //     return data;
         const data = await response.json();
        console.log(data);
   
       if (data.result.errNo!==200) {
         throw new Error(data.message);
       }
       return data;
     } catch (error) {
       throw new Error(error);
     }
}

export default addCustomerService;