
import { BASE_URL, LOGIN_URL } from '../url/ConstantURL';
import Toast from 'react-native-root-toast';

const loginService = async (username, password) => {
  //  console.log('LoginService',username,password);
  //  console.log(BASE_URL,LOGIN_URL);
  const formattedUsername = username.replace(/\s+/g, '').toLowerCase(); //use if necessary Logic to trim space and convert to lowercase
  // console.log('formattedUsername===>',formattedUsername);
  // console.log("Gonna login")
  try {
    const response = await fetch(`${BASE_URL()}${LOGIN_URL()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        {
          data: {
            loginData: {
              userCode: username,
              password: password,
              "companyNo": 3,
              "branchNo": 4
            }
          }
        }),

    });
    console.log(response);

    const data = await response.json();
      console.log(data);

    if (data.result.errNo !== 200) {
      Toast.show("Invalid Username or Password", {duration:Toast.durations.LONG});
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

export default loginService