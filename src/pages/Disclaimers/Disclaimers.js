import React, { useState, useEffect, useRef } from 'react';
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
  Keyboard, FlatList,
  TouchableOpacity, ImageBackground, Modal,
  RefreshControl,
  Pressable,
  Linking
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
import { add_cart, course_details, imgUrl, remove_cart, requestGetApi, requestPostApi } from '../../WebApi/Service';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../../WebApi/Loader';
import Toast from 'react-native-simple-toast';
import MyAlert from '../../component/MyAlert';
import LinearGradient from 'react-native-linear-gradient';
// import Modal from 'react-native-modal';
import HomeHeader from '../../component/HomeHeader';
import HomeHeader2 from '../../component/HomeHeader2';
import { WebView } from 'react-native-webview';
import Video from 'react-native-video';
import VideoPlayer from '../../component/VideoPlayer';
import { StrikeThough } from '../../utility/FontStyles';
import ShareComponent, { handleShare } from '../../component/ShareComponent';
import { addToWishlist } from '../../WebApi/GlobalAPICalls';
import NewModal from 'react-native-modal';
import { reloadCourse } from '../../redux/reduxSlices/courseSlice';
import { useIsFocused } from '@react-navigation/native';
import useAPI from '../../utility/hooks/useAPI';
import AddToCartHandleComponent from '../../component/AddToCartHandleComponent';
import { useNavigation } from '@react-navigation/native';
import NoDataFound from '../../component/NoDataFound';
import { FONTFAMILYSEMIBOLD } from '../../utility/fonts';

