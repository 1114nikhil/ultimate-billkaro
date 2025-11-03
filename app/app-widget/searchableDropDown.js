// import React, { useState } from 'react';
// import { View, Text,ScrollView } from 'react-native';
// import SearchableDropdown from 'react-native-searchable-dropdown';

// const SearchableDropDown = ({ data, itemKey, onSelect, onInputChange }) => {
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [suggestions, setSuggestions] = useState([]);

//   const handleItemSelect = (item) => {
//     setSelectedItem(item);
//     onSelect(item);
//   };

//   const handleTextChange = (text) => {
//     console.log(text); // Handle the text change event here

//     // Filter the options based on the entered text for suggestions
//     const filteredOptions = data.filter((option) =>
//       option[itemKey].toLowerCase().includes(text.toLowerCase())
//     );

//     setSuggestions(filteredOptions); // Update the suggestions state
//     onInputChange(text);
//   };

//   return (
//     <View>
//       <Text style={{ color: 'green' ,fontSize:18,marginTop:10}}>Name: {selectedItem ? selectedItem[itemKey] : 'None'}</Text>
//       <ScrollView style={{ maxHeight: 140 }}>
//       <SearchableDropdown
//         onItemSelect={handleItemSelect}
//         onTextChange={handleTextChange} // Pass the handleTextChange function
//         containerStyle={{ padding: 5 }}
//         textInputStyle={{
//           padding: 12,
//           borderWidth: 1,
//           borderColor: '#0000FF',
//           borderRadius: 5,
//         }}
//         itemStyle={{
//           padding: 10,
//           marginTop: 2,
//           backgroundColor: '#ddd',
//           borderColor: '#bbb',
//           borderWidth: 1,
//           borderRadius: 5,
//         }}
//         itemTextStyle={{ color: '#0000FF'
//     }}
//         itemsContainerStyle={{ maxHeight: 140 }}
//         items={suggestions} // Pass the suggestions as items
//         defaultIndex={0}
//         placeholder="Select an option"
//         resetValue={false}
//         underlineColorAndroid="transparent"
//       />
//       </ScrollView>
//     </View>
//   );
// };

// export default SearchableDropDown;

import React, { useState } from 'react';
import { View, Text } from 'react-native';
import SearchableDropdown from 'react-native-searchable-dropdown';

const SearchableDropDown = ({ data, itemKey, onSelect, onInputChange }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const handleItemSelect = (item) => {
    setSelectedItem(item);
    if (onSelect) onSelect(item);
  };

  const handleTextChange = (text) => {
    console.log(text);

    // Filter the options based on the entered text
    const filteredOptions = data.filter((option) =>
      option[itemKey].toLowerCase().includes(text.toLowerCase())
    );

    setSuggestions(filteredOptions);
    if (onInputChange) onInputChange(text);
  };

  return (
    <View>
      <Text style={{ color: 'green', fontSize: 18, marginTop: 10 }}>
        Name: {selectedItem ? selectedItem[itemKey] : 'None'}
      </Text>

      <SearchableDropdown
        onItemSelect={handleItemSelect}
        onTextChange={handleTextChange}
        containerStyle={{ padding: 5 }}
        textInputStyle={{
          padding: 12,
          borderWidth: 1,
          borderColor: '#0000FF',
          borderRadius: 5,
        }}
        itemStyle={{
          padding: 10,
          marginTop: 2,
          backgroundColor: '#ddd',
          borderColor: '#bbb',
          borderWidth: 1,
          borderRadius: 5,
        }}
        itemTextStyle={{ color: '#0000FF' }}
        itemsContainerStyle={{
          maxHeight: 300, // 👈 Increased scroll area
        }}
        items={suggestions}
        defaultIndex={0}
        placeholder="Select an option"
        resetValue={false}
        underlineColorAndroid="transparent"
      />
    </View>
  );
};

export default SearchableDropDown;