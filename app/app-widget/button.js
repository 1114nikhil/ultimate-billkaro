import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import React from 'react'

const Button = ({ onPress, text, style, disabled=false }) => {
  return (
    <TouchableOpacity style={[inlineStyles.Button, style]} onPress={onPress} disabled={disabled}>
      <Text style={inlineStyles.ButtonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const inlineStyles = StyleSheet.create({
  Button: {
    alignSelf: 'flex-end',

    width: '100%',
    height: 30,
    right: '10%',
    marginBottom: '10%',
    justifyContent: 'center',
    backgroundColor: '#5D9C59', // Green logo color

    alignItems: 'center',
    borderRadius: 5,

  },
  ButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF', // White login button text color
  },
});

export default Button