const RenderRecommendedProduct = ({ item, index, handleWishlist = () => { }, startLoader = () => { }, stopLoader = () => { }, onAddRemoveSuccess = () => { }, buyNowSuccess = () => { } }) => {

  const compRef = useRef()
  const navigation = useNavigation()


  return (
    <>
      {/* <AddToCartHandleComponent ref={compRef} id={item?.product_id} type={2} in_cart={item?.in_cart} /> */}
      {/* <TouchableOpacity style={{
      width: dimensions.SCREEN_WIDTH * 75 / 100, marginLeft: 10,
      // borderWidth:0.5,
      // borderColor:'#EAEDF7',
      paddingVertical: 4,
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      elevation: 3,
      shadowOpacity: 0.5,
      borderRadius: 10,
      zIndex: 999
    }}>
      <ImageBackground style={{ height: 150, width: '100%', borderTopLeftRadius: 7, borderTopRightRadius: 7, overflow: 'hidden' }} source={require("../../assets/Rectangle.png")}>
      </ImageBackground>

      <View style={{ width: '100%', borderBottomLeftRadius: 5, borderBottomRightRadius: 5, padding: 10 }}>
        <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 13, color: "#000", padding: 5 }}>{item?.product_name}</Text>

        <View style={{ flexDirection: "row" }}>

          <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 14, color: "#B357C3", padding: 4, marginLeft: 2 }}>${item?.product_price}</Text>

          <View style={{ flexDirection: "row", padding: 4, marginLeft: 25 }}>
            <Image style={{ height: 12, width: 12, marginTop: 4 }} source={require("../../assets/star.png")}></Image>
            <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 13, color: "#000", }}> 4.7</Text>
          </View>
        </View>
      </View>

    </TouchableOpacity> */}


      <View onPress={() => {
        // return
        navigation.navigate('ProductDetails', { data: { id: item?.product_id } })
      }} style={{ width: dimensions.SCREEN_WIDTH * 75 / 100, marginRight: 10 }}>
        <TouchableOpacity onPress={() => navigation.navigate('ProductDetails', { data: { id: item?.product_id } })}>
          <ImageBackground style={{ height: 150, width: '100%', borderTopLeftRadius: 7, borderTopRightRadius: 7, marginLeft: 10, overflow: 'hidden', resizeMode: 'stretch' }} resizeMode='stretch' source={{ uri: item?.product_images[0]?.image }}>
            <View style={{ flexDirection: "row", alignSelf: "flex-end", marginTop: 5 }}>
              <TouchableOpacity
                // ref={(to)=>{
                //  touchRef.current = to?.touchableHandlePress
                // }} 
                // ref={touchRef} 
                onPress={handleWishlist} style={{ marginRight: 10 }}>
                <Image style={{ height: 25, width: 25, tintColor: "#B357C3", }} source={item?.wishlist ? require("../../assets/heartFilled.png") : require("../../assets/heart.png")}></Image>


              </TouchableOpacity>
              <ShareComponent title={item?.product_name} />

            </View>

          </ImageBackground>
        </TouchableOpacity>

        <View style={{ width: '100%', backgroundColor: '#fff', marginLeft: 10, borderBottomLeftRadius: 5, borderBottomRightRadius: 5, paddingBottom: 10, padding: 5 }}>
          <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 13, color: "#000", padding: 5 }}>{item?.product_name}</Text>

          <View style={{ flexDirection: "row", }}>

            <Text style={[{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 14, color: "#B357C3", padding: 4, marginLeft: 2 }, StrikeThough]}>${item?.product_price}</Text>
            <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 14, color: "#B357C3", padding: 4, marginLeft: 2 }}>${item?.sale_price}</Text>

            <View style={{ flexDirection: "row", padding: 4, marginLeft: 25 }}>
              <Image style={{ height: 12, width: 12, marginTop: 1 }} source={require("../../assets/star.png")}></Image>
              <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 13, color: "#000", }}> {item?.rating}</Text>
            </View>
          </View>


          <View style={{ width: '95%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
            <AddToCartHandleComponent startLoader={startLoader} ref={compRef} id={item?.product_id} type={2} in_cart={item?.in_cart} addRemoveButton={true} addRemoveButtonStyle={{ width: '100%' }} callback={onAddRemoveSuccess}>
              <View onPress={async () => {
                // startLoader()
                // console.log(compRef.current);
                // await compRef.current?.handleAddRemove()
                onAddRemoveSuccess()
                // stopLoader()

              }} style={{ width: 140, paddingVertical: 10, borderRadius: 4, justifyContent: 'center', backgroundColor: '#B357C3' }}>
                <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, color: '#fff', textAlign: 'center' }}>{item?.stock_available ? item?.in_cart ? 'Remove from Cart' : 'Add to Cart' : "Stock Out"}</Text>



              </View>
            </AddToCartHandleComponent>


            {/* <TouchableOpacity style={{ width: '48%', paddingVertical: 10, borderRadius: 4, justifyContent: 'center', backgroundColor: '#4556A6' }}
              onPress={async () => {
                startLoader()
                // await compRef.current?.handleBuy()
                onAddRemoveSuccess()
              }}>
              <Text style={{fontFamily:FONTFAMILYSEMIBOLD, color: '#fff', textAlign: 'center' }}>Buy Now</Text>
            </TouchableOpacity> */}

            <AddToCartHandleComponent startLoader={startLoader} ref={compRef} id={item?.product_id} type={2} in_cart={item?.in_cart} buyBtn={true} callback={onAddRemoveSuccess}>
              <View style={{ width: 140, paddingVertical: 10, borderRadius: 4, justifyContent: 'center', backgroundColor: '#4556A6' }}
                onPress={async () => {
                  startLoader()
                  // await compRef.current?.handleBuy()
                  onAddRemoveSuccess()
                }}>
                <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, color: '#fff', textAlign: 'center' }}>Buy Now</Text>
              </View>
            </AddToCartHandleComponent>

          </View>


        </View>

      </View>
    </>
  )
}

