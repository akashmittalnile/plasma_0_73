//import : react components
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  ScrollView,
  Switch,
  TouchableOpacity,
  Dimensions,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  Platform,
  RefreshControl,
  PermissionsAndroid
} from 'react-native';
//import : custom components
// import MyHeader from 'components/MyHeader/MyHeader';
import MyText from './MyText';
//import : third parties
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-simple-toast';
//import : global
import * as Colors from './Colors'
//import : styles
import { styles } from './OrderDetailsStyle';
//import : modal
//import : redux
import { useSelector, useDispatch } from 'react-redux';

// import Divider from 'components/Divider/Divider';
// import MyButton from '../../../components/MyButton/MyButton';
// import SearchWithIcon from '../../../components/SearchWithIcon/SearchWithIcon';
// import OrdersFilter from '../../../modals/OrdersFilter/OrdersFilter';
// import Review from '../../../modals/Review/Review';
// import { createThumbnail } from 'react-native-create-thumbnail';
import RNFetchBlob from 'rn-fetch-blob';
// import defaultImg from "../../../assets/images/default-content-creator-image.png"
import Loader from '../../WebApi/Loader';
import { dimensions, Mycolors } from '../../utility/Mycolors';
import MyButtons from '../../component/MyButtons';
import HomeHeader from '../../component/HomeHeader';
import HomeHeader2 from '../../component/HomeHeader2';
import ShareComponent from '../../component/ShareComponent';
import useAPI from '../../utility/hooks/useAPI';
import { removeNull, requestDownloadingPermission } from '../../utility/MyFunctions';
import { FONTFAMILY, FONTFAMILYSEMIBOLD } from '../../utility/fonts';



function TODOComp({ txt = '' }) {


  return <Text style={{fontFamily:FONTFAMILY, fontSize: 15 }}>{txt}</Text>
}

