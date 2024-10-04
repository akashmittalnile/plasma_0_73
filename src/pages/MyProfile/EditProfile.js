import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  PermissionsAndroid,
  SafeAreaView,
  Platform,
  ScrollView,
  useColorScheme,
  Alert,
  TextInput,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import MyButtons from '../../component/MyButtons';
import MyInputText from '../../component/MyInputText';
import { dimensions, Mycolors } from '../../utility/Mycolors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import { saveUserResult, saveUserToken } from '../../redux/actions/user_action';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  baseUrl,
  update_profile,
  profile,
  requestGetApi,
  requestPostApi,
  requestGetWithoutBody,
} from '../../WebApi/Service';
import Loader from '../../WebApi/Loader';
import Toast from 'react-native-simple-toast';
import MyAlert from '../../component/MyAlert';
import Modal from 'react-native-modal';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
// import DropDownPicker from 'react-native-dropdown-picker';
// import DatePicker from 'react-native-datepicker';
// import DateTimePickerModal from 'react-native-modal-datetime-picker';
import HomeHeader2 from '../../component/HomeHeader2';
import LinearGradient from 'react-native-linear-gradient';
import TextInputArea from '../../component/TextInputArea';
import DropdownComp from '../../component/DropdownComp';
import { FONTFAMILY } from '../../utility/fonts';
import useAPI from '../../utility/hooks/useAPI';

