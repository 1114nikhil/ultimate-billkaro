import RNPrint from 'expo-print'; // Import the react-native-print library
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RNFS from 'react-native-fs';
import Pdf from 'react-native-pdf';
import Share from 'react-native-share';

import Icon from 'react-native-vector-icons/FontAwesome';

const InvoiceViewer = ({ pdfData }) => {
  const [pdfSource, setPdfSource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(true);

  useEffect(() => {
    const fetchInvoicePDF = async () => {
      try {
        const localDir = RNFS.DocumentDirectoryPath;
        const pdfName = 'invoice.pdf';
        const pdfPath = `${localDir}/${pdfName}`;

        await RNFS.writeFile(pdfPath, pdfData, 'base64');
        const fileExists = await RNFS.exists(pdfPath);

        if (fileExists) {
          setPdfSource({ uri: pdfPath, cache: true });
        } else {
          console.error('PDF file does not exist.');
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching PDF:', error);
        setLoading(false);
      }
    };

    fetchInvoicePDF();
  }, [pdfData]);

  const handleShare = async () => {
    if (pdfSource && pdfSource.uri) {
      try {
        const sourcePath = pdfSource.uri;
        const destinationPath = `${RNFS.DocumentDirectoryPath}/invoice.pdf`;
    
        await RNFS.copyFile(sourcePath, destinationPath);
    
        const options = {
          url: `file://${destinationPath}`,
          type: 'application/pdf', // Specify the MIME type of the attachment
          title: 'Share PDF',
          message: 'Sharing PDF file with attachment',
          failOnCancel: false, // Allow the user to cancel the share action
          // You can specify more options as needed
        };
    
        const result = await Share.open(options);
    
        if (result.app !== undefined) {
          // The share was successful
          console.log(`Shared via ${result.app}`);
        } else {
          // The share was dismissed or failed
          console.log('Share action dismissed or failed.');
        }
      } catch (error) {
        console.error('Error sharing PDF:', error);
      }
    }
  };
  // Function to delete the PDF file
  const deletePDF = async () => {
    if (pdfSource && pdfSource.uri) {
      try {
        const pdfPath = pdfSource.uri;
        await RNFS.unlink(pdfPath);
        console.log('PDF file deleted');
      } catch (error) {
        console.error('Error deleting PDF file:', error);
      }
    }
  };
  const closeModal = () => {
    setModalVisible(false); // Set modal visibility to false to close the modal
    deletePDF();
    console.log("closeModal");
  };
  const handlePrint = async () => {
    if (pdfSource && pdfSource.uri) {
      try {
        const result = await RNPrint.print({
          filePath: pdfSource.uri,
        });
  
        if (result) {
          console.log('Printed successfully:', result);
        } else {
          console.warn('Printing was canceled or failed.');
        }
      } catch (error) {
        console.error('Error printing PDF:', error);
      }
    }
  };

  return (
    <Modal style={{ flex: 1, width: '100%', height: '100%' }}visible={modalVisible}r>
     <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={closeModal} style={{ marginRight: '70%' }}>
          <Icon name="arrow-left" size={30} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare} style={{ marginRight: 20 }}>
          <Icon name="share" size={30} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePrint}>
          <Icon name="print" size={30} />
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : pdfSource && pdfSource.uri ? (
        <Pdf
          style={{
            flex: 1,
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
          }}
          source={pdfSource}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onError={(error) => console.error('PDF load error:', error)}
        />
      ) : (
        <Text>PDF source is null.</Text>
      )}
    </Modal>
  );
};

export default InvoiceViewer;