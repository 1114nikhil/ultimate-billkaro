import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import ddown from "../../assets/json-request/ddown.json"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { FlatList, TextInput } from 'react-native-gesture-handler';
// import Icon from 'react-native-vector-icons/dist/AntDesign';
import { AntDesign as Icon } from '@expo/vector-icons';
import { Button } from '../app-widget';
import Form from './component/Form';

import axios from 'axios';

import moment from 'moment';


import Toast from 'react-native-root-toast';
import addProductService from '../service/AddProductService';
import PreAddOrderService from '../service/PreAddOrderService';
import { ProductService } from '../service/ProductService';
import { BASE_URL, CUSTOMER_PAGINATION } from '../url/ConstantURL';
import InvoiceViewer from './InvoiceViewer';

const SalesScreen = () => {
  const [selectedCustomer, setSelectedCustomer] = useState('Select Customer');
  const [selectedCustomerData, setSelectedCustomerData] = useState({});
  const [products, setProducts] = useState([]);
  const [productList, setProductList] = useState([]);
  const [productPrice, setProductPrice] = useState('retail');
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [data, setData] = useState();
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef();
  // const navigation = useNavigation();

  const [productQuantity, setProductQuantity] = useState({});
  const [productPriceType, setProductPriceType] = useState({})

  const [isAddPopupVisible, setIsAddPopupVisible] = useState(false);
  const [isEditPopupVisible, setIsEditPopupVisible] = useState(false);
  const [isCustomerSelected, setIsCustomerSelected] = useState(false);

  const [selectedPriceType, setSelectedPriceType] = useState('');

  const [pdfData, setPdfData] = useState(null);
  const [showInvoiceViewer, setShowInvoiceViewer] = useState(false);


  


 

  const openAddPopup = () => {
    setIsAddPopupVisible(true);
  };

  const closeAddPopup = () => {
    setIsAddPopupVisible(false);
  };




  const openEditPopup = (formData) => {
     setIsEditPopupVisible(true);
  };

  const closeEditPopup = () => {
    setIsEditPopupVisible(false);
  };


  const onSearch = (txt) => {
    if (txt !== '') {
      let tempData = data.filter(item => {
        return item.name.toLowerCase().match(txt.toLowerCase())
      });
      setData(tempData);
    } else {
      // setData(ddown);
    }
    setIsCustomerSelected(false)
  }

  const handleSubmit = async () => {
  try {
    // ✅ Ask for location permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Toast.show('Location permission denied.', { duration: Toast.durations.LONG });
      return;
    }

    // ✅ Get current location
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });

    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;

    if (Object.keys(selectedCustomerData).length === 0) {
      Toast.show("Please select customer", { duration: Toast.durations.LONG });
      return;
    }

    setIsLoading(true);

    let selectedProductList = [];
    for (const [itemCode, qty] of Object.entries(productQuantity)) {
      let curProduct = productList.find(p => p.itmCode === itemCode);
      if (!curProduct) continue;

      let rateType = productPriceType[curProduct.itmCode];
      let itemPrice = curProduct.itemPriceList.find(x => x.rateType === rateType)?.itmPrice || 0;

      let productPayload = {
        itmCode: curProduct.itmCode,
        rateType,
        itmName: curProduct.itmName,
        itmUnt: curProduct.itemDtlList.itmUnt,
        discPer: 0,
        taxPer: 0,
        itmQty: parseInt(qty),
        itmPrice: itemPrice,
        rowStatus: "new",
      };
      selectedProductList.push(productPayload);
    }

    let orderNo = await PreAddOrderService();
    let date = moment().utcOffset('+05:30').format('YYYY-MM-DD[T]hh:mm:ss.SSS[Z]');

    let payload = {
      custCode: selectedCustomerData.custCode,
      orderNo,
      orderDate: date,
      curCode: "INR",
      latitudeY: latitude,
      longitudeX: longitude,
      orderDtls: selectedProductList,
    };

    console.log("Submitting ", JSON.stringify(payload));

    try {
      const result = await addProductService(payload);
      const pdfDataBlob = await result.blob();
      const pdfDatas = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(pdfDataBlob);
      });

      setPdfData(pdfDatas);
      if (pdfDatas) setShowInvoiceViewer(true);

      setSelectedCustomer('Select Customer');
      setSelectedCustomerData({});
      setProductQuantity({});
      setProductPriceType({});
      setIsLoading(false);

      Toast.show("Products submitted successfully!", { duration: Toast.durations.LONG });
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
      Toast.show("Failed to submit products.", { duration: Toast.durations.LONG });
    }
  } catch (error) {
    console.error("Error getting location:", error);
    Toast.show("Unable to get location.", { duration: Toast.durations.LONG });
  }
};


  const [cdata, setCData] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  // const [allCustomerFechted, setAllCustomerFetched] = useState(false);

  const fetchData = async () => {

    setIsLoading(true);
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await axios.get(
        `${BASE_URL()}${CUSTOMER_PAGINATION()}${page}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    
      const newData = response.data.data.customerListInPage;
      // if(newData.length){
        setCData((prevData) => [...prevData, ...newData]);
        setPage((prevPage) => prevPage + 1);
      // }else{
      //   setAllCustomerFetched(true);
      // }

    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
      const fetchProductData = async () => {
      try {
        const productList = await ProductService();
        //console.log("GOt product list ", JSON.stringify(productList));
        setProductList(productList.itemList);
        setProducts(productList.itemList);
      } catch (error) {
        console.log(error)
        console.error('Error fetching or processing data:', error);
      }
    }

    fetchData();//get customer record

    fetchProductData();

  }, []);

  const handleLoadMore = () => {
    if (!isLoading) {
      fetchData();
    }
  };

  const calculateTotal = (products) => {
    let total = 0;
    products.forEach((product) => {
      if (product.amount) {
        total += parseFloat(product.amount);

      }
    });
    return total.toFixed(2);
  };


  // console.log("Seach Query ", searchQuery, cdata)
  // console.log("After filter ", cdata.filter(function (x) {return x.custName.match(searchQuery) }))
  return (
    <View style={styles.container}>


      {/* top container */}
      {/* <View key={"topContainer"} style={styles.topContainer}>  */}
      {/* DropDown */}
      <View style={styles.dropdownContainer}>
        <Text style={styles.header}>Customer</Text>
        <View style={styles.rowDropdownContainer}>
          <View style={styles.columnDropdownContainer}>
            <TouchableOpacity style={styles.dropdownSelector} onPress={() => { setIsDropDownOpen(!isDropDownOpen); }}>
              <Text style={styles.Text}>{selectedCustomer}</Text>
              {isDropDownOpen ? <Icon name="up" size={20} /> : <Icon name="down" size={20} />}
            </TouchableOpacity>
          </View>


          <View style={styles.columnContainer}>
            <View style={styles.columnBtnContainer}>
              <Button onPress={openAddPopup} text={'New'} />
              <Modal visible={isAddPopupVisible} animationType="slide" transparent={true}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                  <TouchableOpacity onPress={closeAddPopup} style={{ marginTop: 10, marginLeft: '80%', backgroundColor: 'white', borderColor: 'red', borderWidth: 3, borderRadius: 30 }}>
                    <Icon name="close" size={20} color="red" />
                  </TouchableOpacity>
                  <View style={{ backgroundColor: 'white', borderRadius: 20, width: '80%', height: '50%', }}>

                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                      <Form isEdit={false} custCode={""} />
                      {/* navigation.navigate("Form"); */}
                    </ScrollView>

                  </View>
                </View>
              </Modal>
            </View>
          </View>

          {isCustomerSelected && (
            <View style={styles.columnContainer}>
              <View style={styles.columnBtnContainer}>
                <Button onPress={openEditPopup} text={'Edit'} style={styles.editbutton} />
                <Modal visible={isEditPopupVisible} animationType="slide" transparent={true}>
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <TouchableOpacity onPress={closeEditPopup} style={{ marginTop: 10, marginLeft: '80%', backgroundColor: 'white', borderColor: 'red', borderWidth: 3, borderRadius: 30 }}>
                      <Icon name="close" size={20} color="red" />
                    </TouchableOpacity>
                    <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 20, width: '80%', height: '50%' }}>

                      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                        <Form isEdit={true} custCode={selectedCustomerData.custCode} />
                      </ScrollView>
                    </View>

                  </View>
                </Modal>
              </View>
            </View>
          )}

        </View>
        <View style={isDropDownOpen ? styles.dropdownAreaOpen : styles.dropdownArea}>
          {isDropDownOpen ? <View >
            <TextInput ref={searchRef} placeholder='Search' style={styles.searchInput} onChangeText={(txt) => { setSearchQuery(txt); }} />
            <FlatList
                          data={cdata}
              // data={cdata.filter(function (x) {return x.custName.match(searchQuery) })}
              keyExtractor={(item) => item.custName}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity style={styles.ddownItems} onPress={() => {
                    setSelectedCustomer(item.custName);
                    setSelectedCustomerData(item);
                    onSearch('');
                    // setSearchQuery('');
                    setIsDropDownOpen(false);
                    setIsCustomerSelected(true);
                    searchRef.current.clear();
                  }}>
                    <Text>{item.custName}</Text>

                  </TouchableOpacity>
                );
              }}
              onEndReached={handleLoadMore}
              // onEndReached={ allCustomerFechted?undefined:handleLoadMore}
              onEndReachedThreshold={0.1}
              ListFooterComponent={
                isLoading ? <ActivityIndicator size="large" /> : null
              }
            />
          </View> : null}
        </View>
      </View>

      {/* Retail & WholeShale Button Container */}
      <View style={styles.orderTypeContainer}>
        <Button onPress={() => setProductPrice('retail')} 
        text={'Retail'} 
        style={[styles.orderTypeBtn, productPrice == 'retail' ? styles.orderTypeActiveBtn : null]}
         disabled={productPrice === 'retail'} />

        <Button onPress={() => setProductPrice('wholesale')} 
        text={'Wholesale'} 
        style={[styles.orderTypeBtn, productPrice == 'wholesale' ? styles.orderTypeActiveBtn : null]} 
        disabled={productPrice === 'wholesale'} />
      </View>
      {/* </View> */}
      <View style={styles.rowContainer}>

        <View style={styles.parallelContainer}>
          {/* First parallel container */}
          {/* Place your content here */}
          <ScrollView vertical>

            {productList.map((product, index) => (

              <View key={index} style={styles.productContainer}>
                <LinearGradient
                  colors={['#F0F2E4', '#D2DAC2']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.productContainer}
                >
                  <View style={styles.productBox}>
                    <LinearGradient
                      colors={['#2EAAFA', '#1F2F98']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.productBox}
                    >
                      <Text style={styles.productTitle}>{product.itmName}</Text>
                      {product.itemPriceList.map((price) =>
                        price.rateType === (productPrice === 'retail' ? 1 : 2) ? (
                          <Text key={price.rateType} style={styles.price}>
                            Price: ₹{price.itmPrice}
                          </Text>
                        ) : null,
                      )}
                    </LinearGradient>
                  </View>

                  {/* productQuantity */}
                  {
                    <TextInput
                      style={styles.quantityInput}
                      placeholder="Qty"
                      value={productQuantity[productList[index].itmCode]}
                      //value={productQuantity[product.itemDtlList.itmCode] || ''}
                      onChangeText={(text) => {

                        setProductQuantity(prevQuantities => ({
                          ...prevQuantities,
                          [productList[index].itmCode]: text
                        }));

                        setProductPriceType(prevPriceType => ({
                          ...prevPriceType, [productList[index].itmCode]: (productPrice === 'retail' ? 1 : 2)
                        }))
                        // console.log(productQuantity);
                      }}
                      keyboardType="numeric"
                    />
                  }
                </LinearGradient>
              </View>

            ))}
          </ScrollView>

        </View>
        <View style={styles.parallelContainer}>
          {/* Second parallel container */}
          <ScrollView horizontal>
            <ScrollView vertical>
            <View style={styles.table}>
              {/* Table column headers */}
              <View style={styles.columnHeaderContainer}>
                <Text style={[styles.columnHeader, { width: 60 }]}>Product</Text>
                <Text style={[styles.columnHeader, { width: 33 }]}>Qty</Text>
                <Text style={[styles.columnHeader, { width: 44 }]}>Rate</Text>
                <Text style={[styles.columnHeader, { width: 42 }]}>Amt</Text>
              </View>

              {/* Table rows */}
              {/* Table rows */}
              {/* Render rows based on entered data */}
              {products.map((product, index) => {
                //let itmCode = product.itemDtlList.itmCode;
                let itmCode = productList[index].itmCode;
                //let qty = productQuantity||0;
                let qty = productQuantity[itmCode] || 0;
                // console.log(qty);
                if (productQuantity?.hasOwnProperty(itmCode)) {
                  qty = productQuantity[itmCode];
                }
                let priceType = productPriceType[itmCode]
                // console.log("HEre ",  priceType);
                let unitPrice = priceType !== undefined ? product.itemPriceList[priceType - 1].itmPrice : 0;
                let priceTypeStr = priceType === 1 ? 'R' : "W";
                unitPrice = unitPrice
                //let amount = unitPrice * qty;
                product.amount = (unitPrice * qty).toFixed(2);
                // Display the row only if the product quantity is filled
                if (qty > 0) {

                  // console.log(product.itmName);
                  // console.log(qty);
                  // console.log(unitPrice);
                  // setSelectedPriceType(priceTypeStr==='R'?1:2);

                  //  console.log("setSelectedPriceType====>",setSelectedPriceType);
                  let unitPriceDisplay = unitPrice ? unitPrice + " " + priceTypeStr + " " : '';
                  return (
                    <View key={index} style={styles.tableRow}>
                      <Text style={[styles.cell, { width: 60 }]}>{product.itmName || ''}</Text>
                      <Text style={[styles.cell, { width: 33 }]}>{qty}</Text>
                      <Text style={[styles.cell, { width: 44 }]}>{unitPriceDisplay}</Text>
                      <Text style={[styles.cell, { width: 42 }]}>{product.amount || ''}</Text>
                    </View>
                  );
                } else {
                  return null; // Skip rendering the row if quantity is not filled
                }
              })}
            </View>
            </ScrollView>
          </ScrollView>

          <View style={styles.bottomBlock}>
            <Text style={styles.totalLabel}>Total: {calculateTotal(products)} INR</Text>
          </View>
        </View>

      </View>
      <View style={styles.submitBtnContainer}>
      {isLoading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : (
          <Button onPress={handleSubmit} text={'Submit'} style={styles.newbutton} />
        )}
        {showInvoiceViewer && pdfData && <InvoiceViewer pdfData={pdfData} />}
      </View>
      
    </View>
  )
}

export default SalesScreen
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({

  bottomBlock: {
    borderColor: 'grey',
    borderWidth: 1,
    width: '100%',
    padding: 10,
    marginTop: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  taxLabel: {
    textAlign: 'right',
    borderBottomColor: '#E8E8E8',
    borderBottomWidth: 1,
    width: '100%',
    fontSize: 13,
    fontWeight: 'bold',
    color: 'gray',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },

  price: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'left',
    marginTop: 15,
    paddingLeft: 6,
  },

  table: {
    margin: 3,
  },
  columnHeaderContainer: {
    flexDirection: 'row',
  },
  columnHeader: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'grey',
    paddingVertical: 10,
    paddingHorizontal: 5,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black'
  },
  tableRow: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    textAlign: 'center',
    fontSize: 11,
    color: 'black',
  },

  productBoxContainer: {
    elevation: 2, // Apply elevation to this wrapping View
    width: '100%',
    borderRadius: 5,
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 5,
    width: '100%',
  },
  productBox: {
    width: '80%',
    height: 90,
    justifyContent: 'center',
    borderRadius: 5,
  },
  productTitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
  },
  quantityInput: {
    backgroundColor: '#fff',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#84889a',
    padding: 5,
    width: '25%',
    borderRadius: 5,
    color: 'black',
    marginLeft: '-7%'
  },
  container: {
    flex: 1,
  },
  header: {
    fontSize: 19,
    fontWeight: '800',
    marginTop: windowHeight * 0.02,
    marginLeft: windowWidth * 0.02,
    color: '#9E9EFF',
  },
  rowDropdownContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: windowHeight * 0.002,
    width: windowWidth * 0.95,
  },

  columnDropdownContainer: {
    alignSelf: 'flex-start',
  },
  Text: {
    color: 'blue',
  },
  dropdownSelector: {
    width: windowWidth * 0.60,
    height: windowHeight * 0.04,
    borderRadius: windowWidth * 0.01,
    borderWidth: 1,
    borderColor: '#8E8EAD',
    backgroundColor: '#fff',
    marginTop: windowHeight * 0.002,
    marginLeft: windowWidth * 0.02,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: windowWidth * 0.03,
    paddingRight: windowWidth * 0.03,
    color: 'grey'
  },
  topContainer: {
    width: windowWidth * 0.95,
    alignSelf: 'center',
    // color:'grey',
    // flexDirection: 'row',
  },

  dropdownContainer: {
    width: windowWidth * 0.95,
    // height: windowHeight * 0.15,
    height: windowHeight * 0.08,
    alignSelf: 'center',
    borderRadius: windowWidth * 0.1,
    color: 'grey',
    zIndex: 5,
    // backgroundColor: 'blue',
  },


  dropdownArea: {
    width: 0,
    height: 0, //0.2
    borderBottomLeftRadius: windowWidth * 0.01,
    borderBottomRightRadius: windowWidth * 0.01,
    marginLeft: windowWidth * 0.02,
    backgroundColor: '#fff',
    elevation: 5,
    position: 'absolute',
    top: windowHeight * 0.100,
    left: 0,
    right: 0,
    bottom: 0,
    // backgroundColor: 'red',
    // zIndex:10
  },
  dropdownAreaOpen: {
    width: windowWidth * 0.60,
    height: windowHeight * 0.2, //0.2
    borderBottomLeftRadius: windowWidth * 0.01,
    borderBottomRightRadius: windowWidth * 0.01,
    marginLeft: windowWidth * 0.02,
    backgroundColor: '#fff',
    elevation: 5,
    position: 'absolute',
    top: windowHeight * 0.100,
    left: 0,
    right: 0,
    bottom: 0,
    color: 'grey',
    // zIndex:10
  },
  searchInput: {
    width: '100%',
    height: windowHeight / 3 - windowHeight,
    fontSize: 12,
    borderBottomLeftRadius: windowWidth * 0.01,
    borderBottomRightRadius: windowWidth * 0.01,
    borderEndWidth: 1,
    alignSelf: 'auto',
    elevation: 2,
    color: 'blue',
  },
  ddownItems: {
    width: windowWidth * 0.95,
    height: windowHeight * 0.05,
    borderBottomWidth: 0.2,
    borderBottomColor: '#8e8e8e',
    backgroundColor: '#fff',
    justifyContent: 'center',
    color: 'grey',
    zIndex: 4
  },
  rowContainer: {
    flex: 1,
    width: windowWidth * 0.97,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    // top: windowHeight * -0.06,
    // top: windowHeight * 0,
    // zIndex:1
  },
  parallelContainer: {
    flex: 1,
    height:'95%',
    borderColor: '#8E8EAD',
    borderWidth: 1,
    backgroundColor: '#fff',
    borderRadius: windowWidth * 0.02,
    marginBottom: windowHeight * 0.01,
    marginHorizontal: windowWidth * 0.01,
    flexDirection: 'column',
    alignItems: 'center',
    // marginTop: 15,
    marginTop: windowHeight * 0.02,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6.27,
  },
  submitBtnContainer: {
    // marginBottom:-10,
    marginBottom: windowHeight * 0.001,
    marginLeft: windowWidth / 1.5,
    width: windowWidth / 3,
  },
  columnBtnContainer: {
    width: windowWidth * .15,
    height: windowHeight / 1 - windowHeight,
    marginLeft: 10,
  },

  orderTypeContainer: {
    width: '100%',
    height: 30,
    //marginTop: windowHeight * 0.02,
    // marginTop: 40,
    marginTop: windowHeight * 0.04,
    // backgroundColor: 'blue',
    //top:windowHeight * 0.02, 
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    // justifyContent: 'space-between',

  },

  shape: {
    width: windowWidth * .49,

  },
  orderTypeBtn: {
    // marginLeft: 45,
    // marginRight: 115,
    marginLeft: windowWidth * 0.03,
    marginRight: windowWidth * 0.02,
    marginBottom: 0,
    width: windowWidth * 0.19,

  },
  orderTypeActiveBtn: {
    backgroundColor: 'gray',
  },

});