const Disclaimers = props => {
  const dispatch = useDispatch();
  const flatListRef = useRef(null)
  const [loading, setLoading] = useState(false);

  const [modleSaveCard, SetModleSaveCard] = useState(false);
  const [modleShippingAddress, SetModleShippingAddress] = useState(false);
  const [lode, setlod] = useState(false);
  const [clickedItem, setclickedItem] = useState('')
  const [pus, setpus] = useState(false)
  const [videoIndex, setvideoIndex] = useState(null)
  const [My_Alert, setMy_Alert] = useState(false);
  const [alert_sms, setalert_sms] = useState('');

  const { data,
    courseImage,
    courseData, courseID } = props.route.params

  const [courseMainData, setCourseMainData] = useState(courseData)

  const myData = courseMainData?.lessons?.filter((lesson) => lesson?.lesson_id == data?.lesson_id)[0]

  const markIsCompletedUpdatedIndexData = myData?.chapter_steps[videoIndex]

  const updateCourse = useSelector(state => state.course.updateCourse);


  // const [myData, setmyData] = useState(props.route.params.data)
  // const courseImage = props.route.params?.courseImage

  const [quizModal, setquizModal] = useState(false)
  const [completeModal, setcompleteModal] = useState(false)
  const [completeModalMsg, setcompleteModalMsg] = useState('')
  const [quizData, setQuizData] = useState(null)
  const AddToCart = useRef(null)


  const userdetaile = useSelector(state => state.user.user_details)
  console.log({ myData });

  const isFocused = useIsFocused()

  const { postAPI } = useAPI()


  const getCourseDetail = async () => {

    setLoading(true);
    const { responseJson, err } = await requestGetApi(course_details + courseID, '', 'GET', userdetaile.access_token)

    setLoading(false);
    // console.log('the courses data is==>>', responseJson.data.lessons[1]);

    console.log("getCourseDetail", JSON.stringify(responseJson));
    if (err == null) {
      if (responseJson.status) {

        setCourseMainData(responseJson.data);

      } else {

      }
    } else {
    }
  };

  async function markAsComplete() {
    setLoading(true);
    const res = await postAPI({
      endPoint: 'mark-as-complete', bodyJSON: {
        chapter_step_id: clickedItem?.step_id
      }
    })

    setLoading(false);
    reloadCoursesScreens()
  }

  useEffect(() => {

    getCourseDetail()

  }, [updateCourse])

  useEffect(() => {

    isFocused && reloadCoursesScreens()
    return () => {

    }
  }, [isFocused])



  function reloadCoursesScreens() {
    dispatch(reloadCourse())
  }

  useEffect(() => {
    // setmyData(props.route.params.data)
    setclickedItem(myData?.chapter_steps[0])
    setvideoIndex(0)
    setlod(!lode)





  }, []);



  function executeQuiz() {
    setQuizData(clickedItem)

    if (clickedItem?.percentage_obtained != null) {
      setquizModal(true)
    }
    else {
      console.log("elseQuizWebViewModal", clickedItem);
      props.navigation.navigate("QuizWebViewModal", { quiz_url: clickedItem?.quiz_url })

    }
  }

  function executeSurvey() {

    if (clickedItem?.is_completed != 0) {
      setcompleteModalMsg('Survey is already Submitted!')
      setcompleteModal(true)
    }
    else {
      props.navigation.navigate("SurveyWebview", { survey_url: clickedItem?.survey_url })
    }
  }

  function executeAssignment(clickedItemData) {

    // return

    if (clickedItemData?.quiz[0]?.is_completed == 0) {

      if (clickedItemData?.quiz[0]?.uploaded_date == null) {
        props.navigation.navigate("AssignmentScreen", { chapter_step_id: clickedItemData?.step_id, assignment_id: clickedItemData?.quiz[0]?.id })
        return
      }

      setcompleteModalMsg("Assignment is Already Submitted, Admin Approval Pending!")
      setcompleteModal(true)
      return
    }





    if (clickedItemData?.quiz[0]?.is_completed == 1) {
      setcompleteModalMsg("Assignment is Approved by Admin!")
      setcompleteModal(true)
      return
    }

    if (true) {
      setcompleteModalMsg("Assignment is Rejected by Admin, Please re-submit your assignment!")
      // Toast.show("Assignment is Rejected by Admin, Please re-submit your assignment!", 5)
      setcompleteModal(true)
      props.navigation.navigate("AssignmentScreen", { chapter_step_id: clickedItemData?.step_id, assignment_id: clickedItemData?.quiz[0]?.id })
      return
    }



  }

  function executeContent(data) {
    props.navigation.navigate('Content', { data })
  }

  useEffect(() => {

    if (clickedItem?.type == 'quiz') {
      executeQuiz()
    }


    if (clickedItem?.type == 'survey') {
      executeSurvey()
    }

    if (clickedItem?.type == 'assignment') {


      executeAssignment(clickedItem)
    }

    if (clickedItem?.type == 'ppt') {


      // executeAssignment(clickedItem)
      // Linking.openURL(clickedItem?.file)
    }
    if (clickedItem?.type == 'content') {


      // executeContent(clickedItem)
    }


  }, [clickedItem])


  async function toggleCartAddRemove(course, type, access_token, action_type = 'add-cart') {

    let formdata = new FormData();
    formdata.append('id', course);
    formdata.append('type', type);

    setLoading(true);
    const { responseJson, err } = await requestPostApi(
      action_type,
      formdata,
      'POST',
      access_token,
    );
    setLoading(false);
    console.log('The edit profile responce is==>>', responseJson, err);
    if (err == null) {
      if (responseJson.status) {

        console.log(responseJson.message);
        Toast.show(responseJson.message);
        // getHomedata()
        // getCartList()
        return

        // getCourseDetail()
      } else {

        Toast.show(responseJson.message);
        return
      }
    } else {
      console.log('The error is==>>', err);
    }
  }

  const handleWishlist = async (id, type) => {
    setLoading(true)
    await addToWishlist(id, type, userdetaile.access_token)
    setLoading(false)
    // getHomedata()
    reloadCoursesScreens()
  }

  const resetStacks = page => {
    props.navigation.reset({
      index: 0,
      routes: [{ name: page }],
      params: { resentotp: false },
    });
  };

  const logoutPressed = () => {
    AsyncStorage.clear();
    dispatch(onLogoutUser());
  };

  const renderSessionList = ({ item, index }) => {
    return (
      <TouchableOpacity style={{ flexDirection: "row", width: dimensions.SCREEN_WIDTH * 95 / 100, alignSelf: 'center', marginTop: 5, backgroundColor: videoIndex == index ? '#bfbfbf' : '#fff', borderRadius: 7, padding: 10, alignItems: 'center', justifyContent: 'space-between' }}
        onPress={() => {
          console.log("hi", item);

          // if (item?.type == "pdf") {
          //   props.navigation.navigate("DisclaimersPdf", { pdfData: item?.file })

          //   return

          // }

          if (item?.type == "video" || item?.type == "pdf") {
            setclickedItem(item)
            setvideoIndex(index)
            setlod(!lode)
            // flatListRef?.current?.scrollToOffset({ animated: true, offset: 0 });
            flatListRef?.current?.scrollTo({});
            return
          }
          else {
            setclickedItem(item)
            setvideoIndex(index)
          }




        }}>
        <View style={{ flexDirection: "row", }}>
          <Image style={{ height: 25, width: 25, borderRadius: 5, top: 5, tintColor: '#000', alignSelf: 'center', padding: 7, resizeMode: 'stretch' }} source={require("../../assets/book.png")}></Image>
          <View style={{ marginLeft: 15 }}>

            <View style={{ width: dimensions.SCREEN_WIDTH * 70 / 100 }}>
              <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 13, color: "#000", marginVertical: 5 }}>{item.title}</Text>
            </View>
            {/* <View style={{ flexDirection: "row" }}>
              <Image style={{ height: 15, width: 15, borderRadius: 7 }} source={require("../../assets/TImezone_clock.png")}></Image>
              <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 10, color: "#000", marginLeft: 5 }}>01:25</Text>
            </View> */}
          </View>
        </View>
        {videoIndex == index ? <Image style={{ height: 20, width: 20, }} source={require("../../assets/play.png")}></Image> :
          <>
            {(item?.is_completed != 0 && item?.is_completed != null) && <Image style={{ height: 20, width: 20, }} source={require("../../assets/verify.png")}></Image>}
          </>
        }
        {/* <Image style={{ height: 20, width: 20, }} source={videoIndex == index ? require("../../assets/play.png") : require("../../assets/verify.png")}></Image> */}

      </TouchableOpacity>

    )
  }



  return (
    <LinearGradient colors={['#300076', '#53045F']} style={{ flex: 1 }}>

      <NewModal
        isVisible={completeModal}
        swipeDirection="down"
        onSwipeComplete={e => {
          setcompleteModal(false);
          reloadCoursesScreens()
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
              <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, textAlign: 'center', marginTop: 8, color: '#B357C3', fontWeight: '500', marginBottom: 8 }}>{completeModalMsg}</Text>
              {/* <Text style={{fontFamily:FONTFAMILYSEMIBOLD, textAlign: 'center', marginTop: 8, color: '#000', fontWeight: '400', fontSize: 11, lineHeight: 18 }}>Thank you for purchasing course . We received your order and Successfully placed. </Text> */}

              {/* <View style={{height: 20}} /> */}
              <MyButtons
                title="OK"
                height={45}
                width={'100%'}
                borderRadius={5}
                fontWeight={'600'}
                alignSelf="center"
                press={() => {
                  setcompleteModal(false);
                  reloadCoursesScreens()
                  // props.navigation.navigate("MyorderStack")
                }}
                marginHorizontal={20}
                titlecolor={Mycolors.BG_COLOR}
                backgroundColor={Mycolors.Purple}
                marginVertical={10}
              />
            </View>
          </KeyboardAwareScrollView>
        </View>
      </NewModal>

      <Modal visible={quizModal} onRequestClose={() => {
        setquizModal(false)
        reloadCoursesScreens()
      }}>

        <LinearGradient colors={['#300076', '#53045F']} style={{ flex: 1 }}>
          <SafeAreaView />
          <ScrollView>

            <ImageBackground style={{ width: dimensions.SCREEN_WIDTH, height: dimensions.SCREEN_HEIGHT * 0.5 }} source={require("../../assets/bg_quiz.png")}>
              <HomeHeader2
                height={60}
                // paddingHorizontal={15}
                // title={'Course Details'}
                press1={() => {
                  // props.navigation.goBack();
                  setquizModal(false)
                  reloadCoursesScreens()
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

              <View style={{ flex: 1, backgroundColor: 'transparent', }}>
                <View style={{ height: '80%', width: '100%', backgroundColor: 'transparent', justifyContent: 'space-evenly', alignItems: 'center' }}>


                  <Text
                    // adjustsFontSizeToFit={true}
                    style={{
                      fontSize: 22,
                      color: 'white',
                      fontWeight: '600',

                    }}>
                    {quizData?.is_completed == '1' ? " Congratulations! " : "Oops!"}
                  </Text>
                  <View style={{ justifyContent: 'center', alignItems: 'center', width: '90%', }}>
                    <Text style={{
                      fontFamily: FONTFAMILYSEMIBOLD,
                      fontSize: 14,
                      color: 'white',
                      textAlign: 'center',
                      textAlignVertical: 'center'
                    }}>
                      {quizData?.is_completed == '1' ? "Great! You Have Successfully Completed & Passed The Course Download Your Certificate Now!" : "You failed this quiz with a score of"}
                    </Text>
                  </View>
                  <View style={{ width: 150, height: 150, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', }}>
                    <View style={{ width: 150, height: 150, backgroundColor: '#E67FF8', justifyContent: 'center', alignItems: 'center', borderRadius: 140, position: 'absolute', opacity: 0.3 }} />
                    <View style={{ width: 136, height: 136, backgroundColor: '#E67FF8', justifyContent: 'center', alignItems: 'center', borderRadius: 136, position: 'absolute', opacity: 0.5 }} />
                    <View style={{ width: 125.5, height: 125.5, backgroundColor: '#E67FF8', justifyContent: 'center', alignItems: 'center', borderRadius: 125.5, position: 'absolute' }}>

                      <Text style={{
                        fontFamily: FONTFAMILYSEMIBOLD,
                        fontSize: 22,
                        color: 'white'
                      }}>
                        {quizData?.percentage_obtained}%
                      </Text>
                      <Text style={{
                        fontFamily: FONTFAMILYSEMIBOLD,
                        fontSize: 10,
                        color: 'black',
                        marginTop: 8
                      }}>
                        OVERALL
                      </Text>
                      <Text style={{
                        fontFamily: FONTFAMILYSEMIBOLD,
                        fontSize: 10,
                        color: 'black',
                      }}>
                        SCORE
                      </Text>


                    </View>
                  </View>
                  {/* {quizData?.is_completed == '2' &&  */}
                  <Text style={{
                    fontFamily: FONTFAMILYSEMIBOLD,
                    fontSize: 15,
                    color: 'white',
                    fontWeight: '500'
                  }}>
                    {`You need ${quizData?.passing_percentage}% to pass`}
                  </Text>
                  {/* } */}
                </View>
              </View>


            </ImageBackground>
            <View style={{ width: dimensions.SCREEN_WIDTH, height: dimensions.SCREEN_HEIGHT / 2, backgroundColor: 'transparent', alignItems: 'center' }}>

              <View style={{ width: '90%', height: 250, backgroundColor: '#4556A6', justifyContent: 'center', alignItems: 'center', marginTop: -50, borderRadius: 10 }}>

                <View style={{ width: '100%', height: '50%', backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'flex-end', flexDirection: 'row', }}>

                  <View style={{ width: '45%', height: '75%', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>

                    <Text style={{
                      fontFamily: FONTFAMILYSEMIBOLD,
                      fontSize: 22,
                      color: '#4556A6'
                    }}>
                      {quizData?.total_question}
                    </Text>
                    <Text style={{
                      fontFamily: FONTFAMILYSEMIBOLD,
                      fontSize: 14,
                      color: '#505667'
                    }}>
                      Total Question
                    </Text>

                  </View>
                  <View style={{ width: '45%', height: '75%', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginLeft: 7 }}>
                    <Text style={{
                      fontFamily: FONTFAMILYSEMIBOLD,
                      fontSize: 22,
                      color: '#B357C3'
                    }}>
                      {quizData?.total_question}
                    </Text>
                    <Text style={{
                      fontFamily: FONTFAMILYSEMIBOLD,
                      fontSize: 14,
                      color: '#505667'
                    }}>
                      Total attempt Questions
                    </Text>
                  </View>


                </View>
                <View style={{ width: '100%', height: '50%', backgroundColor: 'transparent', justifyContent: 'center', flexDirection: 'row', marginTop: 5 }}>
                  <View style={{ width: '45%', height: '75%', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>

                    <Text style={{
                      fontFamily: FONTFAMILYSEMIBOLD,
                      fontSize: 22,
                      color: '#B357C3'
                    }}>
                      {quizData?.total_correct}
                    </Text>
                    <Text style={{
                      fontFamily: FONTFAMILYSEMIBOLD,
                      fontSize: 14,
                      color: '#505667'
                    }}>
                      Correct Question
                    </Text>

                  </View>
                  <View style={{ width: '45%', height: '75%', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginLeft: 7 }}>
                    <Text style={{
                      fontFamily: FONTFAMILYSEMIBOLD,
                      fontSize: 22,
                      color: '#EB001B'
                    }}>
                      {quizData?.total_question && quizData?.total_question - quizData?.total_correct}
                    </Text>
                    <Text style={{
                      fontFamily: FONTFAMILYSEMIBOLD,
                      fontSize: 14,
                      color: '#505667'
                    }}>
                      Wrong Question
                    </Text>
                  </View>
                </View>

              </View>

              {quizData?.is_completed == '2' ? <TouchableOpacity onPress={() => {
                setquizModal(false)
                console.log(quizData?.quiz_url);
                props.navigation.navigate("QuizWebViewModal", { quiz_url: quizData?.quiz_url })
              }} style={{ width: '85%', height: 80, backgroundColor: '#4556A6', justifyContent: 'center', alignItems: 'center', marginTop: 40, borderRadius: 10 }}>
                <Text style={{
                  fontFamily: FONTFAMILYSEMIBOLD,
                  fontSize: 15,
                  color: 'white'
                }}>
                  Retake Quiz
                </Text>
              </TouchableOpacity>
                :
                // <TouchableOpacity style={{ width: '85%', height: 80, backgroundColor: '#4556A6', justifyContent: 'center', alignItems: 'center', marginTop: 40, borderRadius: 10 }}>
                //   <Text style={{fontFamily:FONTFAMILYSEMIBOLD,
                //     fontSize: 15,
                //     color: 'white'
                //   }}>
                //     Download Certificate
                //   </Text>
                // </TouchableOpacity>
                <></>
              }
            </View>
          </ScrollView>
        </LinearGradient>
      </Modal>


      <SafeAreaView style={{ flex: 1 }}>
        <HomeHeader2
          height={60}
          // paddingHorizontal={15}
          title={'Course Details'}
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
        <ScrollView refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              reloadCoursesScreens()
              // console.log("ddd");
            }} />} ref={flatListRef}>

          <View
            style={{
              width: dimensions.SCREEN_WIDTH - 20,
              height: 220,
              // backgroundColor: 'green',
              alignSelf: 'center',
              borderRadius: 10,
              overflow: 'hidden',
            }}>
            <>
              {clickedItem?.type == "video" &&
                <VideoPlayer
                  pus={pus}
                  file={clickedItem?.file}
                />


              }

            </>


            {clickedItem?.type == "pdf" &&
              <>
                <Image
                  style={{ width: '100%', height: '100%' }}
                  source={{ uri: courseImage }}
                  resizeMode='contain'
                />
                <View style={{ width: '100%', height: '100%', backgroundColor: 'black', position: 'absolute', opacity: 0.1 }} />

                <TouchableOpacity
                  style={{
                    height: 30,
                    width: '18%',
                    backgroundColor: '#B357C3',
                    borderRadius: 7,
                    justifyContent: 'center',
                    alignSelf: 'center',
                    position: 'absolute',
                    top: '48%',
                    left: '44%'
                  }}
                  onPress={() => {
                    // props.navigation.navigate('HomeViewAll');
                    props.navigation.navigate("DisclaimersPdf", { pdfData: clickedItem?.file })
                  }}>
                  <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 13, color: '#fff', textAlign: 'center' }}>
                    View PDF
                  </Text>
                </TouchableOpacity>
              </>

            }

            {clickedItem?.type == "content" &&
              <>
                <Image
                  style={{ width: '100%', height: '100%' }}
                  source={{ uri: courseImage }}
                  resizeMode='contain'
                />
                <View style={{ width: '100%', height: '100%', backgroundColor: 'black', position: 'absolute', opacity: 0.1 }} />

                <TouchableOpacity
                  style={{
                    height: 30,
                    width: '22%',
                    backgroundColor: '#B357C3',
                    borderRadius: 7,
                    justifyContent: 'center',
                    alignSelf: 'center',
                    position: 'absolute',
                    top: '48%',
                    left: '44%',
                    zIndex: 887
                  }}
                  onPress={() => {
                    // props.navigation.navigate('HomeViewAll');
                    // props.navigation.navigate("DisclaimersPdf", { pdfData: clickedItem?.file })
                    executeContent(clickedItem)
                  }}>
                  <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 13, color: '#fff', textAlign: 'center' }}>
                    View Content
                  </Text>
                </TouchableOpacity>
              </>

            }

            {clickedItem?.type == "ppt" &&
              <>
                <Image
                  style={{ width: '100%', height: '100%' }}
                  source={{ uri: courseImage }}
                  resizeMode='contain'
                />
                <View style={{ width: '100%', height: '100%', backgroundColor: 'black', position: 'absolute', opacity: 0.1 }} />

                <TouchableOpacity
                  style={{
                    height: 30,
                    width: '18%',
                    backgroundColor: '#B357C3',
                    borderRadius: 7,
                    justifyContent: 'center',
                    alignSelf: 'center',
                    position: 'absolute',
                    top: '48%',
                    left: '44%',
                    zIndex: 555
                  }}
                  onPress={() => {
                    // props.navigation.navigate('HomeViewAll');
                    Linking.openURL(clickedItem?.file)
                  }}>
                  <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 13, color: '#fff', textAlign: 'center' }}>
                    View PPT
                  </Text>
                </TouchableOpacity>
              </>

            }

            {!(clickedItem?.type == 'pdf' || clickedItem?.type == 'video') &&
              <>
                <Image
                  style={{ width: '100%', height: '100%' }}
                  source={{ uri: courseImage }}
                  resizeMode='contain'
                />
                <View style={{ width: '100%', height: '100%', backgroundColor: 'black', position: 'absolute', opacity: 0.1 }} />


              </>

            }






            {/* // <Video
    //   source={{ uri: clickedItem?.file}}
    //  style={{ width:'100%', height: 200,resizeMode:'stretch'}}
     
    //   controls={true}
    //  paused={pus}
    //  resizeMode="stretch"
    //   />  */}

          </View>

          <View style={{ width: '100%', padding: 10 }}>
            <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 16, color: "#fff", paddingVertical: 5, lineHeight: 19, fontWeight: '600' }}>About: {myData?.lesson_name}</Text>

            {myData?.chapter_steps?.length > 0 &&
              <View style={{ flexDirection: 'row', marginTop: 5 }}>
                <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 18, color: "#fff", lineHeight: 19, fontWeight: '700' }}>{videoIndex + 1}</Text>
                <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 18, color: "#B357C3", lineHeight: 19, fontWeight: '700' }}>/{myData?.chapter_steps?.length}</Text>
              </View>
            }

            <View style={{ width: '100%', height: 40, justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
              {/* <TouchableOpacity style={{ height: 35, justifyContent: 'center', backgroundColor: '#fff', borderRadius: 5, width: '32%' }}>
                <Text style={{fontFamily:FONTFAMILYSEMIBOLD, textAlign: 'center', color: '#4556A6', fontSize: 12, fontWeight: '600' }}>Course List</Text>
              </TouchableOpacity> */}

              <TouchableOpacity disabled={!((videoIndex + 1) < myData?.chapter_steps?.length)} style={{ height: 35, justifyContent: 'center', backgroundColor: '#fff', borderRadius: 5, width: '32%', opacity: ((videoIndex + 1) < myData?.chapter_steps?.length) ? 1 : 0.5 }}
                onPress={() => {
                  console.log((videoIndex + 1), ' < ', myData?.chapter_steps?.length);
                  if ((videoIndex + 1) < myData?.chapter_steps?.length) {
                    setclickedItem(myData?.chapter_steps[videoIndex + 1])
                    setvideoIndex(videoIndex + 1)
                  }

                }}>
                <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, textAlign: 'center', color: '#4556A6', fontSize: 12, fontWeight: '600' }}>Continue</Text>
              </TouchableOpacity>

              {courseMainData?.purchased && <TouchableOpacity onPress={() => {
                console.log("clickedItem?.is_completed", clickedItem);
                // return
                markAsComplete()
              }} disabled={(clickedItem?.type == 'survey' || clickedItem?.type == 'assignment' || clickedItem?.type == 'quiz') || (myData?.chapter_steps?.length == 0)} style={{ height: 35, justifyContent: 'center', backgroundColor: '#fff', borderRadius: 5, width: '32%', opacity: (clickedItem?.type == 'survey' || clickedItem?.type == 'assignment' || clickedItem?.type == 'quiz') || (myData?.chapter_steps?.length == 0) ? 0.5 : 1 }}>
                <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, textAlign: 'center', color: '#4556A6', fontSize: 12, fontWeight: '600' }}>{markIsCompletedUpdatedIndexData?.is_completed == 1 ? "Mark Incomplete" : "Mark Complete"}</Text>
              </TouchableOpacity>
              }
            </View>


            <View style={{ marginTop: 10, }}>
              <FlatList
                scrollEnabled={false}
                // ref={flatListRef}
                data={myData?.chapter_steps}
                showsHorizontalScrollIndicator={false}
                renderItem={renderSessionList}
                keyExtractor={item => item?.step_id}
                ListEmptyComponent={<View style={{ marginTop: '25%' }}><NoDataFound /></View>}
              />
            </View>

          </View>


          {myData?.recommended_product.length != 0 && <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: dimensions.SCREEN_WIDTH * 95 / 100,
              // alignSelf: 'center',
              marginTop: 20,
              marginLeft: 10
              // backgroundColor: 'white'
            }}>
            <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 18, color: 'white' }}>Recommended Product</Text>

            {/* <TouchableOpacity
              style={{
                height: 30,
                width: '18%',
                backgroundColor: '#B357C3',
                borderRadius: 7,
                justifyContent: 'center',
                alignSelf: 'center',
              }}
              onPress={() => {
                // props.navigation.navigate('HomeViewAll');
              }}>
              <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 13, color: '#fff', textAlign: 'center' }}>
                View All
              </Text>
            </TouchableOpacity> */}
          </View>
          }
          <View style={{
            marginTop: 20, width: '100%', marginBottom: 10,
            // backgroundColor: 'red'
          }}>
            <FlatList
              data={myData?.recommended_product}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) => <RenderRecommendedProduct key={index} item={item} index={index} handleWishlist={async () => {

                await handleWishlist(item?.product_id, 2)
                // await getCourseDetail()


              }} startLoader={() => setLoading(true)} stopLoader={() => setLoading(false)} onAddRemoveSuccess={async () => {
                // setLoading(true)
                // setLoading(true)
                await getCourseDetail()
                // await handleWishlist(item?.product_id, 2)

                // setLoading(false)
              }} />}

              keyExtractor={item => item.id}
            />
          </View>

          <View style={{ marginTop: 50 }} />
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
export default Disclaimers;
