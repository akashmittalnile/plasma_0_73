import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  SafeAreaView,
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
import {
  saveUserResult,
  onLogoutUser,
  saveUserToken,
} from '../../redux/actions/user_action';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  all_salon,
  add_booking,
  changePass,
  user_profile,
  home,
  requestGetApi,
  requestPostApi,
  imgUrl,
  requestGetWithoutBody,
} from '../../WebApi/Service';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../../WebApi/Loader';
import Toast from 'react-native-simple-toast';
import MyAlert from '../../component/MyAlert';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import HomeHeader from '../../component/HomeHeader';
import HomeHeader2 from '../../component/HomeHeader2';
import TextInputArea from '../../component/TextInputArea';
import { MyIcon } from '../../utility/index';
import TextInputArea2 from '../../component/TextInputArea2';
import useAPI from '../../utility/hooks/useAPI';
import DropdownComp from '../../component/DropdownComp';
import { removeNull } from '../../utility/MyFunctions';
import NoDataFound from '../../component/NoDataFound';
import { FONTFAMILY, FONTFAMILYSEMIBOLD } from '../../utility/fonts';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
const SipingAddress = props => {
  const dispatch = useDispatch();
  // const [loading, setLoading] = useState(false);

  const [modleSaveCard, SetModleSaveCard] = useState(false);
  const [modleShippingAddress, SetModleShippingAddress] = useState(false);
  const [pass, setpass] = useState('');

  const [My_Alert, setMy_Alert] = useState(false);
  const [alert_sms, setalert_sms] = useState('');
  const [cardList, setCardList] = useState([
    {
      id: '1',
      img: require('../../assets/Mastercard_logo.png'),
      cardNum: '1111',
      expires: '24/22',
    },
    {
      id: '2',
      img: require('../../assets/visacard_logo.png'),
      cardNum: '5967',
      expires: '04/27',
    },
  ]);

  const [shippingAddress, setShippingAddress] = useState([
    //   {
    //   "id": 4,
    //   "user_id": "11",
    //   "first_name": "Dishant",
    //   "middle_name": null,
    //   "last_name": "Gupta",
    //   "email": "dishant@gmail.com",
    //   "phone": "7496565446",
    //   "company_name": "Nile",
    //   "address_line_1": "Sector 22",
    //   "address_line_2": null,
    //   "latitude": "12.563526",
    //   "longitude": "74.546655",
    //   "city": "2265",
    //   "state": "21",
    //   "country": "101",
    //   "zip_code": "465468",
    //   "address_type": "residential",
    //   "shipping_type": "shipping",
    //   "default_address": "1",
    //   "created_at": "2024-07-17T10:54:42.000000Z",
    //   "updated_at": "2024-07-17T10:54:42.000000Z"
    // }
  ]);

  const [selectedAddress, setselectedAddress] = useState(null)

  const { loading, getAPI, postAPI, deleteAPI } = useAPI()


  // Shipping Addresses State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [cityId, setCityId] = useState('');
  const [stateId, setStateId] = useState('');
  const [countryId, setCountryId] = useState('');

  const [countries, setcountries] = useState([])
  const [countryName, setcountryName] = useState(null);
  const [states, setstates] = useState([])
  const [stateName, setstateName] = useState(null);
  const [cities, setcities] = useState([])
  const [cityName, setcityName] = useState(null);

  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [addressType, setAddressType] = useState('residential');
  const [isDefault, setIsDefault] = useState(false);
  const [billingCheckbox, setBillingCheckbox] = useState(true);
  const [billingFirstName, setBillingFirstName] = useState('');
  const [billingLastName, setBillingLastName] = useState('');
  const [billingEmail, setBillingEmail] = useState('');
  const [billingPhone, setBillingPhone] = useState('');
  const [billingAddressLine1, setBillingAddressLine1] = useState('');
  const [billingLatitude, setBillingLatitude] = useState('');
  const [billingLongitude, setBillingLongitude] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingState, setBillingState] = useState('');
  const [billingCountry, setBillingCountry] = useState('');
  const [billingZipcode, setBillingZipcode] = useState('');

  const [visible, setvisible] = useState(false)

  function onClose() {
    setvisible(!visible)
  }

  async function getAddress() {
    console.log("getAddress");
    const resp = await getAPI({ endPoint: "address" })

    if (!resp) {
      setShippingAddress([])
      setselectedAddress(null)
      return
    }

    console.log({ resp: resp?.data?.data });

    setShippingAddress(resp?.data?.data)

    const default_address = resp?.data?.data?.find((item) => item?.default_address == 1)

    if (default_address)
      setselectedAddress(default_address)
    else
      setselectedAddress(null)


  }


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

  async function deleteAddress(id) {

    await deleteAPI({ endPoint: 'address/' + id })
    getAddress()

  }

  const validateBillingDetails = () => {
    // Check if any of the required fields are empty
    if (
      billingCheckbox === '' ||
      billingFirstName === '' ||
      billingLastName === '' ||
      billingEmail === '' ||
      billingPhone === '' ||
      billingAddressLine1 === ''
    ) {
      return false; // Return false if any field is empty
    }

    return true; // Return true if all fields are filled
  };

  async function saveAddress() {

    onClose()

    if (!billingCheckbox) {
      if (!validateBillingDetails()) {

        console.log("validateBillingDetailsno");

        return

      }
      else {
        console.log("validateBillingDetailsyes");
      }
    }

    // return

    const payload = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: phone,
      company_name: companyName,
      address_line_1: addressLine1,
      // city_id: cityId,
      // state_id: stateId,
      // country_id: countryId,

      // city_id: cityName?.id,
      // state_id: stateName?.id,
      // country_id: countryName?.id,
      // latitude: latitude,
      // longitude: longitude,
      zipcode: zipcode,
      address_type: addressType,
      is_default: isDefault ? 1 : 0,
      billing_checkbox: billingCheckbox ? 1 : 0,
      billing_first_name: billingFirstName,
      billing_last_name: billingLastName,
      billing_email: billingEmail,
      billing_phone: billingPhone,
      billing_address_line_1: billingAddressLine1,
      // billing_latitude: billingLatitude,
      // billing_longitude: billingLongitude,
      billing_city_id: billingCity?.id,
      billing_state_id: billingState?.id,
      billing_country_id: billingCountry?.id,
      billing_zipcode: billingZipcode,
    }

    cityName?.id && (payload["city_id"] = cityName?.id)
    stateName?.id && (payload["state_id"] = stateName?.id)
    countryName?.id && (payload["country_id"] = countryName?.id)

    console.log({ payload });
    // return

    const resp = await postAPI({ endPoint: "address", bodyJSON: payload })

    if (!resp) {
      return
    }
    getAddress()


  }

  useEffect(() => {

    getAddress()

  }, []);

  async function mark_as_default(id) {

    const res = await postAPI({
      endPoint: "mark-as-default", bodyJSON: {
        id: id
      }
    })

    await getAddress()

  }




  const DropdownStyleProps = {

    placeholderTextColor: '#4F5168',
    TextInputWidth: '100%',
    BorderColor: Mycolors.TEXT_BORDER_LIGHt_PURPLE,
    hasViewBorder: true,
  }


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


  return (
    <LinearGradient colors={['#300076', '#53045F']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <HomeHeader2
          height={60}
          // paddingHorizontal={15}
          title={'Shipping Address'}
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
        <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
          <View
            style={{
              justifyContent: 'center',
              width: '90%',
              alignSelf: 'center',
              marginTop: 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text  style={{fontFamily:FONTFAMILYSEMIBOLD,
                  color: Mycolors.BG_COLOR,
                  fontWeight: '500',
                  fontSize: 18,
                }}>
                Saved Address
              </Text>
              <TouchableOpacity
                onPress={() => setvisible(true)}
                style={{
                  height: 30,
                  width: '19%',
                  backgroundColor: '#B357C3',
                  borderRadius: 7,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{ fontSize: 13, color: '#fff', textAlign: 'center' }}>
                  Add New
                </Text>
              </TouchableOpacity>
            </View>

            {shippingAddress.map((item, index) => {

              const {
                id,
                user_id,
                first_name,
                middle_name,
                last_name,
                email,
                phone,
                company_name,
                address_line_1,
                address_line_2,
                latitude,
                longitude,
                city,
                state,
                country,
                zip_code,
                address_type,
                shipping_type,
                default_address,
                created_at,
                updated_at
              } = item;



              return (
                <>
                  <TouchableOpacity
                    onPress={() => { mark_as_default(id) }}
                    key={id || index}
                    style={{
                      width: '100%',
                      borderColor: Mycolors.GrayColor,
                      borderWidth: 0.02,
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 17,
                      paddingHorizontal: 17,
                      borderRadius: 7,
                      backgroundColor: '#fff',
                      marginTop: 15,
                      //   justifyContent: 'space-between',
                    }}
                  >

                    <View style={{}}>
                      <TouchableOpacity onPress={() => mark_as_default(id)} style={{ height: 30, width: 30, borderRadius: 20, borderWidth: 1, borderColor: '#B357C3', justifyContent: 'center', marginRight: 10 }}>
                        {default_address == 1 && <View style={{ width: 20, height: 20, borderRadius: 15, backgroundColor: '#B357C3', alignSelf: 'center' }} />}
                      </TouchableOpacity>

                    </View>
                    <View style={{ marginLeft: 10, width: '68%' }}>
                      <Text
                        style={{fontFamily:FONTFAMILYSEMIBOLD,
                          color: Mycolors.TEXT_COLOR,
                          fontWeight: '500',
                          fontSize: 16,
                        }}>
                        {address_type}
                      </Text>

                      <Text
                        style={{fontFamily:FONTFAMILYSEMIBOLD,
                          color: Mycolors.GrayColor,
                          fontWeight: '300',
                          fontSize: 14,
                          top: 2,
                        }}>
                        {removeNull(`${address_line_1}, ${address_line_2}, ${city}, ${state}, ${country}, ${zip_code}`)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={{ height: 25, width: 25, marginLeft: 20 }}
                      onPress={() => {

                        deleteAddress(id)
                      }}>
                      <Image
                        style={{ height: '100%', width: '100%' }}
                        source={require('../../assets/trash_icon.png')}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                </>
              );
            })}



          </View>

          {shippingAddress?.length != 0 && <TouchableOpacity style={{ width: '90%', height: 50, backgroundColor: "#B357C3", borderRadius: 7, marginTop: 20, justifyContent: "center", alignSelf: 'center' }}
            onPress={() => {
              if (!selectedAddress) {
                Toast.show("Select an Address!")
                return
              }
              props.navigation.goBack();
              // props.navigation.navigate('ProductPaymentMethod', { address: selectedAddress?.id }) 

            }}>
            <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 14, color: "#fff", textAlign: "center", fontWeight: "400" }}>OK</Text>
          </TouchableOpacity>


          }

          {(shippingAddress.length == 0 && !modleSaveCard) && <View style={{ marginTop: '55%', }}><NoDataFound msg='No Address Found' styles={{}} /></View>}
        </ScrollView>


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

      <Modal
        visible={visible}
        animationType="slide"
        onRequestClose={onClose}
      >
        <TouchableOpacity onPress={onClose} style={{ width: dimensions.SCREEN_WIDTH, height: dimensions.SCREEN_HEIGHT, backgroundColor: 'rgba(0,0,0,0.6)', alignSelf: 'center' }} />
        <SafeAreaView />
        <View style={{
          width: '100%', height: dimensions.SCREEN_HEIGHT / 1.5, borderRadius: 15, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', padding: 10, position: 'absolute'
        }}>
          <KeyboardAwareScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
            <Text style={styles.header}>Add New Address</Text>

            <TextInputArea
              value={firstName}
              setValue={setFirstName}
              placeholder="First Name"
            />
            <TextInputArea
              value={lastName}
              setValue={setLastName}
              placeholder="Last Name"
              hasViewBorder
            />

            <TextInputArea
              value={email}
              setValue={setEmail}
              placeholder="Email"
              keyboardType="email-address"
            />
            <TextInputArea
              value={phone}
              setValue={(val) => {
                setPhone(formatPhoneNumber(val))
              }}
              placeholder="Phone"
              keyboardType="phone-pad"
              maxLength={10}
            />
            <TextInputArea
              value={companyName}
              setValue={setCompanyName}
              placeholder="Company Name"
            />
            <TextInputArea
              value={addressLine1}
              setValue={setAddressLine1}
              placeholder="Address Line 1"
            />
            <DropdownComp
              {...DropdownStyleProps}
              value={countryName?.label}
              TextInputWidth={'91%'}
              placeholder='Select a Country'
              onSelect={(item, index) => {
                console.log(item, index);
                setcountryName(item)
                getAllDropDownData(`states?country_id=${item?.id}`, setstates)
                setstateName(null)
                setcityName(null)
              }}
              items={countries}
              renderListValues={(item, index) => item?.label}
            />

            <DropdownComp
              {...DropdownStyleProps}
              value={stateName?.label}
              TextInputWidth={'91%'}
              placeholder='Select a State'
              onSelect={(item, index) => {
                console.log(item, index);
                setstateName(item)
                getAllDropDownData(`cities?state_id=${item?.id}`, setcities)
                setcityName(null)
              }}
              items={states}
              renderListValues={(item, index) => item?.label}
            />

            <DropdownComp
              {...DropdownStyleProps}
              value={cityName?.label}
              TextInputWidth={'91%'}
              placeholder='Select a City'
              onSelect={(item, index) => {
                console.log(item, index);
                setcityName(item)
              }}
              items={cities}
              renderListValues={(item, index) => item?.label}
            />
            {/* <TextInputArea
              value={cityId}
              setValue={setCityId}
              placeholder="City ID"
            />
            <TextInputArea
              value={stateId}
              setValue={setStateId}
              placeholder="State ID"
            />
            <TextInputArea
              value={countryId}
              setValue={setCountryId}
              placeholder="Country ID"
            /> */}
            {/* <TextInputArea
            value={latitude}
            setValue={setLatitude}
            placeholder="Latitude"
            keyboardType="decimal-pad"
          />
          <TextInputArea
            value={longitude}
            setValue={setLongitude}
            placeholder="Longitude"
            keyboardType="decimal-pad"
          /> */}
            <TextInputArea
              value={zipcode}
              setValue={setZipcode}
              placeholder="Zipcode"
              keyboardType="numeric"
            />
            {/* <TextInputArea
              value={addressType}
              setValue={setAddressType}
              placeholder="Address Type"
            /> */}
            <TouchableOpacity onPress={() => {
              setIsDefault((state) => !state)
            }} style={{ width: dimensions.SCREEN_WIDTH / 1.29, backgroundColor: 'transparent', borderRadius: 5, flexDirection: 'row', alignItems: 'center', marginLeft: 5, marginTop: 5 }}>
              <View onPress={() => {



              }} style={{ height: 20, width: 20, borderRadius: 5, borderWidth: 1, borderColor: '#B357C3', justifyContent: 'center', marginRight: 3, backgroundColor: isDefault ? '#B357C3' : 'white' }}>
                {isDefault && <>
                 {/* <View style={{ width: 10, height: 10, borderRadius: 15, backgroundColor: '#B357C3', alignSelf: 'center' }} /> */}

                 <Text style={{fontFamily:FONTFAMILY, color: 'white', fontWeight: 'bold', left: -0.8 }}> ✓</Text>
                </>
                }
              </View>
              <Text style={{fontFamily:FONTFAMILY, color: 'grey' }}> Make Address As Default</Text>
            </TouchableOpacity>
            <View onPress={() => {
              // setBillingCheckbox((state)=>!state)
            }} style={{ width: dimensions.SCREEN_WIDTH / 1.29, backgroundColor: 'transparent', borderRadius: 5, flexDirection: 'row', alignItems: 'center', marginLeft: 5, marginTop: 10 }}>
              <TouchableOpacity onPress={() => {
                setAddressType('residential')


              }} style={{ height: 20, width: 20, borderRadius: 20, borderWidth: 1, borderColor: '#B357C3', justifyContent: 'center', marginRight: 3 }}>
                {addressType == "residential" && <View style={{ width: 10, height: 10, borderRadius: 15, backgroundColor: '#B357C3', alignSelf: 'center' }} />
                }
              </TouchableOpacity>
              <Text style={{fontFamily:FONTFAMILY, color: 'grey' }}> Residential</Text>

              <TouchableOpacity onPress={() => {
                setAddressType('commercial')
              }} style={{ height: 20, width: 20, borderRadius: 20, borderWidth: 1, borderColor: '#B357C3', justifyContent: 'center', marginRight: 3, marginLeft: 20 }}>
                {addressType == 'commercial' && <View style={{ width: 10, height: 10, borderRadius: 15, backgroundColor: '#B357C3', alignSelf: 'center' }} />
                }
              </TouchableOpacity>
              <Text style={{fontFamily:FONTFAMILY, color: 'grey' }}> Commercial</Text>

            </View>

            {/* <TextInputArea
              value={isDefault}
              setValue={setIsDefault}
              placeholder="Is Default"
              keyboardType="numeric"
            /> */}
            {/* <TextInputArea
              value={billingCheckbox}
              setValue={setBillingCheckbox}
              placeholder="Billing Checkbox"
              keyboardType="numeric"
            /> */}
            <TouchableOpacity onPress={() => {
              setBillingCheckbox((state) => !state)
            }} style={{ width: dimensions.SCREEN_WIDTH / 1.29, backgroundColor: 'transparent', borderRadius: 5, flexDirection: 'row', alignItems: 'center', marginLeft: 5, marginTop: 10 }}>
              <View onPress={() => {



              }} style={{ height: 20, width: 20, borderRadius: 5, borderWidth: 1, borderColor: '#B357C3', justifyContent: 'center', marginRight: 3, backgroundColor: billingCheckbox ? '#B357C3' : 'white'}}>
                {billingCheckbox && <>
                 {/* <View style={{ width: 10, height: 10, borderRadius: 15, backgroundColor: '#B357C3', alignSelf: 'center' }} /> */}

                 <Text style={{fontFamily:FONTFAMILY, color: 'white', fontWeight: 'bold', left: -0.8 }}> ✓</Text>
                </>
                }
              </View>
              <Text style={{fontFamily:FONTFAMILY, color: 'grey' }}> Billing Address Same As Shipping Address</Text>
            </TouchableOpacity>

            {!billingCheckbox && <>
              <Text style={styles.subHeader}>Billing Address</Text>
              <TextInputArea
                value={billingFirstName}
                setValue={setBillingFirstName}
                placeholder="Billing First Name"
              />
              <TextInputArea
                value={billingLastName}
                setValue={setBillingLastName}
                placeholder="Billing Last Name"
              />
              <TextInputArea
                value={billingEmail}
                setValue={setBillingEmail}
                placeholder="Billing Email"
                keyboardType="email-address"
              />
              <TextInputArea
                value={billingPhone}
                setValue={setBillingPhone}
                placeholder="Billing Phone"
                keyboardType="phone-pad"
              />
              <TextInputArea
                value={billingAddressLine1}
                setValue={setBillingAddressLine1}
                placeholder="Billing Address Line 1"
              />

              <DropdownComp
                {...DropdownStyleProps}
                value={billingCountry?.label}
                TextInputWidth={'91%'}
                placeholder='Select a Country'
                onSelect={(item, index) => {
                  console.log(item, index);
                  setBillingCountry(item)
                  getAllDropDownData(`states?country_id=${item?.id}`, setstates)

                }}
                items={countries}
                renderListValues={(item, index) => item?.label}
              />

              <DropdownComp
                {...DropdownStyleProps}
                value={billingState?.label}
                TextInputWidth={'91%'}
                placeholder='Select a State'
                onSelect={(item, index) => {
                  console.log(item, index);
                  setBillingState(item)
                  getAllDropDownData(`cities?state_id=${item?.id}`, setcities)

                }}
                items={states}
                renderListValues={(item, index) => item?.label}
              />

              <DropdownComp
                {...DropdownStyleProps}
                value={billingCity?.label}
                TextInputWidth={'91%'}
                placeholder='Select a City'
                onSelect={(item, index) => {
                  console.log(item, index);
                  setBillingCity(item)
                }}
                items={cities}
                renderListValues={(item, index) => item?.label}
              />
              {/* <TextInputArea
            value={billingLatitude}
            setValue={setBillingLatitude}
            placeholder="Billing Latitude"
            keyboardType="decimal-pad"
          />
          <TextInputArea
            value={billingLongitude}
            setValue={setBillingLongitude}
            placeholder="Billing Longitude"
            keyboardType="decimal-pad"
          /> */}
              {/* <TextInputArea
              value={billingCityId}
              setValue={setBillingCityId}
              placeholder="Billing City ID"
            />
            <TextInputArea
              // placeholderTextColor={'#4F5168'}
              hasViewBorder
              value={billingStateId}
              setValue={setBillingStateId}
              placeholder="Billing State ID"
            />
            <TextInputArea
              value={billingCountryId}
              setValue={setBillingCountryId}
              placeholder="Billing Country ID"
            /> */}




              <TextInputArea
                value={billingZipcode}
                setValue={setBillingZipcode}
                placeholder="Billing Zipcode"
                keyboardType="numeric"
              />
            </>
            }

            {/* <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Save Address</Text>
          </TouchableOpacity> */}

          </KeyboardAwareScrollView>
          <TouchableOpacity style={{ width: '90%', height: 50, backgroundColor: "#B357C3", borderRadius: 7, marginTop: 20, justifyContent: "center", alignSelf: 'center' }}
            onPress={() => {

              saveAddress()

            }}>
            <Text style={{fontFamily:FONTFAMILY, fontSize: 14, color: "#fff", textAlign: "center", fontWeight: "400" }}>Save Address</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 20,
    // backgroundColor: "white",
    // flexGrow: 1,
    width: '100%'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Mycolors.TEXT_COLOR,
    marginTop: 10, fontFamily:FONTFAMILY
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: Mycolors.TEXT_COLOR, fontFamily:FONTFAMILY
  },
  button: {
    backgroundColor: Mycolors.BUTTON_COLOR,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default SipingAddress;
