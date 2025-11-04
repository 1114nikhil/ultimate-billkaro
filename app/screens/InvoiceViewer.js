import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { WebView } from 'react-native-webview';

const InvoiceViewer = ({ pdfData }) => {
  const [pdfUri, setPdfUri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(true);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        const fileUri = FileSystem.documentDirectory + 'invoice.pdf';
        await FileSystem.writeAsStringAsync(fileUri, pdfData, {
          encoding: FileSystem.EncodingType.Base64,
        });
        setPdfUri(fileUri);
      } catch (error) {
        console.error('Error loading PDF:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPdf();
  }, [pdfData]);

  const handleShare = async () => {
    if (pdfUri && (await Sharing.isAvailableAsync())) {
      await Sharing.shareAsync(pdfUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share Invoice PDF',
      });
    }
  };

  const handlePrint = async () => {
    if (pdfUri) await Print.printAsync({ uri: pdfUri });
  };

  const closeModal = async () => {
    setModalVisible(false);
    if (pdfUri) await FileSystem.deleteAsync(pdfUri, { idempotent: true });
  };

  return (
    <Modal visible={modalVisible} animationType="slide">
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
        <TouchableOpacity onPress={closeModal} style={{ marginRight: 'auto' }}>
          <Icon name="arrow-left" size={28} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare} style={{ marginHorizontal: 20 }}>
          <Icon name="share" size={28} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePrint}>
          <Icon name="print" size={28} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : pdfUri ? (
        <WebView
          style={{
            flex: 1,
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
          }}
          originWhitelist={['*']}
          source={{ uri: pdfUri }}
        />
      ) : (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>Failed to load PDF.</Text>
      )}
    </Modal>
  );
};

export default InvoiceViewer;
