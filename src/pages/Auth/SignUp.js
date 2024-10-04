import React, { useEffect, useState } from 'react';
// import DropDownPicker from 'react-native-dropdown-picker';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  TextInput,
  Keyboard,
  Alert,
  Platform,
  TouchableOpacity,
  ImageBackground,
  PermissionsAndroid,
} from 'react-native';
import MyButtons from '../../component/MyButtons';
import MyInputText from '../../component/MyInputText';
import { dimensions, Mycolors } from '../../utility/Mycolors';
import MyAlert from '../../component/MyAlert';
import Toast from 'react-native-simple-toast';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
// import CountryPicker, {
//   getAllCountries,
//   getCallingCode,
//   DARK_THEME,
// } from 'react-native-country-picker-modal';
import AuthHeader from '../../component/AuthHeader';
import TextInputArea from '../../component/TextInputArea';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import Svg from 'react-native-svg';
import { SvgUri, Svg } from 'react-native-svg';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

// import SvgUri from 'react-native-svg-uri';
import {
  register,
  requestGetApi,
  requestGetWithoutBody,
  requestPostApi,
} from '../../WebApi/Service';
import Loader from '../../WebApi/Loader';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import CustomPicker from '../../component/CustomPicker';
import DropdownComp from '../../component/DropdownComp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { saveUserResult, saveUserToken } from '../../redux/actions/user_action';
import { FONTFAMILY } from '../../utility/fonts';
import { getFCMToken } from '../../utility/FirebaseUtility';

