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
import { CardField, useStripe } from '@stripe/stripe-react-native';
import useAPI from '../../utility/hooks/useAPI';
import NoDataFound from '../../component/NoDataFound';
import { FONTFAMILY } from '../../utility/fonts';

const ProductPaymentMethod = props => {
  const dispatch = useDispatch();
  // const [loading, setLoading] = useState(false);

  const [modleSaveCard, SetModleSaveCard] = useState(false);
  const [modleShippingAddress, SetModleShippingAddress] = useState(false);
  const [pass, setpass] = useState('');

  const [My_Alert, setMy_Alert] = useState(false);
  const [alert_sms, setalert_sms] = useState('');
  const [cardList, setCardList] = useState([
    // {
    //   id: '1',
    //   img: require('../../assets/Mastercard_logo.png'),
    //   cardNum: '1111',
    //   expires: '24/22',
    // },
    // {
    //   id: '2',
    //   img: require('../../assets/visacard_logo.png'),
    //   cardNum: '5967',
    //   expires: '04/27',
    // },



  ]);

  const [selectedCard, setselectedCard] = useState(0)

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

  const [cardDetails, setCardDetails] = useState(null);

  const address = props?.route?.params?.address
  console.log({ address });

  const { createToken } = useStripe();

  const { getAPI, loading, postAPI, controlLoader } = useAPI()

  async function getCards() {

    console.log("dddd");


    setCardList((await getAPI({ endPoint: "card-list", toastEnable: false }))?.data || [])


  }

  async function shipping_address() {

    console.log("shipping_address");

    const payload = {
      address_id: address
    }

    if ((await postAPI({ endPoint: 'shipping-address', bodyJSON: payload, toastEnable: false }))) {

      return true

    }

    else {
      return false
    }


  }

  async function addCards({ stripeToken = '' }) {

    const payload = {
      stripeToken: stripeToken
    }

    console.log({ payload });


    if ((await postAPI({ endPoint: 'add-card', bodyJSON: payload }))) {
      getCards()
    }

  }

  async function deleteCards({ card_id = '' }) {

    console.log("deleteCards");

    const payload = {
      card_id: card_id
    }

    console.log("payload", { payload });


    if ((await postAPI({ endPoint: 'delete-card', bodyJSON: payload }))) {
      getCards()
    }


  }

  async function saveOrder() {

    console.log("saveOrder");

    const resp = await postAPI({ endPoint: 'save-order', toastEnable: false })



    if (resp) {

      const payload = {
        order_id: resp?.data?.order_id,
        total_amount: resp?.data?.total_amount,
        card_id: cardList[selectedCard]?.card_id
      }

      await buyNow(payload)
    }






  }

  async function buyNow(payload) {

    console.log("buyNow");



    console.log("payload", { payload });

    const res = await postAPI({ endPoint: 'buy-now', bodyJSON: payload, reloadCart: true })

    // props.navigation.navigate("MyorderStack")
    if (res) {
      SetModleShippingAddress(true)
    } else {

    }


    // if () {
    //   // getCards()
    // }

  }

  useEffect(() => {

    getCards()

  }, []);


  const logoutPressed = () => {
    AsyncStorage.clear();
    dispatch(onLogoutUser());
  };

  const Mydesign = (img, lbl, press) => {
    return (
      <View style={{ height: 60, justifyContent: 'center' }}>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center' }}
          onPress={press}>
          <Image
            source={img}
            style={{ width: 20, height: 21, alignSelf: 'center' }}></Image>
          <Text
            style={{
              color: Mycolors.TEXT_COLOR,
              marginLeft: 23,
              fontWeight: '500',
              fontSize: 16, fontFamily: FONTFAMILY
            }}>
            {lbl}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handlePayPress = async () => {

    console.log(cardDetails);
    if (!cardDetails?.complete) {

      Toast.show('Please enter complete card details');
      return;
    }
    controlLoader(true)
    const { token, error } = await createToken({
      type: 'Card',
      // name: 'Your Customer Name',
    });

    if (error) {
      console.error(error);
      Toast.show(`Error: ${error.message}`);
    } else {
      console.log('Token created successfully:', token);

      addCards({ stripeToken: token?.id })
      // Send token to your backend for processing payment
    }
  };

  return (
    <LinearGradient colors={['#300076', '#53045F']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <HomeHeader2
          height={60}
          // paddingHorizontal={15}
          title={'Select Card'}
          press1={() => {
            props.navigation.goBack();
          }}
          img1={require('../../assets/arrow_right_black.png')}
          img1width={25}
          img1height={25}
          // press2={() => { props.navigation.navigate('Notification') }}
          // img2={require('../../assets/notification.png')}
          // img2width={25}
          // img2height={25}
          // press3={() => { }}
          // img3={require('../../assets/shoppingbag.png')}
          // img3width={25}
          // img3height={25}
          backgroundColor={'transparent'}
        />
        <ScrollView>

          {/* Add new card */}

          {modleSaveCard &&
            <>

              <Text style={{
                fontFamily: FONTFAMILY,
                color: Mycolors.BG_COLOR,
                fontWeight: '500',
                fontSize: 18,
                marginLeft: 24,
                marginBottom: 12,
                marginTop: 5
              }}>
                Add New Card
              </Text>
              <View
                style={{
                  // height: 'auto',
                  backgroundColor: Mycolors.BG_COLOR,
                  borderRadius: 10,
                  padding: 20,
                  // margin: 0,
                  // bottom: 0,
                  marginHorizontal: 20,
                  // position: 'absolute'
                }}>

                <View style={styles.mainView}>
                  {/* <View
                  style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text
                    style={{
                      color: Mycolors.Black,
                      fontSize: 20,
                      fontWeight: '400',
                      marginVertical: 10,
                    }}>
                    Add New Card
                  </Text>
                </View> */}
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                    }}>
                    {/* <TextInputArea2
                      placeholder="XXXX  XXXX"
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
                    /> */}
                    <View style={{ width: dimensions.SCREEN_WIDTH, height: 0, backgroundColor: 'transparent' }} />


                    <View style={{ width: '100%' }}>
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
                    </View>
                  </View>
                  <View style={{ height: 0 }} />

                </View>

              </View>

              <MyButtons
                title="ADD"
                height={60}
                width={'90%'}
                borderRadius={5}
                fontWeight={'700'}
                alignSelf="center"
                press={async () => {
                  SetModleSaveCard(false);
                  await handlePayPress()

                }}
                marginHorizontal={20}
                titlecolor={Mycolors.BG_COLOR}
                backgroundColor={Mycolors.Purple}
                marginVertical={18}
              />
            </>
          }

          <View
            style={{
              justifyContent: 'center',
              width: '90%',
              alignSelf: 'center',
              marginTop: 20,
            }}>
            {!modleSaveCard &&
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={{
                  fontFamily: FONTFAMILY,
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
                    style={{ fontSize: 13, color: '#fff', textAlign: 'center', fontFamily: FONTFAMILY }}>
                    Add New
                  </Text>
                </TouchableOpacity>

              </View>
            }
            {cardList.map((item, index) => {


              if (item?.brand == 'visa') {

              }

              const img = item?.brand == 'visa' ? require('../../assets/visacard_logo.png') : item?.brand == 'mastercard' ? require('../../assets/Mastercard_logo.png') : null

              // require('../../assets/Mastercard_logo.png'),
              // require('../../assets/visacard_logo.png'),


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
                    onPress={() => {

                      setselectedCard(index)

                    }}>

                    <View style={{ flexDirection: 'row' }}>
                      <TouchableOpacity onPress={() => {

                        setselectedCard(index)

                      }} style={{ height: 30, width: 30, borderRadius: 20, borderWidth: 1, borderColor: '#B357C3', justifyContent: 'center', marginRight: 10 }}>
                        {selectedCard == index && <View style={{ width: 20, height: 20, borderRadius: 15, backgroundColor: '#B357C3', alignSelf: 'center' }} />}

                      </TouchableOpacity>
                      <Image
                        source={img}
                        style={{
                          width: 51,
                          height: 20,
                          alignSelf: 'center',
                          borderRadius: 5,
                          resizeMode: 'stretch',
                        }} />
                    </View>
                    <View style={{ marginLeft: -50 }}>
                      <Text
                        style={{
                          fontFamily: FONTFAMILY,
                          color: Mycolors.TEXT_COLOR,
                          fontWeight: '500',
                          fontSize: 16,
                        }}>
                        **** **** **** {item?.last4}
                      </Text>
                      <Text
                        style={{
                          fontFamily: FONTFAMILY,
                          color: Mycolors.GrayColor,
                          fontWeight: '300',
                          fontSize: 14,
                          top: 2,
                        }}>
                        Expires {item?.exp_year}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={{ height: 25, width: 25 }}
                      onPress={() => {

                        deleteCards({ card_id: item?.card_id })

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

            {(cardList.length == 0 && !modleSaveCard) && <View style={{ marginTop: '60%', }}><NoDataFound msg='No Card Found' styles={{}} /></View>}



          </View>

          {cardList.length != 0 && <TouchableOpacity onPress={async () => {

            // props.navigation.navigate("GoToMyorder")
            // props.navigation.navigate('BottomNavNew', { screenIndex: 2 })
            // return

            if (cardList.length === 0) {
              Toast.show("Please add a card to continue")
              return
            }

            if (address) {
              if (await shipping_address()) {

                saveOrder()

              }
            }
            else saveOrder()
          }} style={{ width: '90%', height: 50, backgroundColor: "#B357C3", borderRadius: 7, marginTop: 20, justifyContent: "center", alignSelf: 'center' }}
          >
            <Text style={{ fontFamily: FONTFAMILY, fontSize: 14, color: "#fff", textAlign: "center", fontWeight: "400" }}>CONFIRM</Text>
          </TouchableOpacity>
          }
          {/* Add Saved cards modal*/}
          <Modal
            isVisible={false}
            swipeDirection="down"
            onSwipeComplete={e => {
              SetModleSaveCard(false);
            }}
            coverScreen={true}
            backdropColor="transparent"
          >
            <TouchableOpacity onPress={() => {
              SetModleSaveCard(false)
            }} style={{
              width: dimensions.SCREEN_WIDTH,
              height: dimensions.SCREEN_HEIGHT,
              justifyContent: 'center',
              alignItems: 'center',
              // margin: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              alignSelf: 'center'
            }}></TouchableOpacity>

            {/* <View style={{position: 'absolute', width: '100%'}}>
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
                height: 50,
                marginVertical: 30,
              }}
              onCardChange={(cardDetails) => {
                setCardDetails(cardDetails);
              }}
              onFocus={(focusedField) => {
                console.log('focusField', focusedField);
              }}
            />
            </View> */}

            <View
              style={{
                // height: 'auto',
                backgroundColor: Mycolors.BG_COLOR,
                borderRadius: 10,
                padding: 20,
                // margin: 0,
                // bottom: 0,
                marginHorizontal: 20,
                position: 'absolute'
              }}>
              <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.mainView}>
                  <View
                    style={{ justifyContent: 'center', alignItems: 'center' }}>
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
                    {/* <TextInputArea2
                      placeholder="XXXX  XXXX"
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
                    /> */}
                    <View style={{ width: dimensions.SCREEN_WIDTH, height: 0, backgroundColor: 'transparent' }} />


                    <View style={{ width: '100%', }}>
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
                          height: 50,
                          marginVertical: 30,
                        }}
                        onCardChange={(cardDetails) => {
                          setCardDetails(cardDetails);
                        }}
                        onFocus={(focusedField) => {
                          console.log('focusField', focusedField);
                        }}
                      />
                    </View>
                  </View>
                  <View style={{ height: 0 }} />
                  <MyButtons
                    title="ADD"
                    height={60}
                    width={'100%'}
                    borderRadius={5}
                    fontWeight={'700'}
                    alignSelf="center"
                    press={async () => {
                      SetModleSaveCard(false);
                      await handlePayPress()

                    }}
                    marginHorizontal={20}
                    titlecolor={Mycolors.BG_COLOR}
                    backgroundColor={Mycolors.Purple}
                    marginVertical={10}
                  />
                </View>
              </KeyboardAwareScrollView>
            </View>

            {/* <View
              style={{
                // height: 'auto',
                backgroundColor: Mycolors.BG_COLOR,
                borderRadius: 10,
                padding: 20,
                // margin: 0,
                // bottom: 0,
                marginHorizontal: 20,
                position:'absolute'
              }}>
              <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.mainView}>
                  <View
                    style={{ justifyContent: 'center', alignItems: 'center' }}>
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
                  <View style={{ height: 0 }} />
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
            </View> */}

          </Modal>

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
                    style={{ justifyContent: 'center', alignSelf: 'center' }}>
                    <Image
                      source={require('../../assets/success.png')}
                      style={{
                        width: 150,
                        height: 100,
                        alignSelf: 'center',
                        borderRadius: 5,
                        resizeMode: 'stretch',
                      }} />

                  </View>
                  <Text style={{ fontFamily: FONTFAMILY, textAlign: 'center', marginTop: 8, color: '#B357C3', fontWeight: '500' }}>Successfully Purchased!</Text>
                  <Text style={{ fontFamily: FONTFAMILY, textAlign: 'center', marginTop: 8, color: '#000', fontWeight: '400', fontSize: 11, lineHeight: 18 }}>{address ? "Thank you for purchasing product. We have received your order and we will update the status regarding the same." : "Thank you purchasing the course you can now access the content with a certification added as a benefit."} </Text>

                  {/* <View style={{height: 20}} /> */}
                  <MyButtons
                    title="My Orders"
                    height={45}
                    width={'100%'}
                    borderRadius={5}
                    fontWeight={'600'}
                    alignSelf="center"
                    press={() => {
                      SetModleShippingAddress(false);
                      // props.navigation.navigate("MyorderStack")
                      props.navigation.navigate('BottomNavNew', { screenIndex: 2, isProduct: address ? true : false })
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
export default ProductPaymentMethod;
