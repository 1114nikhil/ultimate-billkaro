import AsyncStorage from '@react-native-async-storage/async-storage';
import { Buffer } from 'buffer';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Button from '../app-widget/button';
import { exportReportData, fetchReportData } from '../service/ReportService';

import Toast from 'react-native-root-toast';

const STORAGE_KEY = 'userAndDate';

const Report = () => {
  const [reportData, setReportData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isShareButtonEnabled, setIsShareButtonEnabled] = useState(false);
  const [count, setCount] = useState(0);

  const getAccessToken = async page => {
    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      // console.log("Report getAccessToken", storedData);
      if (storedData) {
        const userData = JSON.parse(storedData);
        setCurrentPage(page);
        fetchDataForPage(page, userData);
      } else {
        // console.log('No data found in AsyncStorage.');
        Toast.show('Please Select User!', {duration: Toast.durations.LONG});
      }
    } catch (error) {
      console.error('Error retrieving data from AsyncStorage:', error);
    }
  };

  const fetchDataForPage = async (page, userVal) => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      if (userVal.selectedUser && userVal.selectedDate) {
        // console.log('fetchDataForPage', userVal?.selectedDate);
        const formattedDate = formatDateToDdMmYyyy(userVal.selectedDate);
        // If fetching the first page, clear the old reportData
        if (page === 1) {
          setReportData([]);
        }
        const data = await fetchReportData(
          userVal.selectedUser.itemVal,
          formattedDate,
          page,
        );
        setCount(data.data.data.count);
        // console.log('fetchDataForPage data', data);
        if (Array.isArray(data.data.data.billsReportList)) {
          if (data.data.data.billsReportList.length === 0) {
            // If billsReportList is empty, show a toast message
            Toast.show('No record found!', {duration: Toast.durations.LONG});
          } else {
            setReportData(prevData => [
              ...prevData,
              ...data.data.data.billsReportList,
            ]);
            setIsShareButtonEnabled(true);
          }
        } else {
          // console.error('Invalid data received:', data);
          Toast.show('No record found!', {duration: Toast.durations.LONG});
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCardItem = ({item}) => (
    <TouchableOpacity style={styles.card}>
      <ScrollView>
        <View style={styles.cardContent}>
          <View style={styles.cardRow}>
            {renderLabelValue('Bill Number:', item.billNo)}
            {renderLabelValue('Order Date:', item.orderDate)}
          </View>
          <View style={styles.cardRow}>
            {renderLabelValue('Customer Name:', item.custName)}
            {renderLabelValue('Amount:', item.totalAmt)}
          </View>
          <View style={styles.cardRow}>
            {renderLabelValue('Longitude:', item.longitudeX)}
            {renderLabelValue('Latitude:', item.latitudeY)}
          </View>
        </View>
      </ScrollView>
    </TouchableOpacity>
  );

  const renderLabelValue = (label, value) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </>
  );

  const formatDateToDdMmYyyy = date => {
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
  const writeLogToFile = async (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${message}\n`;

  const logFilePath = FileSystem.documentDirectory + 'app_log.txt';

  try {
    const fileInfo = await FileSystem.getInfoAsync(logFilePath);

    if (!fileInfo.exists) {
      await FileSystem.writeAsStringAsync(logFilePath, logMessage, {
        encoding: FileSystem.EncodingType.UTF8,
      });
    } else {
      const existingLogs = await FileSystem.readAsStringAsync(logFilePath, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      await FileSystem.writeAsStringAsync(logFilePath, existingLogs + logMessage, {
        encoding: FileSystem.EncodingType.UTF8,
      });
    }

    console.log('Log written to:', logFilePath);
  } catch (err) {
    console.error('Error writing to log file:', err);
  }
};


  const handleShare = async () => {
  if (reportData.length === 0) return;

  try {
    const storedData = await AsyncStorage.getItem(STORAGE_KEY);
    const userData = JSON.parse(storedData);
    const formattedDate = formatDateToDdMmYyyy(userData.selectedDate);
    const userId = userData.selectedUser.itemVal;

    const { data } = await exportReportData(userId, formattedDate);
    console.log('Received Data:', data.data);

    if (data) {
      const tempDir = FileSystem.documentDirectory;
      const fileName = `OrderReports_${Date.now()}.xlsx`;
      const filePath = `${tempDir}${fileName}`;

      // Save as base64
      const base64Data = Buffer.from(data).toString('base64');
      await FileSystem.writeAsStringAsync(filePath, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // ✅ Share file using Expo Sharing
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(filePath, {
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          dialogTitle: 'Share Excel Report',
        });
      } else {
        console.warn('Sharing not available on this device.');
      }
    } else {
      throw new Error('Received empty response data');
    }
  } catch (error) {
    console.error('Error fetching, saving, or sharing data:', error);
  }
};


  const handlePrevPage = () => {
    console.log(currentPage);
    if (currentPage > 1) {
      setReportData([]);
      getAccessToken(currentPage - 1);
    } else {
      Toast.show('This is First record!', {duration: Toast.durations.LONG});
    }
  };

  const handleNextPage = async () => {
    console.log('next...', currentPage);

    if (currentPage > count) {
      const nextPage = currentPage + 1;
      setReportData([]);
      getAccessToken(nextPage);
    }
    Toast.show('No more record found!', {duration: Toast.durations.LONG});
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={reportData}
        renderItem={renderCardItem}
        keyExtractor={item => item.billNo.toString()}
      />

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      )}
      {reportData.length !== 0 && ( // Conditionally render pagination buttons
        <View style={styles.paginationContainer}>
          <TouchableOpacity
            style={styles.paginationButton}
            onPress={handlePrevPage}>
            <Text style={styles.paginationButtonText}>{'<<'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.paginationButton}
            onPress={handleNextPage}
            disabled={!isShareButtonEnabled} // You can enable/disable this button based on your logic
          >
            <Text style={styles.paginationButtonText}>{'>>'}</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.buttonContainer}>
        <Button
          style={styles.submitButton}
          onPress={() => {
            setReportData([]);
            getAccessToken(1);
          }}
          text="Show Report"
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
    alignItems: 'center', // Align the buttons horizontally
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
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    // justifyContent: 'space-between',
    backgroundColor: '#fff', // Background color for the card
    borderRadius: 8, // Adjust the radius for the 3D effect
    marginVertical: 8, // Spacing between each card
    elevation: 10, // Android elevation for the shadow effect
    shadowColor: 'rgba(115, 147, 179, 2)', // Shadow color
    shadowOffset: {width: 0, height: 2}, // Shadow offset
    shadowOpacity: 1, // Shadow opacity
    shadowRadius: 8, // Shadow radius
  },
  cardContent: {
    flex: 1,
    flexDirection: 'column',
    textAlign: 'center',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4, // Spacing between each row within the card
  },
  // column: {
  //   flex: 1,
  // },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    // marginBottom: 4,
  },
  value: {
    fontSize: 12,
    // marginBottom: 10,
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

export default Report;
