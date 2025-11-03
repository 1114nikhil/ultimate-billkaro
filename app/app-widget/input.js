import { StyleSheet,TextInput } from 'react-native'
import React, { useRef, useEffect } from 'react';

const Input = ({ placeholder, secureTextEntry, onChangeText, value, isFocused, required, disabled, invalidInput=false }) => {
  const inputRef = useRef(null);

  // useEffect(() => {
  //   if (isFocused && inputRef.current) {
  //     inputRef.current.focus();
  //   }
  // }, [isFocused]);

  // const borderColor = required ? 'red' : '#0000FF';

    return (
      <TextInput
        style={[styles.input, { borderColor: invalidInput ? '#FF0000' : '#0000FF' }]} //borderColor
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        value={value}
        editable={!disabled}
        ref={inputRef}
      />
    );
  };

  const styles=StyleSheet.create({
   
      input: {
        height: 40,
        width:'100%',
        backgroundColor:'#FFFFFF',
        borderColor: '#0000FF', // Blue input border color
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius:5,
        color:'#0000FF',
        
      },
      
  });

export default Input