// owner_image
const EditProfile = props => {
  const [person_Image, setperson_Image] = useState(
    'https://www.sailoons.com/upload/assets/img/profile.png',
  );
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const userdetaile = useSelector(state => state.user.user_details);
  const {  getAPI } = useAPI()
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setemail] = useState('');
  const [mobile, setmobile] = useState('');
  const [company, setCompany] = useState('');
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [timezone, setTimezone] = useState('');
  const [pick, setpick] = useState('');
  const [filepath, setfilepath] = useState(null);
  const [modlevisual, setmodlevisual] = useState(false);
  const [My_Alert, setMy_Alert] = useState(false);
  const [alert_sms, setalert_sms] = useState('');

  const [countryCode, setCountryCode] = useState('+91');
  const [relodes, setrelodes] = useState(false);
  const [ownerprofileData, setOwnerprofileData] = useState({});

  const [code, setcode] = useState('+1');
  const [isvisuable, setisvisuable] = useState(false);

  const [modlevisual1, setmodlevisual1] = useState(false);

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




  useEffect(() => {
    getprofiledata();
  }, []);


  function setCountryStateCityFromResp(label, id, setThis) {
    // console.log("setCountryStateCityFromResp \n", { id, label });
    // if (id && label && setThis) {
    //   return
    // }

    // console.log("setCountryStateCityFromResp2 \n", { id, label });
    setThis({ id, label })

  }

  const getprofiledata = async () => {
    setLoading(true);
    let formdata = new FormData();
    formdata.append('id', userdetaile.id);
    const { responseJson, err } = await requestGetApi(profile, '', 'GET', userdetaile.access_token)

    setLoading(false);
    console.log('the owner profile data is==>>', responseJson);
    if (err == null) {
      if (responseJson.status) {
        // dispatch(saveUserResult(responseJson.data));
        // AsyncStorage.setItem('plasmapen', JSON.stringify(responseJson.data));

        const { country,
          country_id,
          state,
          state_id,
          city,
          city_id,
          zipcode } = responseJson.data

        setOwnerprofileData(responseJson.data);
        console.log("profile_image", responseJson?.data?.profile_image);
        setFirstname(responseJson.data.first_name);
        setLastname(responseJson.data.last_name);
        setemail(responseJson.data.email)
        setmobile(formatPhoneNumber(responseJson.data.mobile))
        // setCompany(responseJson?.data?.company)
        // setProfessionalTitle(responseJson?.data?.title)
        // setTimezone(timezone)
        setCountryCode(responseJson.data.country_code);
        setzip(zipcode)

        setCountryStateCityFromResp(country, country_id, setcountryName)

        setCountryStateCityFromResp(state, state_id, setstateName)

        setCountryStateCityFromResp(city, city_id, setcityName)

        setrelodes(!relodes)
      } else {
        setOwnerprofileData(null);
      }
    } else {
    }
  };


  const formatPhoneNumber = (number) => {
    // Remove any non-numeric characters
    const cleanedNumber = number.replace(/[^\d]/g, '');

    // Apply US phone number format
    const formattedNumber = cleanedNumber.replace(/(\d{3})(\d{3})(\d{4})/, '+1 ($1) $2-$3');

    if (String(number).length == 10) {
      return formattedNumber
    }
    else {
      return number
    }

  };

  const handleChange = (value) => {
    console.log('my handel name---->>>', value);

    setmobile(formatPhoneNumber(value));



  };

  async function user_details() {
    console.log('user_details()');
    
    try {
      const res = await getAPI({ endPoint: 'user-details' })
      console.log("user-details", { res });
      if (!res) {
        return
      }
      AsyncStorage.setItem("plasmapen", JSON.stringify(res.data));
      dispatch(saveUserResult(res.data))

    } catch (error) {
      console.log("unseen_message_count", { error });
    }

  }

  const UpdatePressed = async () => {
    if (firstname == '' || firstname.trim().length == 0) {
      Toast.show('Please Enter Frist Name');
    } else if (lastname == '' || lastname.trim().length == 0) {
      Toast.show('Please Enter Last Name');
    } else if (email == '' || email.trim().length == 0) {
      Toast.show('Please Enter Email');
    } else if (mobile == '' || mobile.trim().length == 0) {
      Toast.show('Please Enter Mobile Number');
    }
    else if (countryName == null) {
      Toast.show('Please Select Country');
    }
    // else if (company == '' || company.trim().length == 0) {
    //   Toast.show('Please Enter company name');
    // } 
    // else if (professionalTitle == '' || professionalTitle.trim().length == 0) {
    //   Toast.show('Please Enter professional Title');
    // } 
    // else if (timezone == '' || timezone.trim().length == 0) {
    //   Toast.show('Please Enter timezone');
    // } 
    else {
      let formdata = new FormData();


      //  formdata.append('user_id', userdetaile.id);
      // formdata.append('name', firstname + lastname);
      formdata.append('first_name', firstname);
      formdata.append('last_name', lastname);
      formdata.append('email', email);
      formdata.append('country_code', countryCode);
      formdata.append('mobile', mobile);
      cityName?.id && formdata.append('city_id', cityName?.id)
      stateName?.id && formdata.append('state_id', stateName?.id)
      countryName?.id && formdata.append('country_id', countryName?.id)
      // formdata.append('Company', company);
      // formdata.append('professional_title', professionalTitle);
      // formdata.append('timezon', timezone);
      if (filepath != null) {
        formdata.append('file', pick);
      }

      formdata.append('zipcode', zip);


      setLoading(true);
      const { responseJson, err } = await requestPostApi(
        update_profile,
        formdata,
        'POST',
        userdetaile.access_token,
      );
      // setLoading(false);
      console.log('The edit profile responce is==>>', responseJson);
      if (err == null) {
        if (responseJson.status) {
          // getprofiledata();
          // resetStacks('Myprofile');
          

          user_details().then((val)=>{
            props.navigation?.goBack()
          }).catch(()=>{

          }).finally(()=>{
            setLoading(false);
          })
          Toast.show(responseJson.message);
        } else {
          setalert_sms(responseJson.message);
          setMy_Alert(true);
        }
      } else {
        console.log('The error is==>>', err);
      }
    }
  };

  const requestCameraPermission = async () => {
    try {
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

  function clearAll() {

    setFirstname('')
    setLastname('')
    setemail('')
    setmobile('')
    setzip('')
    setfilepath(null)
    setcityName(null)
    setstateName(null)
    setcountryName(null)

  }

  const DropdownStyleProps = {

    placeholderTextColor: '#4F5168',
    TextInputWidth: '100%',
    BorderColor: Mycolors.TEXT_BORDER_LIGHt_PURPLE,
    hasViewBorder: true,
  }
  const resetStacks = page => {
    props.navigation.reset({
      index: 0,
      routes: [{ name: page }],
      params: { resentotp: false },
    });
  };

  return (
    <LinearGradient
      colors={['#300076', '#300076', '#53045F', '#53045F']}
      style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <HomeHeader2
          height={60}
          // paddingHorizontal={15}
          title={'Edit Profile'}
          press1={() => {
            props.navigation.goBack();
          }}
          img1={require('../../assets/arrow_right_black.png')}
          img1width={25}
          img1height={25}
          press2={() => { props.navigation.navigate('Notification') }}
          img2={require('../../assets/notification.png')}
          img2width={25}
          img2height={25}
          press3={() => { }}
          img3={require('../../assets/shoppingbag.png')}
          img3width={25}
          img3height={25}
          backgroundColor={'transparent'}
        />
        <ScrollView>
          <View
            style={{
              height: dimensions.SCREEN_HEIGHT,
              // position: 'absolute',
              width: '93%',
              backgroundColor: Mycolors.BG_COLOR,
              borderRadius: 15,
              marginTop: 10,
              alignSelf: 'center',
              // bottom: 0,
              borderColor: '#fff',
              borderWidth: 0.5,
              paddingHorizontal: 20,
            }}>
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
              <View
                style={{
                  marginTop: 25,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TextInputArea
                  value={firstname}
                  setValue={setFirstname}
                  placeholder={'First Name'}
                  placeholderTextColor={'#4F5168'}
                  TextInputWidth={'100%'}
                  hasViewBorder
                  icon={true}
                  img={require('../../assets/user-icon.png')}
                />

                <TextInputArea
                  value={lastname}
                  setValue={setLastname}
                  placeholder={'Last Name'}
                  placeholderTextColor={'#4F5168'}
                  TextInputWidth={'100%'}
                  hasViewBorder
                  icon={true}
                  img={require('../../assets/user-icon.png')}
                />

                <TextInputArea
                  value={email}
                  setValue={setemail}
                  placeholder={'Email Address'}
                  placeholderTextColor={'#4F5168'}
                  TextInputWidth={'100%'}
                  hasViewBorder
                  icon={true}
                  img={require('../../assets/Email_icon.png')}
                  TextInputwidth={'100%'}
                />
                <TextInputArea
                  maxLength={10}
                  value={mobile}
                  setValue={handleChange}
                  placeholder={'Phone'}
                  placeholderTextColor={'#4F5168'}
                  TextInputWidth={'100%'}
                  hasViewBorder
                  icon={true}
                  img={require('../../assets/profile_call-calling.png')}
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
                        source={{ uri: ownerprofileData?.profile_image }}
                        // source={require('../../assets/purple_gallery.png')}
                        style={{ height: 26, width: 26, marginLeft: 7 }}
                      />
                    )}
                    <Text style={styles.uploadPictureText}>
                      {filepath ? filepath?.assets[0]?.fileName?.slice(0, 20) : 'Update Profile Image '}
                    </Text>
                  </View>
                  {!(filepath == null) ? null : (
                    <Image
                      // source={{ uri: ownerprofileData?.profile_image }}
                      source={require('../../assets/UploadImage.png')}
                      // tintColor={"red"}
                      style={{ height: 26, width: 26 }}
                    />
                  )}
                </TouchableOpacity>
                {/* <TextInputArea
                  value={company}
                  setValue={setCompany}
                  placeholder={'Company'}
                  placeholderTextColor={'#4F5168'}
                  TextInputWidth={'100%'}
                  hasViewBorder
                  icon={true}
                  img={require('../../assets/building.png')}
                /> */}
                {/* <TextInputArea
                  value={professionalTitle}
                  setValue={setProfessionalTitle}
                  placeholder={'Professional Title'}
                  placeholderTextColor={'#4F5168'}
                  TextInputWidth={'100%'}
                  hasViewBorder
                  icon={true}
                  img={require('../../assets/personalcard.png')}
                /> */}
                {/* <TextInputArea
                  value={timezone}
                  setValue={setTimezone}
                  placeholder={'Timezone'}
                  placeholderTextColor={'#4F5168'}
                  TextInputWidth={'100%'}
                  hasViewBorder
                  icon={true}
                  img={require('../../assets/TImezone_clock.png')}
                /> */}
                {/* <TouchableOpacity
                  onPress={() => { }}
                  style={styles.uploadPictureView}>
                  {Image?.mime ? null : <Image source={require('../../assets/purple_gallery.png')} style={{ height: 26, width: 26, marginLeft: 7 }} />}
                  <Text style={styles.uploadPictureText}>
                    {Image?.mime ? Image?.path : 'Upload Profile'}
                  </Text>
                  {Image?.mime ? null : <Image source={{ uri: ownerprofileData?.profile_image }} style={{ height: 26, width: 26, marginLeft: 7 }} />}
                </TouchableOpacity> */}


                <MyButtons
                  title="Save Changes"
                  height={60}
                  width={'100%'}
                  borderRadius={5}
                  fontWeight={'700'}
                  alignSelf="center"
                  press={() => {
                    UpdatePressed()
                    // props.navigation.navigate('');
                  }}
                  marginHorizontal={20}
                  titlecolor={Mycolors.BG_COLOR}
                  backgroundColor={Mycolors.Purple}
                  marginVertical={10}
                />
                <MyButtons
                  title="Clear All"
                  height={60}
                  width={'100%'}
                  borderRadius={5}
                  fontWeight={'700'}
                  alignSelf="center"
                  press={() => {
                    // props.navigation.navigate('');
                    clearAll()
                  }}
                  marginHorizontal={20}
                  titlecolor={Mycolors.BG_COLOR}
                  backgroundColor={Mycolors.DARK_BLUE}
                  marginVertical={10}
                />


              </View>

              {/* <View style={{marginTop: 15, zIndex: -111}}>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    fontSize: 12,
                    marginLeft: 10,
                    color: Mycolors.TEXT_COLOR,
                  }}>
                  Select Nationality
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    marginLeft: 5,
                    marginVertical: 5,
                    color: 'red',
                  }}>
                  *
                </Text>
              </View>
              <View
                style={{width: '100%', height: 50, marginTop: 5, zIndex: -111}}>
                <DropDownPicker
                  open={nationalityOpen}
                  value={nationalityvalue}
                  items={nationalitydate}
                  listMode="MODAL"
                  searchable={true}
                  setOpen={() => {
                    setnationalityOpen(!nationalityOpen);
                  }}
                  setValue={v => {
                    setnationalityvalue(v);
                  }}
                  setItems={i => {
                    setnationalitydate(i);
                  }}
                  placeholder="Select Nationality"
                  onChangeValue={value => {
                    setnationalityvalue(value);
                  }}
                  placeholderStyle={{
                    color: Mycolors.GrayColor,
                    fontSize: 12,
                    // fontWeight: "bold"
                  }}
                  textStyle={{
                    color: Mycolors.TEXT_COLOR,
                  }}
                  style={{
                    borderColor: 'transparent',
                    backgroundColor: Mycolors.LogininputBox,
                  }}
                  containerStyle={{
                    borderColor: 'red',
                  }}
                  disabledStyle={{
                    opacity: 0.5,
                  }}
                  dropDownContainerStyle={{
                    // backgroundColor: Mycolors.BG_COLOR =='#fff' ? '#fff' :"rgb(50,50,50)",
                    borderColor: Mycolors.TEXT_COLOR,
                    borderWidth: 0.2,
                    shadowColor: '#000000',
                    shadowOffset: {
                      width: 0,
                      height: 3,
                    },
                    shadowRadius: 5,
                    shadowOpacity: 1.0,
                    elevation: 5,
                    zIndex: 999,
                  }}
                />
              </View>
            </View>

            <View style={{marginTop: 10, zIndex: -999}}>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    fontSize: 12,
                    marginLeft: 12,
                    marginVertical: 5,
                    color: Mycolors.TEXT_COLOR,
                  }}>
                  DOB
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    marginLeft: 5,
                    marginVertical: 5,
                    color: 'red',
                  }}>
                  *
                </Text>
              </View>
              {Platform.OS == 'ios' ? (
                <DatePicker
                  customStyles={{
                    dateInput: {
                      borderColor: 'transparent',
                      position: 'absolute',
                      left: 0,
                    },
                    dateText: {color: '#000'},
                    zIndex: 999,
                  }}
                  androidMode={'spinner'}
                  readOnly={true}
                  style={[styles.signupinput]}
                  date={dob}
                  mode="date"
                  placeholder={'Select date'}
                  maximumDate={new Date()}
                  format="YYYY-MM-DD"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  showIcon={false}
                  onDateChange={date => {
                    setdob(date);
                  }}
                />
              ) : (
                <>
                  {isDatePickerVisible ? (
                    <DateTimePickerModal
                      isVisible={isDatePickerVisible}
                      mode="date"
                      onConfirm={handleConfirm}
                      onCancel={hideDatePicker}
                    />
                  ) : (
                    <TouchableOpacity
                      style={[styles.signupinput, {justifyContent: 'center'}]}
                      onPress={() => {
                        // setShowstart(true)
                        setDatePickerVisibility(true);
                      }}>
                      <Text style={{fontFamily:FONTFAMILY,color: '#000'}}>
                        {displaydateformates(new Date(dob))}
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View> */}
            </KeyboardAwareScrollView>
          </View>
        </ScrollView>
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
                      marginVertical: 15,
                    }}>
                    Great!
                  </Text>
                  <Text
                    style={{
                      color: Mycolors.Black,
                      fontSize: 14,
                      fontWeight: '400',
                      textAlign: 'center',
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


            <Text style={{fontFamily:FONTFAMILY, fontSize: 17, color: 'black', fontWeight: '600' }}>Upload</Text>
            <Text style={{fontFamily:FONTFAMILY, fontSize: 17, color: 'grey', }}>Please Upload Your Profile Image </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', }}>
              <TouchableOpacity style={{ padding: 20, borderWidth: 1, borderStyle: 'dotted', borderColor: '#4556A6' }}
                onPress={() => { openLibrary() }}
              >
                <Image
                  source={require('../../assets/gallery.png')}
                  style={{ width: 40, height: 40, alignSelf: 'center' }}
                />
                <Text style={{fontFamily:FONTFAMILY, textAlign: 'center', color: '#4556A6' }}>Open Liberary</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{ padding: 20, borderWidth: 1, borderStyle: 'dotted', borderColor: '#B357C3' }}
                onPress={() => { Platform.OS == 'ios' ? opencamera() : requestCameraPermission() }}
              >
                <Image
                  source={require('../../assets/camera.png')}
                  style={{ width: 40, height: 40, alignSelf: 'center' }}
                />
                <Text style={{fontFamily:FONTFAMILY, textAlign: 'center', color: '#B357C3' }}>Open Camera</Text>
              </TouchableOpacity>
            </View>



          </View>
        </Modal>
        {My_Alert ? (
          <MyAlert
            sms={alert_sms}
            okPress={() => {
              setMy_Alert(false);
            }}
          />
        ) : null}
        {loading ? <Loader /> : null}
      </SafeAreaView>
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'rgba(255,200,0,0.5)',
  },
  textStyle: {
    fontSize: 13,
    alignSelf: 'center',
    // color: Mycolors.ORANGE,
  },

  signupinput: {
    height: 50,
    width: '100%',
    fontSize: 12,
    borderColor: 'transparent',
    borderWidth: 1,
    borderRadius: 10,
    color: Mycolors.TEXT_COLOR,
    paddingLeft: 12,
    paddingRight: 10,
    backgroundColor: Mycolors.LogininputBox,
  },
  uploadPictureView: {
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Mycolors.Purple,
    borderRadius: 0.5,
    borderStyle: 'dashed',
    paddingHorizontal: 10,
    zIndex: 0,
    width: '100%',
    height: 60
  },
  uploadPictureText: {
    color: Mycolors.GREY,
    fontSize: 14,
    padding: 10,
    paddingVertical: 15,
    // marginLeft: -132
  },
});
export default EditProfile;
