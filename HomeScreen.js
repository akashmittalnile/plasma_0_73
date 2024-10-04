import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StripeProvider } from '@stripe/stripe-react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import LinearGradient from 'react-native-linear-gradient';
// Define your screens (components)
export default function HomeScreen({ navigation }) {

    const [cardDetails, setCardDetails] = useState(null);


  
    const { createToken } = useStripe();


    return (
      <LinearGradient  colors={['#4c669f', '#3b5998', '#192f6a']} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Home Screen</Text>
        <Button title='Navigate' onPress={() => {
          navigation.navigate('Details', { itemId: 42 });
        }} />
        <CardField
                        postalCodeEnabled={true}
                        placeholder={{
                          number: '4242 4242 4242 4242',
                        }}
                        cardStyle={{
                          backgroundColor: '#FFFFFF',
                          textColor: '#000000',
                        }}
                        style={{
                          width: '100%',
                          height: 80,
                          marginVertical: 30,
                        }}
                        onCardChange={(cardDetails) => {
                          setCardDetails(cardDetails);
                        }}
                        onFocus={(focusedField) => {
                          console.log('focusField', focusedField);
                        }}
                      />
      </LinearGradient>
    );
  }