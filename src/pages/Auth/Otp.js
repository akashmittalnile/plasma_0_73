import React, {useState} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
} from 'react-native';
import MyButtons from '../../component/MyButtons';
import MyInputText from '../../component/MyInputText';
import {dimensions, Mycolors} from '../../utility/Mycolors';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {useSelector, useDispatch} from 'react-redux';
import {baseUrl, forgotpass, otp_verfication, requestPostApi} from '../../WebApi/Service';
import Loader from '../../WebApi/Loader';
import Toast from 'react-native-simple-toast';
import MyAlert from '../../component/MyAlert';
import AuthHeader from '../../component/AuthHeader';
import { FONTFAMILY } from '../../utility/fonts';
 

const CELL_COUNT = 4;
const Otp = props => {
  const dispatch = useDispatch();
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [mprops, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [loading, setLoading] = useState(false);
  const [My_Alert, setMy_Alert] = useState(false);
  const [alert_sms, setalert_sms] = useState('');

  const [otp, setotp] = useState(props.route.params.otp)
  const [email, setemail] = useState(props.route.params.email)

  const optclicked = async () => {
    // LoginPressed('hi');
      if(otp==value){
        let formdata = new FormData();
          formdata.append("email",email);
          formdata.append("otp",value);
        
          setLoading(true)
     const{responseJson,err}  = await requestPostApi(otp_verfication,formdata,'POST','')
      setLoading(false)
      if(err==null){
          if(responseJson.status){
            props.navigation.navigate('ChangePassword',{otp:otp,email:email});
        }else{
            Toast.show(responseJson.message);
          }
      }else{
              setalert_sms(err)
              setMy_Alert(true)
      }
    }else{
      Toast.show('Please Enter Valid OTP !')
    }
  };

  const Validation = () => {
    var EmailReg =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var nameReg = /[^a-zA-Z- ]/g;
    var OneDecimalPoint = /^(\d*)\.{0,1}(\d){0,1}$/;
     if(email == '' || email.trim().length == 0){
      Toast.show('Please Enter Email');
      return false
    }else if(!EmailReg.test(email)){
      Toast.show('Please Enter Valid Email');
      return false
    }else{
    return true
    }
   
  };

  const ResetPressed = async () => {
   console.log("ResetPressed start", email);
   try {
     if (Validation()){
      //  props.navigation.navigate('Otp');
       setLoading(true);
       let formdata = new FormData();
       
       formdata.append('email', email);
       // formdata.append('password', pass);
        
 
       const {responseJson, err} = await requestPostApi(
         forgotpass,
         formdata,
         'POST',
         '',
       );
       setLoading(false);
       console.log('the res==>>', responseJson);
       if (err == null) {
         if (responseJson.status) {
           console.log({"ResetPressed":responseJson});
           // props.navigation.navigate('Otp',{otp:responseJson.data.otp,email:email});
           setotp(responseJson.data.otp)
 
         } else {
           setalert_sms(responseJson.message);
           setMy_Alert(true);
         }
       } else {
         setalert_sms(err);
         setMy_Alert(true);
       }
     }
   } catch (error) {
    console.log("ResetPressed error", error);
    setLoading(false);
   }finally{
    console.log("ResetPressed errorfinally")
    setLoading(false);
   }
  // }
  };

  
  return (
    <SafeAreaView style={styles.container}>
      {/* <LinearGradient
          colors={[Mycolors.BG_LINEAR_START_COLOR, Mycolors.BG_LINEAR_END_COLOR]}
          style={{flex: 1,height:dimensions.SCREEN_HEIGHT}}
         > */}
      <ImageBackground
        resizeMode="stretch"
        style={{height: 500}}
        source={require('../../assets/LoginImage2.png')}>
        <AuthHeader
          height={60}
          paddingHorizontal={15}
          press1={() => {
            props.navigation.goBack();
          }}
          img1={require('../../assets/arrow.png')}
          img1width={40}
          img1height={40}
          Text1={'Verification Code'}
          backgroundColor={'transparent'}
        />
      </ImageBackground>
      <View
        style={{
          height: dimensions.SCREEN_HEIGHT,

          position: 'absolute',
          width: '100%',
          // marginHorizontal: 20,
          // backgroundColor: Mycolors.BG_COLOR,
          borderRadius: 15,
          alignSelf: 'center',
          top: '31%',
          // flex:1
        }}>
        <View
          style={{
            // height: (dimensions.SCREEN_HEIGHT * 20) / 100,
            height: 40,
            width: '78%',
            marginHorizontal: 50,
            // position: 'absolute',
            // justifyContent: 'center',
            // alignItems: 'center',
            top: -40,
          }}>
          <Image
            resizeMode="contain"
            source={require('../../assets/Plasmapen_icon.png')}
            style={{height: '100%', width: '100%'}}
          />
        </View>
        <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              height: 520,

              // position: 'absolute',
              width: '90%',
              marginHorizontal: 20,
              backgroundColor: Mycolors.BG_COLOR,
              borderRadius: 15,
              alignSelf: 'center',
              // top: '37%',
              borderColor: '#fff',
              borderWidth: 0.5,
              paddingHorizontal: 20,
              shadowColor: '#000000',
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowRadius: 5,
              shadowOpacity: 1.0,
              elevation: 5,
            }}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image
                resizeMode="contain"
                source={require('../../assets/Otp_icon.png')}
                style={{height: 150, width: 150}}
              />
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: '90%',
                marginHorizontal: 20,
              }}>
              <Text  style={{fontFamily:FONTFAMILY,
                  color: Mycolors.Black,
                  fontSize: 30,
                  fontWeight: '700', fontFamily:FONTFAMILY
                }}>
                Forgot Password?{' '}
              </Text>
              <Text  style={{fontFamily:FONTFAMILY,
                  color: Mycolors.Black,
                  fontSize: 14,
                  fontWeight: '400',
                  textAlign: 'center', fontFamily:FONTFAMILY
                }}>
                Check your email we have sent you a verification code on
              </Text>
              <Text  style={{fontFamily:FONTFAMILY,
                  color: Mycolors.Purple,
                  fontSize: 14,
                  fontWeight: '400',
                  textAlign: 'center',
                  marginTop: 20, fontFamily:FONTFAMILY
                }}>
                {email} {"("} {otp} {")"}
              </Text>
            </View>
            <KeyboardAvoidingView>
            <View
              style={{width: '100%', height: 100, marginTop: 10, zIndex: 999}}>
              <CodeField
                ref={ref}
                {...mprops}
                value={value}
                onChangeText={setValue}
                cellCount={CELL_COUNT}
                rootStyle={styles.codeFieldRoot}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                placeholder="*"
                placeholderTextColor={Mycolors.Black}
                renderCell={({index, symbol, isFocused}) => (
                  <View
                    onLayout={getCellOnLayoutHandler(index)}
                    key={index}
                    style={[styles.cellRoot, isFocused && styles.focusCell]}>
                    <Text style={styles.cellText}>
                      {symbol || (isFocused ? <Cursor /> : null)}
                    </Text>
                  </View>
                )}
              />
            </View>
            </KeyboardAvoidingView>
            <TouchableOpacity onPress={()=>{
              ResetPressed()
              }} style={{justifyContent:'center',alignItems:'center',marginBottom:20}}>
            <Text style={{fontFamily:FONTFAMILY, fontSize: 14 ,color:Mycolors.Purple,left:0, fontFamily:FONTFAMILY}}>Resent Verification Code</Text>
            </TouchableOpacity>
           

            <MyButtons
              title="Reset Password"
              height={60}
              width={'100%'}
              borderRadius={5}
              fontWeight={'700'}
              alignSelf="center"
              press={() => {
                optclicked()
              }}
              marginHorizontal={20}
              titlecolor={Mycolors.BG_COLOR}
              backgroundColor={Mycolors.Purple}
              marginVertical={10}
            />
          </View>
          <View style={{width: 20, height: 100}}></View>
        </ScrollView>
        </KeyboardAvoidingView>
      </View>
      {/* <ScrollView style={{ paddingHorizontal: 20 }}>
       <View style={{flexDirection:'row',width:'100%',height:50,marginTop:'20%'}}>
       <Image source={require('../../assets/greentick.png')} style={{ width: 17, height: 12,top:10}} />
       <Text style={{fontFamily:FONTFAMILY,fontWeight: 'bold', fontSize: 20 ,color:Mycolors.BTN_LINEAR_START_COLOR,left:10}}>CONFIRMATION</Text>
       </View>
 
       <View style={{flexDirection:'row',width:'100%',height:50,alignItems:'center'}}>
       <Image source={require('../../assets/smartphone.png')} style={{ width: 35, height: 60}} />
       <View style={{left:20}}>
       <Text style={{fontFamily:FONTFAMILY,fontWeight: '500', fontSize: 16 ,color:Mycolors.TEXT_COLOR,left:10}}>Please type the verification</Text>
       <Text style={{fontFamily:FONTFAMILY,fontWeight: '500', fontSize: 16 ,color:Mycolors.TEXT_COLOR,left:10,marginTop:5}}>code send to {props.route.params.c_code}{props.route.params.number}</Text>
       </View>
       </View>
       
        <View style={{width:'100%',height:100,marginTop:10,zIndex:999}}>
          <CodeField
        ref={ref}
        {...mprops}
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        // placeholder="-"
        // placeholderTextColor={Mycolors.TEXT_COLOR}
        renderCell={({index, symbol, isFocused}) => (
          <View
            onLayout={getCellOnLayoutHandler(index)}
            key={index}
            style={[styles.cellRoot, isFocused && styles.focusCell]}>
            <Text style={styles.cellText}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          </View>
        )}
      /> 
      </View>

<View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:'100%'}}>
      <View style={{flexDirection:'row',width:'45%',height:40,alignItems:'center'}}>
       <Text style={{fontFamily:FONTFAMILY, fontSize: 13 ,color:Mycolors.TEXT_COLOR,left:10}}>RESEND CODE</Text>
       <Image source={require('../../assets/arrow_right_black.png')} style={{ width: 18, height: 20,left:20}} />
      </View>
       <View style={{flexDirection:'row',width:'45%',height:40,alignItems:'center'}}>
       <Image source={require('../../assets/suport.png')} style={{ width: 15, height: 12}} />
       <Text style={{fontFamily:FONTFAMILY, fontSize: 14 ,color:Mycolors.TEXT_COLOR,left:10}}>Support Center</Text>
       </View>

</View>

      <MyButtons title="Submit" height={50} width={'100%'} borderRadius={30} alignSelf="center" press={()=>{optclicked()}} marginHorizontal={20} 
      titlecolor={Mycolors.BG_COLOR} backgroundColor={Mycolors.SKY_BLUE} marginVertical={40} hLinearColor={[Mycolors.BTN_LINEAR_START_COLOR,Mycolors.BTN_LINEAR_END_COLOR]}/>
     

        </ScrollView> */}

      {My_Alert ? (
        <MyAlert
          sms={alert_sms}
          okPress={() => {
            setMy_Alert(false);
          }}
        />
      ) : null}
      {loading ? <Loader /> : null}
      {/* </LinearGradient> */}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Mycolors.DrawerBGcolor,
  },
  root: {padding: 20, minHeight: 300},
  title: {textAlign: 'center', fontSize: 30},
  codeFieldRoot: {
    marginTop: 20,
    width: 280,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  cellRoot: {
    width: 60,
    height: 60,
    borderRadius:5,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#EAEDF7',
    borderWidth: 1,
    backgroundColor: Mycolors.BG_COLOR,
  },
  cellText: {
    color: Mycolors.Black,
    fontSize: 36,
    textAlign: 'center', fontFamily:FONTFAMILY
  },
  focusCell: {
    // borderBottomColor: '#007AFF',55
    // borderBottomWidth: 2,
    backgroundColor: Mycolors.BG_COLOR,
  },
});
export default Otp;
