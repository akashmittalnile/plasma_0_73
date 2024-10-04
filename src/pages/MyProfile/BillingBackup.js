import React, {useState, useEffect} from 'react';
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
import {dimensions, Mycolors} from '../../utility/Mycolors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  saveUserResult,
  onLogoutUser,
  saveUserToken,
} from '../../redux/actions/user_action';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  all_salon,
  add_booking,
  changePass,
  user_profile,
  home,
  requestGetApi,
  requestPostApi,
  imgUrl,
} from '../../WebApi/Service';
import {useSelector, useDispatch} from 'react-redux';
import Loader from '../../WebApi/Loader';
import Toast from 'react-native-simple-toast';
import MyAlert from '../../component/MyAlert';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import HomeHeader from '../../component/HomeHeader';
import HomeHeader2 from '../../component/HomeHeader2';
import TextInputArea from '../../component/TextInputArea';
import {MyIcon} from '../../utility/index';
import TextInputArea2 from '../../component/TextInputArea2';
import { FONTFAMILY } from '../../utility/fonts';

const Billing = props => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

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
    {
      id: '1',
      check: true,
      type: 'Home',
      address: '5331 Rexford Court, Montgomery AL 36116',
    },
    {
      id: '2',
      check: false,
      type: 'Office',
      address: '5331 Rexford Court, Montgomery AL 36116',
    },
  ]);

  useEffect(() => {}, []);

  const resetStacks = page => {
    props.navigation.reset({
      index: 0,
      routes: [{name: page}],
      params: {resentotp: false},
    });
  };

  const logoutPressed = () => {
    AsyncStorage.clear();
    dispatch(onLogoutUser());
  };

  const Mydesign = (img, lbl, press) => {
    return (
      <View style={{height: 60, justifyContent: 'center'}}>
        <TouchableOpacity
          style={{flexDirection: 'row', alignItems: 'center'}}
          onPress={press}>
          <Image
            source={img}
            style={{width: 20, height: 21, alignSelf: 'center'}}></Image>
          <Text
            style={{
              color: Mycolors.TEXT_COLOR,
              marginLeft: 23,
              fontWeight: '500',
              fontSize: 16, fontFamily:FONTFAMILY
            }}>
            {lbl}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <LinearGradient colors={['#300076', '#53045F']} style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <HomeHeader2
          height={60}
          // paddingHorizontal={15}
          title={'Billing'}
          press1={() => {
            props.navigation.goBack();
          }}
          img1={require('../../assets/arrow_right_black.png')}
          img1width={25}
          img1height={25}
          press2={() => {props.navigation.navigate('Notification')}}
          img2={require('../../assets/notification.png')}
          img2width={25}
          img2height={25}
          press3={() => {}}
          img3={require('../../assets/shoppingbag.png')}
          img3width={25}
          img3height={25}
          backgroundColor={'transparent'}
        />
        <ScrollView>
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
              <Text  style={{fontFamily:FONTFAMILY,
                  color: Mycolors.BG_COLOR,
                  fontWeight: '500',
                  fontSize: 18,
                }}>
                Saved Card
              </Text>
              <TouchableOpacity
                onPress={() => SetModleSaveCard(true)}
                style={{
                  height: 30,
                  width: '19%',
                  backgroundColor: '#B357C3',
                  borderRadius: 7,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{fontSize: 13, color: '#fff', textAlign: 'center', fontFamily:FONTFAMILY}}>
                  Add New
                </Text>
              </TouchableOpacity>
            </View>

            {cardList.map((item, index) => {
              return (
                <>
                  <TouchableOpacity
                    key={index}
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
                      justifyContent: 'space-between',
                    }}
                    onPress={() => {}}>
                    <View style={{width: 51, height: 20}}>
                      <Image
                        source={item.img}
                        style={{
                          width: '100%',
                          height: '100%',
                          alignSelf: 'center',
                          borderRadius: 5,
                          resizeMode: 'stretch',
                        }}/>
                    </View>
                    <View style={{marginLeft: -90}}>
                      <Text
                        style={{fontFamily:FONTFAMILY,
                          color: Mycolors.TEXT_COLOR,
                          fontWeight: '500',
                          fontSize: 16,
                        }}>
                        **** **** **** {item.cardNum}
                      </Text>
                      <Text
                        style={{fontFamily:FONTFAMILY,
                          color: Mycolors.GrayColor,
                          fontWeight: '300',
                          fontSize: 14,
                          top: 2,
                        }}>
                        Expires {item.expires}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={{height: 25, width: 25}}
                      onPress={() => {}}>
                      <Image
                        style={{height: '100%', width: '100%'}}
                        source={require('../../assets/trash_icon.png')}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                </>
              );
            })}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 20,
              }}>
              <Text  style={{fontFamily:FONTFAMILY,
                  color: Mycolors.BG_COLOR,
                  fontWeight: '500',
                  fontSize: 18,
                }}>
                Saved Shipping Address
              </Text>
              <TouchableOpacity
                onPress={() => SetModleShippingAddress(true)}
                style={{
                  height: 30,
                  width: '19%',
                  backgroundColor: '#B357C3',
                  borderRadius: 7,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{fontSize: 13, color: '#fff', textAlign: 'center', fontFamily:FONTFAMILY}}>
                  Add New
                </Text>
              </TouchableOpacity>
            </View>
            {shippingAddress.map((item, index) => {
              return (
                <>
                  <TouchableOpacity
                    key={index}
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
                      justifyContent: 'space-between',
                    }}
                    onPress={() => {}}>
                    <View style={{width: 51, height: 35}}>
                      {item?.check == true ? (
                        <MyIcon.MaterialIcons
                          name="radio-button-on"
                          size={30}
                          color={Mycolors.Purple}
                        />
                      ) : (
                        <MyIcon.MaterialIcons
                          name="radio-button-off"
                          size={30}
                          color={'#E0E0E0'}
                        />
                      )}
                    </View>
                    <View style={{marginLeft: -10, width: '80%'}}>
                      <Text
                        style={{fontFamily:FONTFAMILY,
                          color: Mycolors.TEXT_COLOR,
                          fontWeight: '500',
                          fontSize: 16,
                        }}>
                        {item.type}
                      </Text>

                      <Text
                        numberOfLines={2}
                        style={{
                          color: Mycolors.GrayColor,
                          fontWeight: '300',
                          fontSize: 14,
                          top: 2,
                        }}>
                        {item.address}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={{height: 25, width: 25}}
                      onPress={() => {}}>
                      <Image
                        style={{height: '100%', width: '100%'}}
                        source={require('../../assets/trash_icon.png')}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                </>
              );
            })}
          </View>

          {/* Add Saved cards modal*/}
          <Modal
            isVisible={modleSaveCard}
            swipeDirection="down"
            onSwipeComplete={e => {
              SetModleSaveCard(false);
            }}
            coverScreen={true}
            backdropColor="transparent"
            style={{
              flex: 1,
              justifyContent: 'center',
              margin: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}>
            <View
              style={{
                height: 'auto',
                backgroundColor: Mycolors.BG_COLOR,
                borderRadius: 10,
                padding: 20,
                margin: 0,
                bottom: 0,
                marginHorizontal: 20,
              }}>
              <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.mainView}>
                  <View
                    style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text
                      style={{
                        color: Mycolors.Black,
                        fontSize: 20,
                        fontWeight: '400',
                        marginVertical: 10,
                      }}>
                      Add New Card
                    </Text>
                  </View>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                    }}>
                    <TextInputArea2
                      placeholder="XXXX  XXXX  XXXX  9899"
                      placeholderTextColor={'#4F5168'}
                      keyboardType={'numeric'}
                      maxLength={16}
                      //   secureTextEntry={true}
                      required={true}
                      value={pass}
                      hasViewBorder
                      setValue={setpass}
                      icon={true}
                      img={require('../../assets/purple_card_icon.png')}
                    />

                    <TextInputArea2
                      placeholder="Card Holder Name"
                      placeholderTextColor={'#4F5168'}
                      maxLength={16}
                      //   secureTextEntry={true}
                      required={true}
                      value={pass}
                      hasViewBorder
                      setValue={setpass}
                      icon={true}
                      img={require('../../assets/_purple_profile_icon.png')}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                      }}>
                      <TextInputArea2
                        placeholder="MM/YY"
                        placeholderTextColor={'#4F5168'}
                        keyboardType={'numeric'}
                        maxLength={4}
                        TextInputWidth={'48%'}
                        TextInputwidth1={'80%'}
                        required={true}
                        value={pass}
                        hasViewBorder
                        setValue={setpass}
                        icon={true}
                        img={require('../../assets/_purple_profile_icon.png')}
                      />
                      <TextInputArea2
                        placeholder="CVV"
                        placeholderTextColor={'#4F5168'}
                        keyboardType={'numeric'}
                        maxLength={4}
                        TextInputWidth={'48%'}
                        TextInputwidth1={'80%'}
                        required={true}
                        value={pass}
                        hasViewBorder
                        setValue={setpass}
                        icon={true}
                        img={require('../../assets/_purple_profile_icon.png')}
                      />
                    </View>
                  </View>
                  <View style={{height: 0}} />
                  <MyButtons
                    title="ADD"
                    height={60}
                    width={'100%'}
                    borderRadius={5}
                    fontWeight={'700'}
                    alignSelf="center"
                    press={() => {
                      SetModleSaveCard(false);
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

          {/* Add shipping Address  Modal */}
          <Modal
            isVisible={modleShippingAddress}
            swipeDirection="down"
            onSwipeComplete={e => {
              SetModleShippingAddress(false);
            }}
            coverScreen={true}
            backdropColor="transparent"
            style={{
              flex: 1,
              justifyContent: 'center',
              margin: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}>
            <View
              style={{
                height: 'auto',
                backgroundColor: Mycolors.BG_COLOR,
                borderRadius: 10,
                padding: 20,
                margin: 0,
                bottom: 0,
                marginHorizontal: 20,
              }}>
              <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.mainView}>
                  <View
                    style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text
                      style={{
                        color: Mycolors.Black,
                        fontSize: 20,
                        fontWeight: '400',
                        marginVertical: 10,
                      }}>
                      Add New Address
                    </Text>
                  </View>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                    }}>
                    <TextInputArea2
                      placeholder="Address line 1"
                      placeholderTextColor={'#4F5168'}
                      // keyboardType={'numeric'}
                      maxLength={16}
                      //   secureTextEntry={true}
                      required={true}
                      value={pass}
                      hasViewBorder
                      setValue={setpass}
                      // icon={true}
                      // img={require('../../assets/purple_card_icon.png')}
                    />

                    <TextInputArea2
                      placeholder="Address line 2"
                      placeholderTextColor={'#4F5168'}
                      // keyboardType={'numeric'}
                      maxLength={16}
                      //   secureTextEntry={true}
                      required={true}
                      value={pass}
                      hasViewBorder
                      setValue={setpass}
                      // icon={true}
                      // img={require('../../assets/purple_card_icon.png')}
                    />
                    <TextInputArea2
                      placeholder="Country"
                      placeholderTextColor={'#4F5168'}
                      // keyboardType={'numeric'}
                      maxLength={16}
                      //   secureTextEntry={true}
                      required={true}
                      value={pass}
                      hasViewBorder
                      setValue={setpass}
                      icon={true}
                      img={require('../../assets/purple_arrow-down.png')}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                      }}>
                      <TextInputArea2
                        placeholder="State"
                        placeholderTextColor={'#4F5168'}
                        keyboardType={'numeric'}
                        maxLength={4}
                        TextInputWidth={'48%'}
                        TextInputwidth1={'80%'}
                        required={true}
                        value={pass}
                        hasViewBorder
                        setValue={setpass}
                        icon={true}
                        img={require('../../assets/purple_arrow-down.png')}
                      />
                      <TextInputArea2
                        placeholder="City"
                        placeholderTextColor={'#4F5168'}
                        keyboardType={'numeric'}
                        maxLength={4}
                        TextInputWidth={'48%'}
                        TextInputwidth1={'80%'}
                        required={true}
                        value={pass}
                        hasViewBorder
                        setValue={setpass}
                        icon={true}
                        img={require('../../assets/purple_arrow-down.png')}
                      />
                    </View>
                    <TextInputArea2
                      placeholder="Zip Code"
                      placeholderTextColor={'#4F5168'}
                      // keyboardType={'numeric'}
                      maxLength={16}
                      //   secureTextEntry={true}
                      required={true}
                      value={pass}
                      hasViewBorder
                      setValue={setpass}
                      // icon={true}
                      // img={require('../../assets/purple_card_icon.png')}
                    />
                  </View>
                  {/* <View style={{height: 20}} /> */}
                  <MyButtons
                    title="Save New Address"
                    height={60}
                    width={'100%'}
                    borderRadius={5}
                    fontWeight={'700'}
                    alignSelf="center"
                    press={() => {
                      SetModleShippingAddress(false);
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
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Mycolors.ProfileBG,
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
    paddingLeft: 20,
    paddingRight: 10,
    backgroundColor: Mycolors.LogininputBox,
  },
});
// export default Billing;
