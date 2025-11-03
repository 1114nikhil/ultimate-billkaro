import React, { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-root-toast';
import { addCustomer, custCodeService, editCustomer, preAdd } from '../../service/CustomerService';
import CustRegisteration from './CustRegisteration';

const Form = ({ isEdit, custCode}) => {
  // const{ isEdit, custCode}=route.params;
 
  const [formData, setFormData] = useState({ 
    gstIn: '',
    custName: '',
    phone: '',
    email: '',
    address: '',
  });



  const [invalidInputs, setInvalidInput] = useState({
    gstIn: '',
    custName: '',
    phone: '',
    email: '',
    address: '',
  })

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if(isEdit){
      loadCustData();
    }else{
     preAddData();
  }
  }, []);

  const preAddData = async () => {
    try {
    const newFormData = {phone:'',
      custCode:'', 
      custName:'', 
      email:'', 
      address:''};
      setFormData(newFormData);
      const data = await preAdd();
      console.log("Got ", formData, setFormData)
      if (data.customer && data.customer.custCode) {
        setFormData({ ...formData, custCode: data.customer.custCode});
      }
    } catch (error) {
      console.error(error);
    } finally {
      
      setLoading(false);
    }
  };

  const loadCustData = async() => {
    
    custCodeService(custCode). then(
      

      (temp1) => {
        console.log("Got CustCode===>", temp1);
        const newFormData = {phone:temp1.actAddress[0].phone,
           custCode:temp1.custCode, 
           custName:temp1.custName,
           gstIn:temp1.gstIn, 
           email:temp1.actAddress[0].email, 
           address:temp1.actAddress[0].addressLine1};
           setFormData({...newFormData});
      }
    ).finally(()=> {setLoading(false)});
   
    
  }
  
  

  const [screen, setCompScreen] = useState(0);
  const FormTitles = ['Customer Register'];

  const isFormTitleFirst = screen === 0;
  const isFormTitleLast = screen === FormTitles.length - 1;

  const ScreenDisplay = () => {
    if (screen === 0) return <CustRegisteration formData={formData} invalidInputs={invalidInputs} setFormData={setFormData} loading={loading} />;
    // else if (screen === 1) return <PersonalDetail formData={formData} setFormData={setFormData} />;
    // else if (screen === 2) return <Address formData={formData} setFormData={setFormData} />;
  };

  const prevButton = () => {
    setCompScreen((currentScreen) => currentScreen - 1);
  };

  const validateFormData= () =>{
    const isValid = true;
    const newInvalidInput = {};
    if(formData.custName === ''){
      newInvalidInput.custName = "Customer name can't be empty";
      isValid = false;
    }else{
      newInvalidInput.custName = ''     
    }
    setInvalidInput(newInvalidInput);
    return isValid;


  }


  const submitForm = async() => {

    if(validateFormData()=== false){
      return ;
    }
    let response;

    try {
      if(isEdit){
        response = await editCustomer(formData.custCode, formData)
      }else{
        response =await addCustomer(formData);
      }
      console.log("Response===>", JSON.stringify(response) );

      
      if (response && response.result && response.result.errMsg==="Success"){

        setFormData({
          custCode:'',
          gstIn: '',
          custName: '',
         
          phone: '',
          email: '',
          address: '',
        }) ;
        
        Toast.show('Data Saved Sucessfully!!', {duration:Toast.durations.LONG});

       } else {

        Toast.show("Data not saved", {duration:Toast.durations.LONG});
      }
   

    } catch (error) {
      
      
       console.log('Error Saving data', error);
      
      

      
    }
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <Text style={styles.title}>{FormTitles[screen]}</Text>
      <View style={styles.formContainer}>{ScreenDisplay()}</View>

      <View style={styles.btnContainer}>
        {!isFormTitleFirst && (
          <Pressable onPress={prevButton} style={styles.button}>
            <Text style={styles.buttonText}>Prev</Text>
          </Pressable>
        )}
        {!isFormTitleLast ? (
          <Pressable onPress={() =>setCompScreen((currentScreen) => currentScreen + 1)} style={styles.button}>
            <Text style={styles.buttonText}>Next</Text>
          </Pressable>
        ) : (
          <Pressable onPress={() => submitForm()} style={styles.button}>
            <Text style={styles.buttonText}>Submit</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
   padding:5
  },
  title: {
    fontSize: 18,
    color: '#9E9EFF',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
   
  },
  btnContainer: {
    // backgroundColor:'grey',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    // marginBottom: 20,
  },
  button: {
    backgroundColor: '#5D9C59',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Form;