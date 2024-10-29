import React from 'react';
import {View, Image, Text, StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native';
import MyButtons from '../../component/MyButtons';
import {Mycolors} from '../../utility/Mycolors';
import { FONTFAMILY } from '../../utility/fonts';
import { triggerNotification } from '../../utility/notification';

const Welcome = props => {
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          backgroundColor: '#000',
          flex: 1,
          justifyContent: 'flex-end',
          alignItems: 'center',
          bottom:50

        }}>
        <View style={{height: 60, width: '78%', marginHorizontal: 20}}>
          <Image
            resizeMode="contain"
            source={require('../../assets/Plasmapen_icon.png')}
            style={{height: '100%', width: '100%'}}
          />
        </View>
        <View style={styles.box}>
          <View style={{marginVertical: 20}}>
            <Text
              style={{
                color: '#fff',
                fontSize: 20,
                fontWeight: '500',
                textAlign: 'center', fontFamily:FONTFAMILY
              }}>
              Introducing a New Era in Plasma Technology – The CoolJet™
            </Text>
          </View>

          <Text
            style={{
              color: '#fff',
              fontSize: 16,
              fontWeight: '500',
              textAlign: 'center', fontFamily:FONTFAMILY
            }}>
            CoolJet™ Cold Plasma is a professional treatment that utilizes
            Plasma Shower technology. By converting the main gases in the air
            (Oxygen & Nitrogen) to non-thermal plasma at temperatures of 35-40
            °C, 
          </Text>
        </View>
        <View style={{height: 20}} />
        <MyButtons
          title="Login"
          fontWeight={'sss'}
          height={60}
          width={'95%'}
          borderRadius={5}
          alignSelf="center"
          press={() => {
            // try {
            //   // triggerNotification('fghj','dxfghjk')
            // } catch (error) {
            //   console.log(error);
              
            // }
            // return
            props.navigation.navigate('Login')
          }}
          marginHorizontal={20}
          titlecolor={Mycolors.BG_COLOR}
          backgroundColor={Mycolors.Purple}
          marginVertical={10}
        />
        <MyButtons
        fontWeight={'sss'}
          title="Sign up"
          height={60}
          width={'95%'}
          borderRadius={5}
          alignSelf="center"
          press={() => {props.navigation.navigate('SignUp')}}
          marginHorizontal={20}
          titlecolor={Mycolors.Black}
          backgroundColor={Mycolors.BG_COLOR}
          marginVertical={0}
        />
        <View style={{marginVertical: 20,flexDirection:'row',}}>
         
          <TouchableOpacity>
          <Text
              style={{
                color: '#fff',
                fontSize: 20,
                fontWeight: '500',
                textAlign: 'center',
                textDecorationLine: 'underline', fontFamily:FONTFAMILY
              }}>
              Terms of Use
            </Text>
          </TouchableOpacity>
            <Text
              style={{
                color: '#fff',
                fontSize: 20,
                fontWeight: '500', fontFamily:FONTFAMILY
                // textAlign: 'center',
              }}>
              {' '}
              And{' '}
            </Text>
            <TouchableOpacity>
            <Text
              style={{
                color: '#fff',
                fontSize: 20,
                fontWeight: '500',
                textAlign: 'center',
                textDecorationLine: 'underline', fontFamily:FONTFAMILY
              }}>
              Privacy Policy
            </Text>
            </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  text: {
    color: 'black',
  },
  box: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '95%',
    marginHorizontal: 10,
  },
});
export default Welcome;
