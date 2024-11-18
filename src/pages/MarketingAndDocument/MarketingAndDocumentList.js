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
  TouchableOpacity, FlatList, ImageBackground,
  Linking,
  PermissionsAndroid,
  Platform
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
import MySearchBar from '../../component/MySearchBar';
import useAPI from '../../utility/hooks/useAPI';
import Pdf from 'react-native-pdf';
import RNFetchBlob from 'rn-fetch-blob';
import { FONTFAMILY, FONTFAMILYSEMIBOLD } from '../../utility/fonts';
import { requestDownloadingPermission, sliceTitle } from '../../utility/MyFunctions';
import NoDataFound from '../../component/NoDataFound';
import CustomPicker from '../../component/CustomPicker';
import DatePicker from 'react-native-date-picker';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import moment from 'moment';

const MarketingAndDocument = (props) => {

  const { type: catType, screenTitle, APIEndPoint } = props?.route?.params

  const { getAPI, loading } = useAPI()
  const [data, setdata] = useState([])

  // Filter vars
  const [openFilterModal, setOpenFilterModal] = useState(false)


  const [coursesCatIDs, setCoursesCatIDs] = useState([])

  const finalCoursesCatIDs = 1

  const [courseCatPicker, setCourseCatPicker] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const category_id = selectedCategory?.id ?? null

  const [filter, setFilter] = useState('');
  // const [type, settype] = useState(1)
  const [highlow, sethighlow] = useState(null)
  const [ratings, setratings] = useState(null)
  const [typeArr, settypeArr] = useState([
    'A-Type', 'B-Type', 'C-Type',
  ])
  const [typePicker, settypePicker] = useState(false)
  const [type, settype] = useState(null)


  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [isDateChanged, setisDateChanged] = useState(false)
  const selectedDate = moment(date).format('YYYY-MM-DD')
  const [reloadSearch, setreloadSearch] = useState({})

  const [goalModal, setGoalModal] = useState(false)
  const [goalModalData, setgoalModalData] = useState(null)





  const filterObj = {
    type,
    // filter: filter.length == 0 ? null : filter,
    search: filter.length == 0 ? null : filter,
    highlow,
    category_id,
    ratings,
    date: isDateChanged ? selectedDate : null,
  };

  // type == 1 && (filterObj['category_id'] = category_id)
  (filterObj['category_id'] = category_id)


  const filterTagArray = []

  function tagDataObj(title, value, deleteHandler) {
    filterTagArray.push({
      title,
      value,
      delete: () => {
        deleteHandler(null)
        setreloadSearch({
          state: 'update'
        })
      }
    })
  }

  function populateFilterTagArray() {
    // type && tagDataObj(type)
    // filterObj?.filter && filterTagArray.push(tagDataObj())
    highlow && tagDataObj('Price', highlow == 1 ? 'high to low' : 'low to high', sethighlow)
    ratings && tagDataObj('Rating', ratings, setratings)
    // type == 1 ? tagDataObj('Type', "Course", () => setselect1(true)) : tagDataObj('Type', "Product", () => setselect1(false))
    // type == 1 && (selectedCategory && tagDataObj('Category', selectedCategory?.title, setSelectedCategory))
    selectedCategory && tagDataObj('Category', selectedCategory?.name, setSelectedCategory)
    filterObj?.date && tagDataObj('Date', filterObj?.date, () => {
      console.log("ddd");
      setisDateChanged(false)
    })
  }

  populateFilterTagArray()

  function convertToQueryString() {


    const queryString = Object.entries(filterObj)
      .filter(([key, value]) => value !== null) // Filter out null values
      .map(([key, value]) => {

        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      })
      .join('&');

    // if (comingFrom?.baseUrl) {
    //   return `${comingFrom?.baseUrl}${queryString}`;
    // }

    return `${APIEndPoint}?${queryString}`;
  }



  async function getCatID() {
    const res = await getAPI({ endPoint: 'category' + '?type=' + catType })

    if (res) {
      setCoursesCatIDs(res?.data)
    }
  }
  useEffect(() => {
    getCatID()

    return () => {

    }
  }, [])

  // console.log("convertToQueryString()", convertToQueryString());


  const getSearch = async (search = '') => {

    const endPointURL = convertToQueryString()

    console.log({ endPointURL });

    // const res = await getAPI({ endPoint: "marketing?search=" + search })
    const res = await getAPI({ endPoint: endPointURL })

    if (res) {
      setdata(res?.data)
    }
  }


  useEffect(() => {

    getSearch()

    return () => {

    }
  }, [reloadSearch])


  return (<>
    <Modal isVisible={openFilterModal}
      onBackdropPress={() => {
        setOpenFilterModal(false)
        getSearch()
      }}
      swipeDirection="down"
    >
      <View style={{ width: '100%', backgroundColor: 'white', borderTopLeftRadius: 20, borderRadius: 20, alignItems: 'center', justifyContent: 'space-evenly', paddingVertical: 10 }}>


        {/* Title */}
        <View style={{ alignSelf: 'center', backgroundColor: 'white', alignItems: 'flex-start', marginBottom: 20, }}>
          <Text
            style={{
              fontFamily: FONTFAMILYSEMIBOLD,
              // marginHorizontal: 14,
              color: 'black',
              marginVertical: 5,
              fontWeight: '600',
              fontSize: 18
            }}
          >
            {"Filter"}
          </Text>


        </View>












        <View style={{ marginBottom: 15, }}>
          <Text
            style={{
              fontFamily: FONTFAMILYSEMIBOLD,
              // marginHorizontal: 14,
              color: 'black',
              // marginVertical:5,
              fontWeight: '500',
              alignSelf: 'flex-start'
            }}
          >
            {"Select Category"}
          </Text>
          <TouchableOpacity style={{
            height: 50,
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderRadius: 10,
            width: '90%',
            backgroundColor: 'white',
            alignSelf: 'center',
            borderRadius: 5,
            borderColor: '#959FA6',
            borderWidth: 0.2,
            fontWeight: '500',
            color: '#292929',
            alignItems: 'center', marginTop: 10
          }} onPress={() => setCourseCatPicker(true)}>
            <Text
              style={{
                marginHorizontal: 14,
                color: 'black',
              }}
            >
              {selectedCategory?.name ?? "Choose Category"}
            </Text>
            <View style={[{
              width: 38,
              height: 38,
              backgroundColor: 'transparent',
              borderRadius: 10,
              marginVertical: 5,
              marginRight: 12,
              justifyContent: 'center',
            },]}>
              {selectedCategory ?
                <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                  <Image style={{ height: 18, width: 18, marginLeft: 15 }} source={require("../../assets/crossed.png")} tintColor={'black'}></Image>
                </TouchableOpacity>
                :
                <Image style={{ height: 18, width: 18, marginLeft: 15 }} source={require("../../assets/arrow-down-black.png")}></Image>
              }
            </View>
          </TouchableOpacity>
        </View>


        <CustomPicker showPicker={courseCatPicker} handleClose={() => setCourseCatPicker(false)}
          handleSubmit={(item, index) => {
            setSelectedCategory(item)
          }}
          getValue={(item, index) => item?.name}
          // arr={finalCoursesCatIDs}
          arr={coursesCatIDs}
          title={'Select Category'}
        />


        <MyButtons
          title="Submit"
          height={60}
          width={'90%'}
          borderRadius={5}
          fontWeight={'700'}
          alignSelf="center"
          press={() => {
            setOpenFilterModal(false)
            getSearch(filter)

          }}
          marginHorizontal={20}
          titlecolor={Mycolors.BG_COLOR}
          backgroundColor={Mycolors.Purple}
          marginVertical={10}
        />
      </View>
    </Modal>
    <LinearGradient colors={['#300076', '#53045F']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <HomeHeader2
          height={60}
          // paddingHorizontal={15}
          title={screenTitle}
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
        <MySearchBar searchVal={filter} setSearchVal={setFilter} isfilter onFilterPress={() => {
          setOpenFilterModal(true)
          // console.log({data,data2});

        }} onSearchSubmit={(text) => {
          getSearch(text)
        }} placeHolder={'Courses and Products'} />
        <View style={{ width: '95%', marginBottom: 10, backgroundColor: 'transparent', marginLeft: 2 }}>
          {filterTagArray?.map((item, index) => {

            return <View style={{ flexDirection: 'row', paddingHorizontal: 10, padding: 5 }}>
              <View style={{ backgroundColor: '#B357C3', padding: 10, borderRadius: 7, flexDirection: 'row', justifyContent: 'center' }}>
                <Text style={{ fontFamily: FONTFAMILY, color: 'white', fontWeight: '600' }}>{item?.title}: </Text>
                <Text style={{ fontFamily: FONTFAMILY, color: 'white', }}> {item?.value}</Text>
                <TouchableOpacity onPress={item?.delete} style={{ marginLeft: 8, left: 5 }}>
                  <Image
                    source={require('../../assets/trash.png')}
                    resizeMode="contain"
                    style={{
                      height: responsiveHeight(1.9),
                      width: responsiveWidth(6.9),
                    }}
                    tintColor={"white"}
                  /></TouchableOpacity>
              </View>


            </View>

          })}
        </View>
        <View style={{ marginTop: 10, }}>
          <FlatList

            data={data}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => {
              const { id,
                title,
                file,
                category_name,
                category_image,
                created_at, image } = item
              return (
                <View style={{ marginTop: 20, width: dimensions.SCREEN_WIDTH, paddingHorizontal: 10 }}>
                  <View style={{ width: '100%', alignItems: 'center', backgroundColor: 'white', height: 'auto', justifyContent: 'space-evenly', paddingBottom: 15 }}>
                    <View style={{ width: '100%', overflow: 'hidden', height: 250 }}>
                      {/* <Pdf */}
                      <Image
                        source={{ uri: image }}
                        resizeMode='contain'
                        // scrollEnabled={false}
                        // source={{ uri: file }}
                        // onLoadComplete={(numberOfPages, filePath) => {
                        //   console.log(`Number of pages: ${numberOfPages}`);
                        // }}
                        // onPageChanged={(page, numberOfPages) => {
                        //   console.log(`Current page: ${page}`);
                        // }}
                        // onError={(error) => {
                        //   console.log(error);
                        // }}
                        style={{
                          width: '100%',
                          height: 300,
                          backgroundColor: 'white',
                        }}
                      />
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 15, marginBottom: 10, justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'transparent', width: '100%', paddingHorizontal: 10 }}>
                      <View style={{ backgroundColor: 'transparent' }}>
                        <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 20, color: '#4556A6', }}>{sliceTitle(title,25)}</Text>
                        <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 15, color: '#4556A6', }}>{category_name}</Text>
                      </View>
                      <TouchableOpacity onPress={() => {
                        // Linking.openURL(file)
                        requestDownloadingPermission(data?.[index]?.file)
                      }}
                        style={{
                          width: 60,
                          height: 30,
                          // paddingVertical: 10,
                          borderRadius: 500,
                          justifyContent: 'center',
                          // backgroundColor: '#4556A6',
                          backgroundColor: '#B357C3',
                          alignItems: 'center',
                          flexDirection: 'row'
                        }}>
                        <Image source={require('../../assets/White_download_icon.png')} style={{ height: 18, width: 18, marginTop: 2 }} />
                        {/* <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, color: '#fff', textAlign: 'center', marginLeft: 10, fontWeight: '500' }}>
                        Download
                      </Text> */}
                      </TouchableOpacity>
                    </View>

                  </View>
                </View>

              )
            }}
            keyExtractor={item => item.id}
            ListFooterComponent={<View style={{ width: 200, height: 200 }} />}
            ListEmptyComponent={<NoDataFound styles={{ marginTop: '10%' }} />}
          />
        </View>

        {loading ? <Loader /> : null}
      </SafeAreaView>
    </LinearGradient>
  </>
  )
}

export default MarketingAndDocument

