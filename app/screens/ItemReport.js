import React, { useState } from 'react';
import { View, Text,  ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../app-widget/button';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import { Table, Row, Rows } from 'react-native-table-component';
import { Buffer } from 'buffer';
import Toast from 'react-native-root-toast'
import {fetchItemData,exportItemData} from '../service/ItemService'
const STORAGE_KEY = 'userAndDate';

const ItemReport = () => {
  const [reportData, setReportData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isShareButtonEnabled, setIsShareButtonEnabled] = useState(false);
  const [count, setCount] = useState(0);


  const getAccessToken = async (page) => {  
    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      console.log("Report getAccessToken", storedData);
      if (storedData) {
        const userData = JSON.parse(storedData);
        console.log("Report getAccessToken userData", userData);
        setCurrentPage(page);
        fetchDataForPage(page,userData);
      } else {
        console.log('No data found in AsyncStorage.');
        Toast.show("Please Select User!", {duration:Toast.durations.LONG});
      }
    } catch (error) {
      console.error('Error retrieving data from AsyncStorage:', error);
    }
  };

  const fetchDataForPage = async (page,userVal) => {
    if (isLoading || !userVal || !userVal.selectedUser || !userVal.selectedDate) {
      return;
    }
  
    setIsLoading(true);
  
    try {
      console.log('fetchDataForPage', userVal?.selectedDate);
      const formattedDate = formatDateToDdMmYyyy(userVal.selectedDate);
      console.log(page);
      const data = await fetchItemData(
        userVal.selectedUser.itemVal,
        formattedDate,
        page
      );
      setCount(data.data.data.count);
      console.log("total no. of record:",JSON.stringify(data.data.data.itemsReportList));
      if (Array.isArray(data.data.data.itemsReportList)) {
        if (data.data.data.itemsReportList.length === 0) {
          // If billsReportList is empty, show a toast message
          Toast.show("No item found!", { duration: Toast.durations.LONG });
        } else {
          setReportData((prevData) => [...prevData, ...data.data.data.itemsReportList]);
          setIsShareButtonEnabled(true);
        }
      } else {
        console.error('Invalid data received:', data);
        Toast.show("No item found!", {duration:Toast.durations.LONG});
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const renderTable = () => {
    if (reportData.length === 0) {
      return null;
    }

    const tableHead = ['Item Code', 'Item Quantity', 'Total Amount', 'Rate Type'];
    const tableData = reportData.map((item) => [
      item.itmName,
      item.itmQty.toString(),
      item.totalAmt.toFixed(2),
      item.rateType === 1 ? 'Wholesale' : 'Retail',
    ]);

    return (
      <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
      <Row
        data={tableHead}
        style={styles.head}
        textStyle={styles.headerText} // Fixed: Use an object for textStyle
      />
      <Rows data={tableData} textStyle={styles.text} />
    </Table>
    );
  };

  const formatDateToDdMmYyyy = (date) => {
    if (typeof date === 'string') {
      const dateObj = new Date(date);
      const dd = String(dateObj.getDate()).padStart(2, '0');
      const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
      const yyyy = dateObj.getFullYear();

      return `${dd}-${mm}-${yyyy}`;
    } else {
      console.error('Invalid date object:', date);
      return '';
    }
  };


  const handleShare = async () => {
    if (reportData.length === 0) {
      // Don't attempt to download if there's no data
      return;
    }

    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      const userData = JSON.parse(storedData);
      const formattedDate = formatDateToDdMmYyyy(userData.selectedDate);
      const userId = userData.selectedUser.itemVal;
      const  {data}  = await exportItemData(userId,formattedDate);
      console.log("Received Data:", data.data);
      if (data) {
        const tempDir = RNFS.DocumentDirectoryPath;
        const fileName = `ItemReports_${new Date().getTime()}.xlsx`;
        const filePath = `${tempDir}/${fileName}`;
  
        // Convert ArrayBuffer to base64
        const base64Data = Buffer.from(data).toString('base64');
  
        // Save the base64 encoded Excel data to the file
        await RNFS.writeFile(filePath, base64Data, 'base64');
        const shareOptions = {
          title: 'Share Excel File',
          url: `file://${filePath}`, // Note the "file://" prefix
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      };
      
      await Share.open(shareOptions);
  } else {
      throw new Error('Received empty response data');
  }
} catch (error) {
  console.error('Error fetching, saving, or sharing data:', error);
  throw error;
}
    
  };

  const handlePrevPage = () => {
    console.log(currentPage);
    if (currentPage>1) {
      setReportData([]); 
      getAccessToken(currentPage-1);
    }
    else{
      Toast.show("This is First record!", {duration:Toast.durations.LONG});

    }
  };

  const handleNextPage = async () => {
    console.log('next...',reportData.length);
    if(currentPage>count){
      const nextPage = currentPage + 1;
      setReportData([]);
      getAccessToken(nextPage);
     
    }else{
      Toast.show("No more record found!", {duration:Toast.durations.LONG});
    }
      
   
  };

  return (
    <View style={styles.container}>
      
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      )}
      {renderTable()}
      {reportData.length !== 0 && ( // Conditionally render pagination buttons
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={styles.paginationButton}
          onPress={handlePrevPage}
        >
          <Text style={styles.paginationButtonText}>{"<<"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.paginationButton}
          onPress={handleNextPage}
          disabled={!isShareButtonEnabled} // You can enable/disable this button based on your logic
        >
          <Text style={styles.paginationButtonText}>{">>"}</Text>
        </TouchableOpacity>
      </View>
    )}
      <View style={{ flex: 1 }} /> 
      <View style={styles.buttonContainer}>
        <Button
          style={styles.submitButton}
          onPress={() => {
            setReportData([]);
            // setCurrentPage(1); 
            getAccessToken(1);
          }}
          text="Show Items"
        />
        <Button
          style={styles.submitButton}
          text="Share"
          onPress={() => {
            handleShare();
          }}
          disabled={!isShareButtonEnabled}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  paginationButton: {
    backgroundColor: '#5D9C59',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    margin: 5,
  },
  paginationButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  head: { 
    height: 40,
    backgroundColor: '#f1f8ff' ,
    borderColor:'blue',
    border:'solid'
  },
  text: { 
    margin: 6,
     textAlign: 'center'
     },
  headerText: { 
    fontWeight: 'bold', 
    color: 'blue',
    textAlign:'center' 
  },
  buttonContainer: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  submitButton: {
    width: '100%',
    height: 40,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  card: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});

export default ItemReport