import { View, Text } from 'react-native'
import React from 'react'

const BillingScreen = ({route}) => {
    const { customer, products } = route.params;
    return (
        <View>
          <Text>Customer: {customer}</Text>
          {/* Display the product data */}
          {products.map((product, index) => (
            <Text key={index}>
              Product {index + 1}: {product.name} - {product.quantity}
            </Text>
          ))}
        </View>
      )
}

export default BillingScreen