const SignUp = props => {
  const insets = useSafeAreaInsets();
  const [flag, setFlag] = useState(
    'http://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg',
  );
  const [code, setcode] = useState('+1');
  const [isvisuable, setisvisuable] = useState(false);
  const [username, setUsername] = useState('');
  const [lastname, setlastname] = useState('');
  const [number, setnumber] = useState('');
  const [email, setemail] = useState('');
  const [pass, setpass] = useState('');
  const [MyImage, setMyImage] = useState(null);
  const [modlevisual, setmodlevisual] = useState(false);
  const [modlevisual1, setmodlevisual1] = useState(false);
  const [My_Alert, setMy_Alert] = useState(false)
  const [alert_sms, setalert_sms] = useState('')
  const [loading, setLoading] = useState(false)
  const [pick, setpick] = useState('')
  const [filepath, setfilepath] = useState(null)


  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' }
  ]);
  const [zip, setzip] = useState('');
  const [countries, setcountries] = useState([])
  const [countryName, setcountryName] = useState(null);
  const [open, setOpen] = useState(false);



  const [states, setstates] = useState([])
  const [stateName, setstateName] = useState(null);
  const [open2, setOpen2] = useState(false);


  const [cities, setcities] = useState([])
  const [cityName, setcityName] = useState(null);
  const [open3, setOpen3] = useState(false);

  const [secureTextEntry, setsecureTextEntry] = useState(true);
  const dispatch = useDispatch();

  async function getAllDropDownData(endpoint, setState) {
    try {
      setState((await requestGetWithoutBody(endpoint)).responseJson.data)
    } catch (err) {
      console.log("error");
    }
  }

  useEffect(() => {
    getAllDropDownData("countries", setcountries)
    // getAllDropDownData("states?country_id=", setstates)
    // getAllDropDownData("cities?state_id=", setcities)


  }, []);

  const requestCameraPermission = async () => {
    try {
      opencamera()
      return
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "App Camera Permission",
          message: "App needs access to your camera ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Camera permission given");
        opencamera()
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const opencamera = async () => {
    setmodlevisual(false)

    let options = {
      title: 'Select Image',
      customButtons: [
        {
          name: 'customOptionKey',
          title: 'Choose Photo from Custom Option'
        },
      ],
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchCamera(options, (image) => {
      console.log(image);
      if (image?.errorCode) {
        Toast.show("Camera Unavailable!")
        return
      }
      if (!image.didCancel) {
        console.log('the ddd==', image)
        let photo = {
          uri: image?.assets[0]?.uri,
          type: "image/jpeg",
          name: image?.assets[0]?.fileName
        };
        setpick(photo)
        setfilepath(image)
      }
    })
  }

  const openLibrary = async () => {
    setmodlevisual(false)
    let options = {
      title: 'Select Image',
      customButtons: [
        {
          name: 'customOptionKey',
          title: 'Choose Photo from Custom Option'
        },
      ],
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchImageLibrary(options, (image) => {
      if (!image.didCancel) {
        console.log('the ddd==', image.assets[0].fileName)
        let photo = {
          uri: image.assets[0].uri,
          type: "image/jpeg",
          name: image.assets[0].fileName
        };
        setpick(photo)
        setfilepath(image)
      }
    })


  }

  function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  const Validation = () => {
    var EmailReg =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var nameReg = /[^a-zA-Z- ]/g;
    var OneDecimalPoint = /^(\d*)\.{0,1}(\d){0,1}$/;
    var PassregularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

    if (username == '' || username.trim().length == 0) {
      Toast.show('Please Enter First Name');
      return false
    } else if (lastname == '' || lastname.trim().length == 0) {
      Toast.show('Please Enter Last Name');
      return false
    } else if (email == '' || email.trim().length == 0) {

      if (!validateEmail(email)) {
        Toast.show('Please Enter Valid Email');
      }

      Toast.show('Please Enter Email');
      return false
    } else if (!EmailReg.test(email)) {
      Toast.show('Please Enter Valid Email');
      return false
    } else if (number == '' || number.trim().length == 0) {
      Toast.show('Please Enter number');
      return false
    } else if (pass == '') {
      Toast.show('Please Enter Password');
      return false
    } else if (!PassregularExpression.test(pass)) {
      Toast.show('Please Enter Strong Password');
      return false
    } else {
      return true
    }

  };

  const SignupPressed = async () => {

    if (Validation()) {
      const fcmToken = await getFCMToken()
      if (!fcmToken) {
        return
      }
      setLoading(true);
      let formdata = new FormData();

      if (filepath != null) {
        formdata.append("file", pick);
      }

      formdata.append('first_name', username);
      formdata.append('last_name', lastname);
      formdata.append('email', email);
      formdata.append('country_code', code);
      formdata.append('mobile', number);
      formdata.append('password', pass);
      cityName?.id && formdata.append('city_id', cityName?.id)
      stateName?.id && formdata.append('state_id', stateName?.id)
      countryName?.id && formdata.append('country_id', countryName?.id)
      formdata.append('zipcode', zip);
      formdata.append('fcm_token', fcmToken);


      const { responseJson, err } = await requestPostApi(
        register,
        formdata,
        'POST',
        '',
      );
      setLoading(false);
      console.log('the res==>>', responseJson);
      if (err == null) {
        if (responseJson.status) {
          // setmodlevisual1(true);
          Toast.show(responseJson?.message)
          AsyncStorage.setItem("plasmapen", JSON.stringify(responseJson?.data));
          dispatch(saveUserResult(responseJson?.data))
          dispatch(saveUserToken(responseJson?.data?.access_token))
        } else {
          setalert_sms(responseJson.message);
          setMy_Alert(true);
        }
      } else {
        setalert_sms(err);
        setMy_Alert(true);
      }
    }
    // }
  };
  const countryselect = cod => {
    setcode('+' + cod.callingCode.toString());

    const url =
      'http://purecatamphetamine.github.io/country-flag-icons/3x2/' +
      cod.cca2 +
      '.svg';
    //setFlag(unc) //cca2
    console.log('URL==>', url);
    setFlag(url); //cca2
    console.log(cod);
  };

  // const Mypicker = () => {
  //   return (
  //     <CountryPicker
  //       withEmoji
  //       withCallingCode
  //       onSelect={cod => countryselect(cod)}
  //       withAlphaFilter
  //       // placeholder="CC"
  //       withFlagButton
  //       theme={DARK_THEME}
  //       visible={true}
  //       // withCountryNameButton={true}
  //       // renderFlagButton={(FlagButton['props'])}
  //       //   renderFlagButton={
  //       // // (prp)=>
  //       // {
  //       //   // console.log(prp)
  //       //     withEmoji=true,
  //       //     withFlagButton=true,
  //       //     // withCountryNameButton?: boolean,
  //       //     // withCurrencyButton?: boolean,
  //       //     // withCallingCodeButton?: boolean,
  //       //     // withFlagButton?: boolean,
  //       //     // containerButtonStyle?: StyleProp<ViewStyle>,
  //       //      countryCode='+91',
  //       //     // placeholder: string,
  //       onClose={() => {
  //         setisvisuable(false);
  //       }}
  //     //   }
  //     //    }
  //     />
  //   );
  // };

  const formatPhoneNumber = (number) => {
    // Remove any non-numeric characters
    const cleanedNumber = number.replace(/[^\d]/g, '');

    // Apply US phone number format
    // const formattedNumber = cleanedNumber.replace(/(\d{3})(\d{3})(\d{4})/, '+1 ($1) $2-$3');
    const formattedNumber = cleanedNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');

    if (String(number).length == 10) {
      return formattedNumber
    }
    else {
      return number
    }

  };


  const handleChange = (value) => {
    console.log('my handel name---->>>', value);

    setnumber(formatPhoneNumber(value));



  };

  function checkState(first, second) {
    if (first) {
      return false
    }
    else {
      if (second) {
        return true
      }
    }

    return true
  }

  const DropdownStyleProps = {

    placeholderTextColor: '#4F5168',
    TextInputWidth: '100%',
    BorderColor: Mycolors.TEXT_BORDER_LIGHt_PURPLE,
    hasViewBorder: true,
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        style={{ height: 500 }}
        resizeMode="stretch"
        source={require('../../assets/Mask_group.png')}>
        <View style={{ height: insets.top }} />
        <AuthHeader
          height={60}
          paddingHorizontal={15}
          press1={() => {
            props.navigation.goBack();
          }}
          img1={require('../../assets/arrow.png')}
          img1width={40}
          img1height={40}
          Text1={'Sign up'}
          backgroundColor={'transparent'}
        />
      </ImageBackground>
      <View
        style={{
          height: dimensions.SCREEN_HEIGHT,

          position: 'absolute',
          width: '100%',
          borderRadius: 15,
          alignSelf: 'center',
          top: '31%',
          // flex:1
        }}>
        <View
          style={{
            height: 40,
            width: '78%',
            marginHorizontal: 50,
            top: -40,
          }}>
          <Image
            resizeMode="contain"
            source={require('../../assets/Plasmapen_icon.png')}
            style={{ height: '100%', width: '100%' }}
          />
        </View>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              // height: 480,
              width: '90%',
              marginHorizontal: 20,
              backgroundColor: Mycolors.BG_COLOR,
              borderRadius: 15,
              alignSelf: 'center',
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
            <View
              style={{
                marginTop: 25,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TextInputArea
                value={username}
                setValue={setUsername}
                placeholder={'First Name *'}
                placeholderTextColor={'#4F5168'}
                TextInputWidth={'100%'}
                hasViewBorder
                icon={true}
                img={require('../../assets/user-icon.png')}
              />
              <TextInputArea
                value={lastname}
                setValue={setlastname}
                placeholder={'Last Name *'}
                placeholderTextColor={'#4F5168'}
                TextInputWidth={'100%'}
                hasViewBorder
                icon={true}
                img={require('../../assets/user-icon.png')}
              />

              <TextInputArea
                value={email}
                setValue={setemail}
                placeholder={'Email Address *'}
                placeholderTextColor={'#4F5168'}
                TextInputWidth={'100%'}
                hasViewBorder
                icon={true}
                img={require('../../assets/Email_icon.png')}
                // SendOtp={true}
                // TextInputwidth={'60%'}
                sendotpButtonPress={() => { }}
              />
              {/* 
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  alignItems: 'center',
                  marginTop: 6,
                  marginBottom: 6,
                  borderColor: Mycolors.TEXT_BORDER_LIGHt_PURPLE,
                  borderWidth: 1,
                  borderRadius: 10,
                  // margin: 2,
                  padding: 1,
                }}>
                <View
                  style={{
                    width: 100,
                    // height: 53,
                    backgroundColor: Mycolors.BG_COLOR,
                    left: 6,
                    top: 1,
                    borderTopLeftRadius: 5,
                    borderBottomLeftRadius: 5,
                    zIndex: 999,
                    justifyContent: 'center',
                  }}>
                  {isvisuable ? Mypicker() : null}

                  <View
                    style={{
                      position: 'absolute',
                      // height: 40,
                      backgroundColor: Mycolors.BG_COLOR,
                      alignItems: 'center',
                      zIndex: 999,
                      flexDirection: 'row',
                      width: 100,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        setisvisuable(true);
                      }}
                      style={{
                        width: 50,
                        height: 27,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Svg width={40} height={27} uri={flag} />
                      <SvgUri
                          width="100%"
                          height="100%"
                          uri="http://thenewcode.com/assets/images/thumbnails/homer-simpson.svg"
                        />
                      <Image
                        style={{ width: 14, height: 14, tintColor: 'black' }}
                        source={
                          Mycolors.BG_COLOR == '#fff'
                            ? require('../../assets/purple_arrow-down.png')
                            : require('../../assets/purple_arrow-down.png')
                        }
                      />
                    </TouchableOpacity>
                    <ScrollView style={{ left: 12, paddingHorizontal: 6, }}>
                      <Text
                        style={{fontFamily:FONTFAMILY,
                          color: Mycolors.TEXT_COLOR,
                          fontWeight: 'bold',
                          alignSelf: 'flex-end',
                          top: -0.2,
                        }}>
                        {code}
                      </Text>
                    </ScrollView>
                  </View>
                </View>

                <TextInput
                  value={number}
                  onChangeText={text => {
                    setnumber(text);
                    if (number.length == 9) {
                      Keyboard.dismiss();
                    }
                  }}
                  placeholder="Phone Number"
                  placeholderTextColor={Mycolors.GrayColor}
                  style={[styles.input, { left: 10 }]}
                  keyboardType="numeric"
                  maxLength={10}
                  img={require('../../assets/lock.png')}

                // editable={false}
                />
              </View> */}
              <TextInputArea
                maxLength={10}
                placeholder="Phone Number *"
                placeholderTextColor={'#4F5168'}
                secureTextEntry={true}
                required={true}
                value={number}
                hasViewBorder
                setValue={handleChange}
                // isSecure={true}
                icon={true}
                img={require('../../assets/call.png')}
              // myTextInputRef={passWordRef}
              // onSubmitEditing={() => confirmPassWordRef.current.focus()}
              />
              {/* <CustomPicker /> */}
              <TextInputArea
                placeholder="Password *"
                placeholderTextColor={'#4F5168'}
                secureTextEntry={true}
                isSecure={secureTextEntry}
                required={true}
                value={pass}
                hasViewBorder
                setValue={setpass}
                // isSecure={true}
                icon={true}
                img={require('../../assets/lock.png')}
                
                secondIcon={secureTextEntry ? require('../../assets/white_eye.png') : require('../../assets/eye_crossed.png')}
                secondIconPress={() => {
                  setsecureTextEntry((state) => (!state))
                  // console.log(secureTextEntry);
                }}
              // myTextInputRef={passWordRef}
              // onSubmitEditing={() => confirmPassWordRef.current.focus()}
              />

              <DropdownComp
                {...DropdownStyleProps}
                value={countryName?.label}
                setValue={setzip}
                placeholder='Select Country *'
                onSelect={(item, index) => {
                  console.log(item, index);
                  setcountryName(item)
                  setstateName(null)
                  setcityName(null)
                  getAllDropDownData(`states?country_id=${item?.id}`, setstates)

                }}
                items={countries}
                renderListValues={(item, index) => item?.label}
              />
              <DropdownComp
                {...DropdownStyleProps}
                value={stateName?.label}

                placeholder='Select State *'
                onSelect={(item, index) => {
                  console.log(item, index);
                  setstateName(item)
                  setcityName(null)
                  getAllDropDownData(`cities?state_id=${item?.id}`, setcities)

                }}
                items={states}
                renderListValues={(item, index) => item?.label}
              />

              <DropdownComp
                {...DropdownStyleProps}
                value={cityName?.label}
                placeholder='Select City *'
                onSelect={(item, index) => {
                  console.log(item, index);
                  setcityName(item)
                }}
                items={cities}
                renderListValues={(item, index) => item?.label}
              />

              <TextInputArea
                value={zip}
                setValue={setzip}
                placeholder={'ZIP Code *'}
                placeholderTextColor={'#4F5168'}
                TextInputWidth={'100%'}
                hasViewBorder
                icon={true}
                img={require('../../assets/zip_code.png')}
                // SendOtp={true}
                TextInputwidth={'60%'}
                sendotpButtonPress={() => { }}
              />
              <TouchableOpacity
                onPress={() => setmodlevisual(true)}
                style={styles.uploadPictureView}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  {filepath != null ? <Image
                    source={{ uri: filepath?.assets[0]?.uri }}
                    style={{ height: 26, width: 26, marginLeft: 7 }}
                  /> : (
                    <Image
                      source={require('../../assets/purple_gallery.png')}
                      style={{ height: 26, width: 26, marginLeft: 7 }}
                    />
                  )}
                  <Text style={styles.uploadPictureText}>
                    {filepath ? filepath?.assets[0]?.fileName?.slice(0, 20) : 'Upload Profile Image *'}
                  </Text>
                </View>
                {!(filepath == null) ? null : (
                  <Image
                    source={require('../../assets/UploadImage.png')}
                    // tintColor={"red"}
                    style={{ height: 26, width: 26 }}
                  />
                )}
              </TouchableOpacity>
            </View>

            <MyButtons
              title="Sign Up"
              height={60}
              width={'100%'}
              borderRadius={5}
              fontWeight={'700'}
              alignSelf="center"
              press={() => {
                SignupPressed()
                // props.navigation.replace('Login');

              }}
              marginHorizontal={20}
              titlecolor={Mycolors.BG_COLOR}
              backgroundColor={Mycolors.Purple}
              marginVertical={10}
            />
            {/* </ScrollView> */}
          </View>

          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              // height: (dimensions.SCREEN_HEIGHT * 28) / 100,
              // position: 'absolute',
              width: '100%',
              // bottom: 0,
            }}>
            {/* <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 20,
              }}>
              <View
                style={{
                  width: '30%',
                  borderWidth: 1,
                  borderTopColor: '#4556A6',
                }}
              />
              <View
                style={{
                  backgroundColor: '#4556A6',
                  borderRadius: 10,
                  padding: 10,
                  marginHorizontal: 20,
                }}>
                <Text style={{fontFamily:FONTFAMILY, color: '#fff' }}>OR</Text>
              </View>
              <View
                style={{
                  width: '30%',
                  borderWidth: 1,
                  borderTopColor: '#4556A6',
                }}
              />
            </View> */}

            {/* <TouchableOpacity
              style={{
                backgroundColor: '#fff',
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                padding: 15,
                borderColor: '#fff',
                borderWidth: 0.5,
                shadowColor: '#000000',
                shadowOffset: {
                  width: 0,
                  height: 3,
                },
                shadowRadius: 5,
                shadowOpacity: 1.0,
                elevation: 5,
                width: '90%',
                marginHorizontal: 20,
                marginTop: 15,
              }}>
              <Image
                source={require('../../assets/logo_fb.png')}
                style={{height: 26, width: 26}}
              />
              <Text  style={{fontFamily:FONTFAMILY,color: '#6A6A6A', fontWeight: '500', marginLeft: 15}}>
                Login with Facebook
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: '#fff',
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                padding: 15,
                borderColor: '#fff',
                borderWidth: 0.5,
                shadowColor: '#000000',
                shadowOffset: {
                  width: 0,
                  height: 3,
                },
                shadowRadius: 5,
                shadowOpacity: 1.0,
                elevation: 5,
                width: '90%',
                marginHorizontal: 20,
                marginTop: 10,
              }}>
              <Image
                source={require('../../assets/logo_google.png')}
                style={{height: 26, width: 26}}
              />
              <Text  style={{fontFamily:FONTFAMILY,color: '#6A6A6A', fontWeight: '500', marginLeft: 15}}>
                Login with Google
              </Text>
            </TouchableOpacity> */}

            <View style={{ flexDirection: 'row', alignSelf: 'center', top: 20 }}>
              <Text
                style={[styles.textStyle, { color: Mycolors.TEXT_COLOR, fontFamily:FONTFAMILY }]}
                onPress={() => { }}>
                Already have an account?
              </Text>
              <Text
                style={[styles.textStyle, { color: '#4556A6', fontFamily:FONTFAMILY }]}
                onPress={() => {
                  props.navigation.navigate('Login');
                }}>
                {' '}
                SignIn
              </Text>
            </View>

            <View style={{ width: 20, height: 200 }}></View>
          </View>
          <View style={{ width: 20, height: 100 }}></View>
        </KeyboardAwareScrollView>
        <View />
      </View>
      <Modal
        isVisible={modlevisual1}
        swipeDirection="down"
        onSwipeComplete={e => {
          setmodlevisual1(false);
        }}
        coverScreen={false}
        backdropColor="transparent"
        style={{
          justifyContent: 'center',
          margin: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
        <View
          style={{
            height: 380,
            backgroundColor: Mycolors.BG_COLOR,
            borderRadius: 10,
            padding: 20,
            margin: 0,
            bottom: 0,
            marginHorizontal: 20,
          }}>
          <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.mainView}>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image
                  resizeMode="contain"
                  source={require('../../assets/Forgot_psswd_icon.png')}
                  style={{ height: 150, width: 150 }}
                />
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '90%',
                  marginHorizontal: 20,
                }}>
                <Text
                  style={{
                    color: Mycolors.Purple,
                    fontSize: 20,
                    fontWeight: '700',
                    marginVertical: 15, fontFamily:FONTFAMILY
                  }}>
                  Great!
                </Text>
                <Text
                  style={{
                    color: Mycolors.Black,
                    fontSize: 14,
                    fontWeight: '400',
                    textAlign: 'center', fontFamily:FONTFAMILY
                  }}>
                  You Have Successfully Signup
                </Text>
              </View>
              <View style={{ height: 20 }} />
              <MyButtons
                title="Login"
                height={60}
                width={'100%'}
                borderRadius={5}
                fontWeight={'700'}
                alignSelf="center"
                press={() => {
                  props.navigation.navigate('Login');
                }}
                marginHorizontal={20}
                titlecolor={Mycolors.BG_COLOR}
                backgroundColor={Mycolors.Purple}
                marginVertical={10}
              />
            </View>
          </KeyboardAwareScrollView>
        </View>
      </Modal>
      <Modal
        isVisible={modlevisual}
        swipeDirection="down"
        // style={{
        //   flex: 1,
        //   // justifyContent: 'center',
        //   margin: 0,
        //   backgroundColor: 'rgba(0,0,0,0.5)',
        // }}
        animationIn={'fadeIn'}
        onSwipeComplete={(e) => {
          setmodlevisual(false)
        }}
        coverScreen={false}
        backdropColor='transparent'
      // style={{ justifyContent: 'flex-end', margin: 0, }}
      >
        <TouchableOpacity style={{ width: dimensions.SCREEN_WIDTH, backgroundColor: 'rgba(0,0,0,0.5)', height: dimensions.SCREEN_HEIGHT, alignSelf: 'center' }} onPress={() => {
          setmodlevisual(false)

        }}>

        </TouchableOpacity>

        <View style={{ height: 200, backgroundColor: 'white', borderRadius: 10, padding: 20, bottom: 0, position: 'absolute', top: '42%', alignItems: 'center', justifyContent: 'space-between' }}>


          <Text style={{fontFamily:FONTFAMILY, fontSize: 17, color: 'black', fontWeight: '600', fontFamily:FONTFAMILY }}>Upload</Text>
          <Text style={{fontFamily:FONTFAMILY, fontSize: 17, color: 'grey', }}>Please Upload Your Profile Image </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', }}>
            <TouchableOpacity style={{ padding: 20, borderWidth: 1, borderStyle: 'dotted', borderColor: '#4556A6' }}
              onPress={() => { openLibrary() }}
            >
              <Image
                source={require('../../assets/gallery.png')}
                style={{ width: 40, height: 40, alignSelf: 'center' }}
              />
              <Text style={{fontFamily:FONTFAMILY, textAlign: 'center', color: '#4556A6', fontFamily:FONTFAMILY }}>Open Liberary</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ padding: 20, borderWidth: 1, borderStyle: 'dotted', borderColor: '#B357C3' }}
              onPress={() => { Platform.OS == 'ios' ? opencamera() : requestCameraPermission() }}
            >
              <Image
                source={require('../../assets/camera.png')}
                style={{ width: 40, height: 40, alignSelf: 'center' }}
              />
              <Text style={{fontFamily:FONTFAMILY, textAlign: 'center', color: '#B357C3', fontFamily:FONTFAMILY }}>Open Camera</Text>
            </TouchableOpacity>
          </View>



        </View>
      </Modal>

      {My_Alert ? <MyAlert sms={alert_sms} okPress={() => { setMy_Alert(false) }} /> : null}
      {loading ? <Loader /> : null}

    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: Mycolors.DrawerBGcolor,
    backgroundColor: 'white',
  },
  inputView: {
    width: dimensions.SCREEN_WIDTH - 40,
    marginTop: 10,
  },
  input: {
    height: 55,
    width: '60%',
    // fontSize: 12,
    borderColor: 'transparent',
    borderWidth: 1,
    borderRadius: 5,
    color: Mycolors.TEXT_COLOR,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: Mycolors.BG_COLOR,
    top: 1,
  },
  uploadPictureView: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Mycolors.Purple,
    borderRadius: 0.5,
    borderStyle: 'dashed',
    paddingHorizontal: 10,
    zIndex: 0,
    width: '100%',
    height: 55,
  },
  uploadPictureText: {
    color: Mycolors.GREY,
    fontSize: 14,
    padding: 10,
    paddingVertical: 15, fontFamily:FONTFAMILY
    // marginLeft: -132,
  },
});
export default SignUp;
