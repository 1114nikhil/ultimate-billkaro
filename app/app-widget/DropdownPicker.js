import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableWithoutFeedback, 
} from 'react-native';

const DropdownPicker = ({
  data,
  placeholder,
  onSelect,
  renderItem,
  isLoading,
  loadMoreData,
  onDropdownScroll, // Add this prop
}) => {
  const [searchText, setSearchText] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownCloseTimeout = useRef(null);

  const filterDropdownData = () => {
    return data.filter(item =>
      item.itemLbl.toLowerCase().includes(searchText.toLowerCase()),
    );
  };

  const selectDropdownItem = (itemLbl, itemVal) => {
    setSelectedItem({itemLbl, itemVal});
    onSelect({itemLbl, itemVal});
    setSearchText(itemLbl);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const renderDropdownItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => selectDropdownItem(item.itemLbl, item.itemVal)}
        style={styles.dropdownItem}>
        {renderItem ? renderItem(item) : <Text>{item.itemLbl}</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={searchText}
        onChangeText={text => setSearchText(text)}
        onFocus={toggleDropdown}
        blurOnSubmit={false} 
      />

      <View style={styles.dropdownContainer}>
        {isDropdownOpen && (
          <FlatList
            data={filterDropdownData()}
            renderItem={renderDropdownItem}
            keyExtractor={(item, index) => `${item.itemVal}_${index}`}
            style={styles.dropdown}
            onEndReached={loadMoreData}
            onEndReachedThreshold={0.01} // Update this threshold
            onScroll={onDropdownScroll}
            scrollEventThrottle={16} 
          />
        )}
      </View>
     
      {isLoading && <ActivityIndicator />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    height: 40,
    width: '100%',
    left:'12%',
    backgroundColor: '#FFFFFF',
    borderColor: '#0000FF',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: '#0000FF',
  },
  dropdownContainer: {
    position: 'absolute',
    height:100,
    top:40,
    width: '100%',
    left: '12%',
    borderRadius: 5,
    maxHeight: 200, // Add a max height to make it scrollable
    overflow: 'scroll',
  },
  dropdown: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: 'gray',
    borderTopWidth: 0,
    backgroundColor: 'white',
  },
  dropdownItem: {
    elevation:1,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
});

export default DropdownPicker;
