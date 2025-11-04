import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Input } from './app-widget';
import loginService from './service/LoginService';


const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isUsernameInvalid, setIsUsernameInvalid] = useState(false);
  const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);

  const handleSubmit = async () => {
    try {
      const response = await loginService(email, password);
    console.log('login respoce ======>',response);
      if (response.result.errNo === 200) {
        await AsyncStorage.setItem('accessToken', response.token.accessToken);
        await AsyncStorage.setItem(
          'userName',
          response.privileges.userFirstName + ' ' + response.privileges.userLastName
        );
        await AsyncStorage.setItem('role', String(response.privileges.groupNo));
        setEmail('');
        setPassword('');
        // navigation.navigate('Index');
        router.push('/Index'); 
      } else {
        // Handle invalid login here
        setIsUsernameInvalid(false);
        setIsPasswordInvalid(false);
        // Show an error message (you can customize this)
        // Alert.alert('Invalid Username or Password', 'Please check your credentials.');
      }
    } catch (error) {
      // Handle other errors if needed
      // console.error('Login Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>
          <Text style={styles.blueText}>UltimateTek</Text> <Text style={styles.greenText}>Solution</Text>
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <Input
          placeholder="Username"
          secureTextEntry={false}
          onChangeText={(text) => setEmail(text)}
          value={email}
          invalidInput={isUsernameInvalid}
        />
        <Input
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
          value={password}
          invalidInput={isPasswordInvalid}
        />
      </View>
      <View style={styles.btnContainer}>
        <Button onPress={handleSubmit} text={'Login'} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', // White background color
  },
  logoContainer: {
    marginBottom: 50,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  blueText: {
    color: '#4747ff', // Blue color
  },
  greenText: {
    color: '#76a901', // Green color
  },
  inputContainer: {
    marginBottom: 20,
    width: '80%',
  },
  btnContainer: {
    width: 60,
    height: 40,
  },
});

export default LoginScreen;