const OrderDetails = ({ navigation, route }) => {
  const width = dimensions.SCREEN_WIDTH

  // const defaultImgPath = Image.resolveAssetSource(defaultImg).uri;
  const dispatch = useDispatch()
  //variables
  const LINE_HEIGTH = 25;
  //variables : redux
  const userToken = useSelector(state => state.user.userToken);
  const userInfo = useSelector(state => state.user.userInfo);

  const orderID = route?.params?.orderID
  console.log({ orderID });

  // const [showLoader, setShowLoader] = useState(false);
  const [orderData, setOrderData] = useState();

  const type = orderData?.data?.type
  const isProduct = (type == 2)
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [review, setReview] = useState('');
  const [starRating, setStarRating] = useState(1);
  const [selectedId, setSelectedId] = useState('1');
  const [selectedType, setSelectedType] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const { getAPI, postAPI, loading, controlLoader } = useAPI()

  async function getOrderDetail(params) {
    const res = await getAPI({ endPoint: 'order-details/' + orderID })

    if (res) {
      setOrderData(res)
      console.log("setOrderData", res);
    }
  }

  const getCardImage = type => {
    console.log('getCardImage', type);
    if (type === 'Visa') {
      return require('../../assets/visacard_logo.png');
    } else if (type === 'Mastercard') {
      return require('../../assets/Mastercard_logo.png');
      // return require('../../assets/Mastercard_logo.png');
    }
    else {
      require('../../assets/Mastercard_logo.png')
    }
  };

  useEffect(() => {
    getOrderDetail();
  }, []);
  // const checkcon = () => {
  //   getOrderDetail();
  // };
  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };
  const onRefresh = React.useCallback(() => {
    // checkcon();
    wait(2000).then(() => {
      setRefreshing(false);
    });
  }, []);


  // const generateThumb = async data => {
  //   console.log('generateThumb', JSON.stringify(data));
  //   let updatedData = [...data];
  //   try {
  //     updatedData = await Promise.all(
  //       data?.map?.(async el => {
  //         if (el?.type == '2') {
  //           return el;
  //         }
  //         // console.log('here', JSON.stringify(el));
  //         const thumb = await createThumbnail({
  //           url: el?.video,
  //           timeStamp: 1000,
  //         });
  //         return {
  //           ...el,
  //           thumb,
  //         };
  //       }),
  //     );
  //   } catch (error) {
  //     console.error('Error generating thumbnails:', error);
  //   }
  //   console.log('thumb data order details', updatedData);
  //   return updatedData;
  // };


  // const requestDownloadingPermission = async () => {
  //   if (Platform.OS == 'ios') {
  //     // downloadInvoice();
  //     downloadFile(orderData?.data?.invoice)
  //   } else {
  //     try {
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //         {
  //           title: 'Downloading Permission',
  //           message:
  //             'PlasmaPen needs access to your downloading manager ',
  //           buttonNeutral: 'Ask Me Later',
  //           buttonNegative: 'Cancel',
  //           buttonPositive: 'OK',
  //         },
  //       );
  //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //         // downloadInvoice();
  //         downloadFile(orderData?.data?.invoice)
  //       } else {
  //         console.log('Camera permission denied');
  //       }
  //     } catch (err) {
  //       console.warn(err);
  //     }
  //   }

  // };

  const downloadInvoice = async () => {
    // setShowLoader(true);
    console.log('downloadInvoice', orderData?.invoice);
    let pdfUrl = orderData?.data?.invoice;
    let DownloadDir =
      Platform.OS == 'ios'
        ? RNFetchBlob.fs.dirs.DocumentDir
        : RNFetchBlob.fs.dirs.DownloadDir;
    const { dirs } = RNFetchBlob.fs;
    const dirToSave =
      Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
    const configfb = {
      fileCache: true,
      useDownloadManager: true,
      notification: true,
      mediaScannable: true,
      title: 'Arkansas',
      path: `${dirToSave}.pdf`,
    };
    console.log('here');
    const configOptions = Platform.select({
      ios: {
        fileCache: configfb.fileCache,
        title: configfb.title,
        path: configfb.path,
        appendExt: 'pdf',
      },
      android: configfb,
    });
    Platform.OS == 'android'
      ? RNFetchBlob.config({
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: `${DownloadDir}/.pdf`,
          description: 'Arkansas',
          title: `${orderData?.data?.order_number} invoice.pdf`,
          mime: 'application/pdf',
          mediaScannable: true,
        },
      })
        .fetch('GET', `${pdfUrl}`)
        .then(res => {
          // setShowLoader(false);
          console.log('The file saved to ', res);
        })
        .catch(error => {
          // setShowLoader(false);
          console.warn(error.message);
        })
      : RNFetchBlob.config(configOptions)
        .fetch('GET', `${pdfUrl}`, {})
        .then(res => {
          console.log('The file saved to iOS', res);
          // setShowLoader(false);
          if (Platform.OS === 'ios') {
            // RNFetchBlob.fs.writeFile(configfb.path, res.data, 'base64');
            // RNFetchBlob.ios.previewDocument(configfb.path);
            RNFetchBlob.ios.previewDocument(res.path());
          }
          
        })
        .catch(e => {
          // setShowLoader(false);
          console.log('The file saved to ERROR', e.message);
        });

  };

  function downloadFile(link)  {
    // setLoading(true);
    const date = new Date();
    let pdfUrl = link;
    let ext = 'pdf';
    ext = '.' + ext;
    let DownloadDir =
      Platform.OS == 'ios'
        ? RNFetchBlob.fs.dirs.DocumentDir
        : RNFetchBlob.fs.dirs.DownloadDir;
    const {dirs} = RNFetchBlob.fs;
    const dirToSave =
      Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
    const configfb = {
      fileCache: true,
      useDownloadManager: true,
      notification: true,
      mediaScannable: true,
      title: 'PlasmaPen',
      path: `${dirToSave}/${
        Math.floor(date.getTime() + date.getSeconds() / 2) + ext
      }`,
    };
    const configOptions = Platform.select({
      ios: {
        fileCache: configfb.fileCache,
        title: configfb.title,
        path: configfb.path,
        appendExt: ext,
      },
      android: configfb,
    });
    Platform.OS == 'android'
      ? RNFetchBlob.config({
          fileCache: true,
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            path:
              `${DownloadDir}` +
              `${Math.floor(date.getDate() + date.getSeconds() / 2)}` +
              ext,
            description: 'PlasmaPen',
            title: `${pdfUrl.slice(pdfUrl.lastIndexOf('/'), pdfUrl.length)}`,
            mime: 'application/pdf',
            mediaScannable: true,
          },
        })
          .fetch('GET', `${pdfUrl}`)
          .then(res => {
            // setLoading(false);
          })
          .catch(error => {
            // setLoading(false);
            console.warn(error.message);
          })
      : RNFetchBlob.config(configOptions)
          .fetch('GET', `${pdfUrl}`, {})
          .then(res => {
            // setLoading(false);
            if (Platform.OS === 'ios') {
              RNFetchBlob.fs.writeFile(
                configfb.path,
                res.data,
                'base64',
              );
              RNFetchBlob.ios.previewDocument(configfb.path);
            }
          })
          .catch(e => {
            // setLoading(false);
            console.error('The file saved to ERROR', e.message);
          });
  };

  function showAddress() {

    const { address_line_1,
      address_line_2,
      city,
      state,
      country,
      zip_code } = orderData?.data?.shipping_address?.data

     
    return removeNull(`${address_line_1}, ${address_line_2}, ${city}, ${state}, ${country}, ${zip_code}`)
  }

  const RenderItem = ({ item, index }) => {
    console.log('item', item);

    // console.log("ssswdsde", item?.images[0]?.image);

    const itemImg = type == 2 ? item?.images[0]?.image : item?.image
    console.log({ itemImg })
    return (
      <TouchableOpacity onPress={() => {
        navigation.navigate(type == 2 ? "ProductDetails" : 'CourseDetails', { data: { id: item?.id } })
      }} style={styles.courseContainer}>

        <View style={styles.courseSubContainer}>
          <Image
            source={
              // item?.type == '1' ? { uri: item?.thumbnail } : { uri: item?.image }
              { uri: itemImg }
            }
            style={styles.crseImg}></Image>
          {/* <TODOComp txt='ImageBackground' /> */}
          <View style={{ marginLeft: 11, width: width * 0.5 }}>
            <MyText
              text={item?.title}
              fontFamily="regular"
              fontSize={13}
              textColor={Colors.LIGHT_GREY}
              style={{}}
            />
            <View style={styles.middleRow}>
              <View style={styles.ratingRow}>
                <View style={{ height: 10, width: 10, justifyContent: 'center', alignItems: 'center' }}>
                  <Image resizeMode='contain' source={require('../../assets/star.png')} style={{ height: 12, minWidth: 12 }} />
                  {/* <TODOComp txt='star.png' /> */}
                </View>
                <MyText
                  text={item?.rating}
                  fontFamily="regular"
                  fontSize={13}
                  textColor={Colors.LIGHT_GREY}
                  letterSpacing={0.13}
                  style={{ marginLeft: 5 }}
                />
              </View>
              <View style={styles.crtrRow}>
                {/* <Image
                  source={require('assets/images/profile-circle.png')}
                  // style={styles.crtrImg}
                /> */}
                {/* <Image
                  source={{ uri: item?.creator_image ? item?.creator_image : defaultImgPath }}
                  style={styles.createImgStyle}
                /> */}
                {/* <TODOComp txt='Image' /> */}
                {isProduct && <MyText
                  text={'Quantity: ' + item?.quantity}
                  fontFamily="regular"
                  fontSize={13}
                  numberOfLines={1}
                  textColor={'#A13BB6'}
                  letterSpacing={0.13}
                  style={{ marginLeft: 10 }}
                />
                }
              </View>
            </View>
            <View style={styles.bottomRow}>
              <MyText
                text={'$' + (isProduct ? item?.price : item?.paid_amount)}
                fontFamily="bold"
                fontSize={14}
                textColor={"#A13BB6"}
                letterSpacing={0.14}
                style={{}}
              />
              <TouchableOpacity onPress={() => {
                // shareItemHandler(item?.type, item?.id);
              }}>
                <View style={styles.iconsRow}>
                  {/* <Image source={require('assets/images/heart-selected.png')} /> */}
                  {/* <Image
                    source={require('assets/images/share.png')}
                    style={{ marginLeft: 10, height: 16, width: 16 }}
                  /> */}
                  {/* <TODOComp txt='images share.png' /> */}
                  <ShareComponent title={item?.title} imgStyle={{ marginLeft: 10, height: 18, width: 18 }} />
                </View>
              </TouchableOpacity>
            </View>
            {item?.type == '1' ? (<>
              {/* <MyButtons
                text="WRITE YOUR REVIEW HERE"
                style={{
                  // width: '90%',
                  height: 40,
                  marginTop: 8,
                  backgroundColor: Colors.THEME_BROWN,
                }}
                onPress={() => openReviewModal(item?.id, '1')}
              /> */}
              <MyButtons
                title="WRITE YOUR REVIEW HERE"
                height={60}
                width={'100%'}
                borderRadius={5}
                fontWeight={'700'}
                alignSelf="center"
                press={() => {
                  openReviewModal()
                }}
                marginHorizontal={20}
                titlecolor={Mycolors.BG_COLOR}
                backgroundColor={Mycolors.Purple}
                marginVertical={10}
              />
            </>) : null}
          </View>
        </View>
        <View
          style={{ borderColor: '#ECECEC', marginTop: 11, marginBottom: 5, height: 1, width: '100%' }}
        />
        <MyText
          text={orderData?.data?.order_date}
          fontFamily="medium"
          fontSize={12}
          textColor={Colors.LIGHT_GREY}
          style={{}}
        />
      </TouchableOpacity>
    );
  };
  const Summary = ({ }) => {
    return (
      <View style={styles.summaryContainer}>

        

        <View style={[styles.row, { marginBottom: 10 }]}>
          <MyText
            // text={`Total Amount (1)`}
            text={`Subtotal`}
            fontSize={14}
            fontFamily="medium"
            textColor={'#455A64'}
            style={{}}
          />
          <MyText
            text={orderData?.data?.amount != undefined ? '$' + orderData?.data?.amount : '0'}
            fontSize={14}
            fontFamily="medium"
            textColor={'#455A64'}
            style={{}}
          />

        </View>
        {orderData?.data?.type === 2 && <View style={[styles.row, { marginBottom: 10 }]}>
          <MyText
            text={`Shipping Cost`}
            fontSize={14}
            fontFamily="medium"
            textColor={'#8F93A0'}
            style={{}}
          />
          <MyText
            text={Number(orderData?.data?.shipping_cost) > 0 ? '+ $' + orderData?.data?.shipping_cost : '$0'}
            fontSize={14}
            fontFamily="medium"
            textColor={'#8F93A0'}
            style={{}}
          />
        </View>}
        <View style={[styles.row, { marginBottom: 7 }]}>
          <MyText
            text={`Tax`}
            fontSize={14}
            fontFamily="medium"
            textColor={'#8F93A0'}
            style={{}}
          />
          <MyText
            text={Number(orderData?.data?.taxes) > 0 ? '+ $' + orderData?.data?.taxes : '$0'}
            fontSize={14}
            fontFamily="medium"
            textColor={'#8F93A0'}
            style={{}}
          />
        </View>
        
        <View style={[styles.row, { marginBottom: 19 }]}>
          <MyText
            text={`Coupon Discount`}
            fontSize={14}
            fontFamily="medium"
            textColor={'#8F93A0'}
            style={{}}
          />
          <MyText
            text={Number(orderData?.data?.coupon_amount) > 0 ? '- $' + orderData?.data?.coupon_amount : '- $0'}
            fontSize={14}
            fontFamily="medium"
            textColor={'#8F93A0'}
            style={{}}
          />
        </View>

        <View style={[styles.row, { marginBottom: 10 }]}>
          <MyText
            // text={`Total Amount (1)`}
            text={`Total Amount`}
            fontSize={15}
            fontFamily="medium"
            textColor={'#455A64'}
            style={{}}
          />
          <MyText
            text={orderData?.data?.total_amount_paid != undefined ? '$' + orderData?.data?.total_amount_paid : '0'}
            fontSize={15}
            fontFamily="medium"
            textColor={'#455A64'}
            style={{}}
          />

        </View>
        {/* <Divider style={{ borderColor: '#E0E0E0' }} />
        <View style={[styles.row, { marginTop: 14 }]}>
          <MyText
            text={`Coupon Discount`}
            fontSize={18}
            fontFamily="medium"
            textColor={'#455A64'}
            style={{}}
          />
          <MyText
            text={'$' + orderData?.data?.shipping_cost}
            fontSize={18}
            fontFamily="medium"
            textColor={'#455A64'}
            style={{}}
          />
        </View> */}
      </View>
    );
  };

  const UserDetails = ({ }) => {
    return (
      <View style={styles.summaryContainer}>
        <View style={[styles.row, { marginBottom: 10 }]}>
          <MyText
            // text={`Total Amount (1)`}
            text={`Name`}
            fontSize={14}
            fontFamily="medium"
            textColor={'#455A64'}
            style={{}}
          />{
            orderData?.data?.shipping_address?.data?.first_name && orderData?.data?.shipping_address?.data?.last_name != undefined ?
              <MyText
                text={orderData?.data?.shipping_address?.data?.first_name + "  " + orderData?.data?.shipping_address?.data?.last_name}
                fontSize={14}
                fontFamily="medium"
                textColor={'#455A64'}
                style={{}}
              />
              :
              <MyText
                text={"not available"}
                fontSize={14}
                fontFamily="medium"
                textColor={'#455A64'}
                style={{}}
              />
          }

        </View>
        {orderData?.data?.type === 2 && <View style={[styles.row, { marginBottom: 10 }]}>
          <MyText
            text={`Email`}
            fontSize={14}
            fontFamily="medium"
            textColor={'#8F93A0'}
            style={{}}
          />
          {
            orderData?.data?.shipping_address?.data?.email != undefined ?
              <MyText
                text={orderData?.data?.shipping_address?.data?.email}
                fontSize={14}
                fontFamily="medium"
                textColor={'#8F93A0'}
                style={{}}
              />
              :
              <MyText
                text={"not available"}
                fontSize={14}
                fontFamily="medium"
                textColor={'#8F93A0'}
                style={{}}
              />
          }

        </View>}
        <View style={[styles.row, { marginBottom: 7 }]}>
          <MyText
            text={`Phone`}
            fontSize={14}
            fontFamily="medium"
            textColor={'#8F93A0'}
            style={{}}
          />
          {
            orderData?.data?.shipping_address?.data?.phone != undefined ?
              <MyText
                text={orderData?.data?.shipping_address?.data?.phone}
                fontSize={14}
                fontFamily="medium"
                textColor={'#8F93A0'}
                style={{}}
              /> :
              <MyText
                text={"not available"}
                fontSize={14}
                fontFamily="medium"
                textColor={'#8F93A0'}
                style={{}}
              />
          }

        </View>
        <View style={[styles.row, { marginBottom: 19,}]}>
          <MyText
            text={`Address`}
            fontSize={14}
            fontFamily="medium"
            textColor={'#8F93A0'}
            style={{}}
          />
          {
            orderData?.data?.shipping_address?.data?.address_line_1 != undefined ?
              <MyText
                text={showAddress()}
                fontSize={14}
                fontFamily="medium"
                textColor={'#8F93A0'}
                style={{}}
                width={"60%"}
              />
              :
              <MyText
                text={'not available'}
                fontSize={14}
                fontFamily="medium"
                textColor={'#8F93A0'}
                style={{}}
              />
          }

        </View>
        {/* <Divider style={{ borderColor: '#E0E0E0' }} />
        <View style={[styles.row, { marginTop: 14 }]}>
          <MyText
            text={`Coupon Discount`}
            fontSize={18}
            fontFamily="medium"
            textColor={'#455A64'}
            style={{}}
          />
          <MyText
            text={'$' + orderData?.data?.shipping_cost}
            fontSize={18}
            fontFamily="medium"
            textColor={'#455A64'}
            style={{}}
          />
        </View> */}
      </View>
    );
  };
  const openReviewModal = (id, type) => {
    setSelectedId(id);
    setSelectedType(type);
    setShowReviewModal(true);
  };

  console.log("shoaib", orderData?.shipping_address)

  const img = orderData?.data?.payment_card_type == 'visa' ? require('../../assets/visacard_logo.png') : orderData?.data?.payment_card_type == 'mastercard' ? require('../../assets/Mastercard_logo.png') : null
  //UI
  return (
    <LinearGradient colors={['#300076', '#53045F']} style={{ flex: 1, }}>
      <SafeAreaView />
      <StatusBar />
      <HomeHeader2
        height={60}
        // paddingHorizontal={15}
        title={'Order Details'}
        press1={() => {
          navigation.goBack();
        }}
        img1={require('../../assets/arrow_right_black.png')}
        img1width={25}
        img1height={25}
        press2={() => { navigation.navigate('Notification') }}
        img2={require('../../assets/notification.png')}
        img2width={25}
        img2height={25}
        press3={() => { }}
        // img3={require('../../assets/shoppingbag.png')}
        // img3width={25}
        // img3height={25}
        backgroundColor={'transparent'}
      />
      <View style={styles.container}>
        {/* <MyHeader Title="Order Details" isBackButton /> */}
        {/* <TODOComp txt='header'/> */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: '20%' }}
          // refreshControl={
          //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          // }
          style={styles.mainView}>
          {/* {orderData?.data?.objects && Array.isArray(orderData?.data?.objects) ? (
            <>
              <RenderItem item={orderData?.data?.objects?.find(el => el.is_primary)} />
              {orderData?.data?.objects?.length > 1 ? (
                <>
                  <MyText
                    text={'Other Items'}
                    fontFamily="medium"
                    fontSize={16}
                    textColor={Colors.THEME_BROWN}
                    style={{ marginBottom: 10 }}
                  />
                  {orderData?.items
                    ?.filter(el => !el.is_primary)
                    ?.map(item => (
                      <RenderItem item={item} />
                    ))}
                </>
              ) : null}
            </>
          ) : null} */}
          {orderData && <View style={[styles.courseTopRow, { marginTop: 15 }]}>
            <MyText
              text={`Order ID: ${orderData?.data?.order_number}`}
              fontFamily="medium"
              fontSize={12}
              textColor={Colors.LIGHT_GREY}
              style={{}}
            />
            <View style={styles.statusRow}>
              <View style={styles.dot} />
              <MyText
                // text={item?.order_status == '1' ? 'Paid' : 'Not Paid'}
                text={'Paid'}
                fontFamily="medium"
                fontSize={13}
                textColor={Colors.THEME_BROWN}
                style={{ marginLeft: 5 }}
              />
            </View>
          </View>}

          {orderData?.data?.objects.map((item, index) => {

            return <RenderItem item={item} index={index} />

          })}
          <Summary />

          {type == 2 && <UserDetails />}

          {/* <View style={styles.amountContainer}>
            <View
              // source={require('assets/images/amount-bg.png')}
              style={styles.amountContainer}>
              <View style={styles.whiteCircle3}>
                <View style={styles.whiteCircle2}>
                  <Image 
                  // source={require('assets/images/amount-icon.png')} 
                  />
                  <TODOComp txt='Image amount-icon.png' />
                </View>
              </View>
              <View style={{ marginLeft: 12 }}>
                <MyText
                  text={'Total Amount'}
                  fontFamily="regular"
                  fontSize={14}
                  textColor={Colors.WHITE}
                  textAlign={'center'}
                  style={{}}
                />

                <MyText
                  text={orderData?.data?.total_amount_paid != undefined ? "$" + `${orderData?.data?.total_amount_paid}` : "0"}
                  fontFamily="bold"
                  fontSize={16}
                  textColor={Colors.WHITE}
                  style={{ marginTop: 5 }}
                />

              </View>
            </View>
          </View> */}




          <TouchableOpacity
            // key={index}
            style={{
              width: '100%',
              borderColor: Mycolors.GrayColor,
              borderWidth: 0.02,
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 17,
              paddingHorizontal: 17,
              borderRadius: 10,
              backgroundColor: '#fff',
              marginTop: 15,
              marginBottom: 10,
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowRadius: 5,
              shadowOpacity: 0.05,
              elevation: 2,
              // borderr
              // justifyContent: 'space-between',
            }}
            onPress={() => {

              // setselectedCard(index)

            }}>

            <View style={{ flexDirection: 'row' }}>

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
            <View style={{ marginLeft: 20 }}>
              <Text  style={{fontFamily:FONTFAMILYSEMIBOLD,
                  color: Mycolors.TEXT_COLOR,
                  // FONTFAMILYSEMIBOLD
                  fontSize: 16,
                }}>
                **** **** **** {orderData?.data?.payment_card_no}
              </Text>
              <Text  style={{fontFamily:FONTFAMILYSEMIBOLD,
                  color: Mycolors.GrayColor,
                  
                  fontSize: 14,
                  top: 2,
                }}>
                Expires {orderData?.data?.payment_card_expiry}
              </Text>
            </View>
            <TouchableOpacity
              style={{ height: 25, width: 25 }}
              onPress={() => {

                // deleteCards({ card_id: item?.card_id })

              }}>
              {/* <Image
                        style={{ height: '100%', width: '100%' }}
                        source={require('../../assets/trash_icon.png')}
                      /> */}
            </TouchableOpacity>
          </TouchableOpacity>
          {/* <MyButtons
            text="DOWNLOAD INVOICE"
            style={{
              width: width * 0.9,
              marginBottom: 10,
              backgroundColor: Colors.THEME_BROWN,
              marginTop: 32,
            }}
            press={requestDownloadingPermission}
          /> */}
          {orderData?.data?.invoice && <MyButtons
            title="DOWNLOAD INVOICE"
            height={60}
            width={'100%'}
            borderRadius={5}
            fontWeight={'700'}
            alignSelf="center"
            press={() => {
              requestDownloadingPermission(orderData?.data?.invoice)
            }}
            marginHorizontal={20}
            titlecolor={Mycolors.BG_COLOR}
            backgroundColor={Mycolors.Purple}
            marginVertical={10}
          />}
        </ScrollView>
        {/* <CustomLoader showLoader={showLoader} /> */}
        {loading && <Loader />}
        {/* <Review
          visible={showReviewModal}
          setVisibility={setShowReviewModal}
          starRating={starRating}
          setStarRating={setStarRating}
          review={review}
          setReview={setReview}
          // submitReview={submitReview}
        /> */}
      </View>
    </LinearGradient>

  );
};

function OrderDetailss() {
  return <></>
}


export default OrderDetails;

const itemData = {
  order_id: '32',
  order_date: '11 Oct, 2023 05:17AM',
  order_number: 'AKS32653321',
  product_id: '4',
  title: 'Activated charcoal',
  description:
    'Commonly used in emergency rooms across the world as an antidote to the ingestion of toxic amounts of illegal or prescription drugs, charcoal is given in an attempt to minimize the number of toxins that are absorbed into the gut. In theory, it may also be useful in preventing toxins that may be absorbed through diet. Available in tablet or powder form.',
  total_amount_paid: '200',
  price: '200',
  category_id: '7',
  category_name: 'Body detox',
  avg_rating: '4.7',
  order_status: 'Paid',
  content_creator_image:
    'http://nileprojects.in/arkansas/public/upload/profile-image/1696397010.jpg',
  content_creator_name: 'Arkansas ',
  content_creator_id: 1,
  isReviewed: 0,
};


