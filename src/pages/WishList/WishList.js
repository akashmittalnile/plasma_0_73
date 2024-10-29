import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ImageBackground, SafeAreaView, StatusBar, ScrollView, TextInput, Keyboard, Alert, TouchableOpacity, } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Loader from '../../WebApi/Loader';
import HomeHeader from '../../component/HomeHeader';
import { dimensions, Mycolors } from '../../utility/Mycolors';
import MySearchBar from '../../component/MySearchBar';
import useAPI from '../../utility/hooks/useAPI';
import HomeHeader2 from '../../component/HomeHeader2';
import NoDataFound from '../../component/NoDataFound';
import { StrikeThough } from '../../utility/FontStyles';
import Modal from "react-native-modal";
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import MyButtons from '../../component/MyButtons';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import CustomPicker from '../../component/CustomPicker';
import { handleShare } from '../../component/ShareComponent';
import { addToWishlist } from '../../WebApi/GlobalAPICalls';
import { useSelector } from 'react-redux';
import LessonComp from '../../component/LessonComp';
import { FONTFAMILY, FONTFAMILYSEMIBOLD } from '../../utility/fonts';

// const filterObj = {
//     type: "2",
//     filter: "plasma",
//     highlow: "2",
//     category_id: "3",
//     ratings: "3",
//     date: "2000-04-13"
// }

function addFilterToURL() {

}

const WishList = (props) => {
  // const [loading, setLoading] = useState(false)
  const user_details = useSelector(state => state.user.user_details);
  const [flag, setFlag] = useState('http://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg')
  const [code, setcode] = useState('+1')
  const [My_Alert, setMy_Alert] = useState(false)
  const [alert_sms, setalert_sms] = useState('')
  const [select1, setselect1] = useState(false)
  const [data, setdata] = useState([])
  const [data2, setdata2] = useState([])
  const [openFilterModal, setOpenFilterModal] = useState(false)

  const [filter, setFilter] = useState('');
  // const [type, settype] = useState(1)
  const [highlow, sethighlow] = useState(null)
  const [ratings, setratings] = useState(null)
  const [coursesCatIDs, setCoursesCatIDs] = useState([])
  const [courseCatPicker, setCourseCatPicker] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const category_id = selectedCategory?.id ?? null

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [isDateChanged, setisDateChanged] = useState(false)
  const selectedDate = moment(date).format('YYYY-MM-DD')
  const [reloadSearch, setreloadSearch] = useState({})

  const type = select1 ? 2 : 1
  const isProductORCourse = select1 ? 2 : 1

  const { getAPI, loading } = useAPI()

  const filterObj = {
    type,
    filter: filter.length == 0 ? null : filter,
    highlow,
    // category_id,
    ratings,
    date: isDateChanged ? selectedDate : null,
  };

  type == 1 && (filterObj['category_id'] = category_id)


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
    type == 1 ? tagDataObj('Type', "Course", () => setselect1(true)) : tagDataObj('Type', "Product", () => setselect1(false))
    type == 1 && (selectedCategory && tagDataObj('Category', selectedCategory?.title, setSelectedCategory))
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

    return `wishlist?${queryString}`;
  }




  // const result = convertToQueryString(filterObj);
  // console.log(result); // "wishlist?type=2&filter=Foundation&highlow=2&category_id=3&ratings=3&date=2000-04-13"


  async function getSearch() {
    // if (!searchText) {
    //     return
    // }
    // const searchText = filter

    const endPointURL = convertToQueryString()

    // const endPoint = isDateChanged ? `search?filter=${searchText}&date=${selectedDate}` : `search?filter=${searchText}`

    console.log({ endPointURL });

    const res = await getAPI({ endPoint: endPointURL })

    if (res) {
      select1 ? setdata2(res?.data) : setdata(res?.data)
      // setdata(res?.data)
      // setdata2(res?.data?.product)
    }

  }

  async function getCoursesCatID() {
    const res = await getAPI({ endPoint: 'course-category' })

    if (res) {
      setCoursesCatIDs(res?.data)
    }
  }


  useEffect(() => {

    getSearch("")

  }, [select1, reloadSearch])

  useEffect(() => {
    getCoursesCatID()

    return () => {

    }
  }, [])





  return (<>
    <Modal isVisible={openFilterModal}
      onBackdropPress={() => {
        setOpenFilterModal(false)
        getSearch()
      }}
      swipeDirection="down"
    >
      <View style={{ width: '100%', backgroundColor: 'white', borderTopLeftRadius: 20, borderRadius: 20, alignItems: 'center', justifyContent: 'space-evenly', paddingVertical: 10 }}>

        <View style={{ alignSelf: 'center', backgroundColor: 'white', alignItems: 'flex-start', marginBottom: 20, }}>
          <Text
            style={{
              // marginHorizontal: 14,
              color: 'black',
              marginVertical: 5,
              // fontWeight: '600'
              fontSize: 18, fontFamily:FONTFAMILYSEMIBOLD
            }}
          >
            {"Wishlist Filter"}
          </Text>


        </View>


        <View style={{ alignSelf: 'flex-start', width: '90%', backgroundColor: 'white', alignItems: 'flex-start', marginLeft: 20, marginBottom: 20, }}>
          <Text
            style={{
              // marginHorizontal: 14,
              color: 'black',
              marginVertical: 5,
               fontFamily:FONTFAMILYSEMIBOLD
            }}
          >
            {"Select Price Filter"}
          </Text>

          <TouchableOpacity onPress={() => sethighlow(1)} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
            <View style={[{ width: 20, height: 20, borderRadius: 50, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#B357C3', }]}>
              {highlow == 1 && <View style={{ width: 15, height: 15, backgroundColor: '#A13BB6', borderRadius: 50 }}>

              </View>
              }
            </View>
            <Text
              style={{fontFamily:FONTFAMILY,
                marginHorizontal: 14,
                color: 'black', fontFamily:FONTFAMILY
              }}
            >
              {"High To Low"}
            </Text>
          </TouchableOpacity>


          <TouchableOpacity onPress={() => sethighlow(2)} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
            <View style={[{ width: 20, height: 20, borderRadius: 50, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#B357C3', }]}>
              {highlow == 2 && <View style={{ width: 15, height: 15, backgroundColor: '#A13BB6', borderRadius: 50 }}>

              </View>
              }
            </View>
            <Text
              style={{fontFamily:FONTFAMILY,
                marginHorizontal: 14,
                color: 'black',
              }}
            >
              {"Low To High"}
            </Text>
          </TouchableOpacity>
        </View>

        <DatePicker
          modal
          open={open}
          date={date}
          onConfirm={(date) => {
            setOpen(false);
            setDate(date);
            setisDateChanged(true)
          }}
          onCancel={() => {
            setOpen(false);
          }}
          mode="date"
        />
        <View style={{ marginBottom: 15, }}>
          <Text
            style={{
              // marginHorizontal: 14,
              color: 'black',
              // marginVertical:5,
              // 
              alignSelf: 'flex-start',
              fontFamily: FONTFAMILYSEMIBOLD
            }}
          >
            {"Choose Date"}
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
            // 
            color: '#292929',
            alignItems: 'center', marginTop: 10,
            
          }} onPress={() => setOpen(true)}>
            <Text
              style={{fontFamily:FONTFAMILYSEMIBOLD,
                marginHorizontal: 14,
                color: 'black',
              }}
            >
              {isDateChanged ? selectedDate : "Choose Date"}
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
              {isDateChanged ?
                <TouchableOpacity onPress={() => setisDateChanged(false)}>
                  <Image style={{ height: 18, width: 18, marginLeft: 15 }} source={require("../../assets/crossed.png")} tintColor={'black'}></Image>
                </TouchableOpacity>
                :
                <Image style={{ height: 18, width: 18, marginLeft: 15 }} source={require("../../assets/calendar.png")}></Image>
              }
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ alignSelf: 'flex-start', width: '90%', backgroundColor: 'white', alignItems: 'flex-start', marginLeft: 20, marginBottom: 20, }}>
          <Text
            style={{
              // marginHorizontal: 14,
              color: 'black',
              marginVertical: 5,
              // fontWeight: '500'
              fontFamily: FONTFAMILYSEMIBOLD
            }}
          >
            {"Select Rating Filter"}
          </Text>

          <TouchableOpacity onPress={() => setratings(4)} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
            <View style={[{ width: 20, height: 20, borderRadius: 50, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#B357C3', }]}>
              {ratings == 4 && <View style={{ width: 15, height: 15, backgroundColor: '#A13BB6', borderRadius: 50 }}>

              </View>
              }
            </View>
            <Text
              style={{fontFamily:FONTFAMILY,
                marginHorizontal: 14,
                color: 'black',
              }}
            >
              {"4 and More"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setratings(3)} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
            <View style={[{ width: 20, height: 20, borderRadius: 50, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#B357C3', }]}>
              {ratings == 3 && <View style={{ width: 15, height: 15, backgroundColor: '#A13BB6', borderRadius: 50 }}>

              </View>
              }
            </View>
            <Text
              style={{fontFamily:FONTFAMILY,
                marginHorizontal: 14,
                color: 'black',
              }}
            >
              {"3 and More"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setratings(2)} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
            <View style={[{ width: 20, height: 20, borderRadius: 50, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#B357C3', }]}>
              {ratings == 2 && <View style={{ width: 15, height: 15, backgroundColor: '#A13BB6', borderRadius: 50 }}>

              </View>
              }
            </View>
            <Text
              style={{fontFamily:FONTFAMILY,
                marginHorizontal: 14,
                color: 'black',
              }}
            >
              {"2 and More"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setratings(1)} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
            <View style={[{ width: 20, height: 20, borderRadius: 50, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#B357C3', }]}>
              {ratings == 1 && <View style={{ width: 15, height: 15, backgroundColor: '#A13BB6', borderRadius: 50 }}>

              </View>
              }
            </View>
            <Text
              style={{fontFamily:FONTFAMILY,
                marginHorizontal: 14,
                color: 'black',
              }}
            >
              {"1 and More"}
            </Text>
          </TouchableOpacity>





        </View>


        <View style={{ alignSelf: 'flex-start', width: '90%', backgroundColor: 'white', alignItems: 'flex-start', marginLeft: 20, marginBottom: 20, }}>
          <Text
            style={{
              // marginHorizontal: 14,
              color: 'black',
              marginVertical: 5,
              // fontWeight: '500',
              fontFamily: FONTFAMILYSEMIBOLD
            }}
          >
            {"Select Category Type"}
          </Text>

          <TouchableOpacity onPress={() => setselect1(false)} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
            <View style={[{ width: 20, height: 20, borderRadius: 50, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#B357C3', }]}>
              {!select1 && <View style={{ width: 15, height: 15, backgroundColor: '#A13BB6', borderRadius: 50 }}>

              </View>
              }
            </View>
            <Text
              style={{fontFamily:FONTFAMILYSEMIBOLD,
                marginHorizontal: 14,
                color: 'black',
              }}
            >
              {"Course"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setselect1(true)} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
            <View style={[{ width: 20, height: 20, borderRadius: 50, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#B357C3', }]}>
              {select1 && <View style={{ width: 15, height: 15, backgroundColor: '#A13BB6', borderRadius: 50 }}>

              </View>
              }
            </View>
            <Text
              style={{fontFamily:FONTFAMILYSEMIBOLD,
                marginHorizontal: 14,
                color: 'black',
              }}
            >
              {"Product"}
            </Text>
          </TouchableOpacity>







        </View>

        {!select1 && <View style={{ marginBottom: 15, }}>
          <Text
            style={{
              // marginHorizontal: 14,
              color: 'black',
              // marginVertical:5,
              
              alignSelf: 'flex-start',
              fontFamily: FONTFAMILYSEMIBOLD
            }}
          >
            {"Select Category For Course"}
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
          
            color: '#292929',
            alignItems: 'center', marginTop: 10
          }} onPress={() => setCourseCatPicker(true)}>
            <Text
              style={{fontFamily:FONTFAMILYSEMIBOLD,
                marginHorizontal: 14,
                color: 'black',
              }}
            >
              {selectedCategory?.title ?? "Choose Category"}
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

        }

        <CustomPicker showPicker={courseCatPicker} handleClose={() => setCourseCatPicker(false)}
          handleSubmit={(item, index) => {
            setSelectedCategory(item)
          }}
          getValue={(item, index) => item?.title}
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
    <LinearGradient colors={['#300076', '#53045F']} style={{ flex: 1, }}>


      <SafeAreaView />
      <StatusBar />


      {/* ******************Header******************** */}
      {/* <HomeHeader2
        height={60}
        // paddingHorizontal={15}
        title={'Wish List'}
        // press1={() => {
        //     props.navigation.goBack();
        // }}
        // img1={require('../../assets/arrow_right_black.png')}
        // img1width={25}
        // img1height={25}
        // press2={() => { props.navigation.navigate('Notification') }}
        // img2={require('../../assets/notification.png')}
        // img2width={25}
        // img2height={25}
        // press3={() => { }}
        // img3={require('../../assets/shoppingbag.png')}
        // img3width={25}
        // img3height={25}
        backgroundColor={'transparent'}
      /> */}
      <HomeHeader />

      <ScrollView>
        <MySearchBar searchVal={filter} setSearchVal={setFilter} isfilter onFilterPress={() => {
          setOpenFilterModal(true)
        }} onSearchSubmit={(text) => {
          getSearch(text)
        }} placeHolder={'Wishlists'} />


        <View style={{ width: '95%', marginBottom: 10, backgroundColor: 'transparent', marginLeft: 2 }}>
          {filterTagArray?.map((item, index) => {

            if (item?.title == 'Type') {
              return <React.Fragment key={index}></React.Fragment>
            }

            return <View key={index} style={{ flexDirection: 'row', padding: 5, }}>
              <View style={{ backgroundColor: '#B357C3', padding: 10, borderRadius: 7, flexDirection: 'row', justifyContent: 'center' }}>
                <Text style={{fontFamily:FONTFAMILYSEMIBOLD, color: 'white' }}>{item?.title}: </Text>
                <Text style={{fontFamily:FONTFAMILYSEMIBOLD, color: 'white', }}> {item?.value}</Text>
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

        {/* ******************Search******************** */}
        {/* <MySearchBar placeHolder={'Search by order number'} /> */}
        {/* ******************Type******************** */}
        <View style={{ width: '95%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, }}>

          <TouchableOpacity style={{ width: '48%', paddingVertical: 12, borderRadius: 4, justifyContent: 'center', backgroundColor: select1 ? '#fff' : '#B357C3' }}
            onPress={() => {
              setselect1(false)
              console.log("convertToQueryString", convertToQueryString(), filterTagArray)
            }}>
            <Text style={{fontFamily:FONTFAMILYSEMIBOLD, color: select1 ? '#000' : '#fff', textAlign: 'center' }}>Course</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ width: '48%', paddingVertical: 12, borderRadius: 4, justifyContent: 'center', backgroundColor: select1 ? '#B357C3' : '#fff' }}
            onPress={() => { setselect1(true) }}>
            <Text style={{fontFamily:FONTFAMILYSEMIBOLD, color: select1 ? '#fff' : '#000', textAlign: 'center' }}>Product</Text>
          </TouchableOpacity>
        </View>



        {/* ****************************Tranding courde flatlist****************** */}
        {!select1 ?
          <View style={{ marginTop: 10, }}>
            <FlatList
              scrollEnabled={false}
              data={data}
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id}
              renderItem={({ item }) => {

                const {
                  object_title,
                  object_image,
                  object_id,
                  object_sale_price,
                  object_price,
                  object_user_enroll,
                  object_rating,
                  object_lesson_count
                } = item

                return (
                  <TouchableOpacity onPress={() => {
                    props.navigation.navigate('CourseDetails', { data: { id: object_id }, })
                  }} style={{ width: dimensions.SCREEN_WIDTH * 95 / 100, alignSelf: 'center', marginTop: 15 }}>
                    <ImageBackground style={{ height: 170, width: '100%', borderTopLeftRadius: 7, borderTopRightRadius: 7, overflow: 'hidden' }} source={{ uri: object_image }}>
                      <View style={{ flexDirection: "row", alignSelf: "flex-end", marginTop: 5 }}>
                        <TouchableOpacity onPress={async () => {

                          console.log("sss");
                          await addToWishlist(object_id, 1, user_details?.access_token)
                          // await getCartList()
                          setreloadSearch({
                            state: 'update'
                          })
                        }} style={{ marginRight: 10 }}>
                          <Image style={{ height: 25, width: 25, tintColor: "#B357C3", }} source={require("../../assets/heartFilled.png")}></Image>

                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                          handleShare(object_title)
                        }} style={{ marginRight: 10 }}>
                          <Image style={{ height: 25, width: 25, }} source={require("../../assets/ShareNetwork.png")}></Image>
                        </TouchableOpacity>
                      </View>

                    </ImageBackground>

                    <View style={{ width: '100%', backgroundColor: '#fff', borderBottomLeftRadius: 5, borderBottomRightRadius: 5, padding: 10 }}>
                      <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 13, color: "#000", padding: 5 }}>{object_title}</Text>

                      <View style={{ flexDirection: "row" }}>

                        {/* <Text style={[{fontFamily:FONTFAMILY, fontSize: 14, color: "#B357C3", padding: 4, marginLeft: 2 }, StrikeThough]}>${object_price}</Text> */}
                        <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 14, color: "#B357C3", padding: 4, marginLeft: 2 }}>${object_sale_price}</Text>

                        <View style={{ flexDirection: "row", padding: 4, marginLeft: 25 }}>
                          <Image style={{ height: 12, width: 12, marginTop: 3 }} source={require("../../assets/star.png")}></Image>
                          <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 13, color: "#000", }}> {object_rating}</Text>
                        </View>

                        {/* <TouchableOpacity style={{ height: 23, width: 60, backgroundColor: "#fff", borderRadius: 4, justifyContent: "center", borderWidth: 1, borderColor: '#B357C3', marginLeft: 20 }}>
                          <Text style={{fontFamily:FONTFAMILY, fontSize: 12, color: "#B357C3", textAlign: "center" }}>{object_lesson_count} lesson</Text>
                        </TouchableOpacity> */}
                        <LessonComp count={object_lesson_count} style={{marginLeft: 20}}/>


                      </View>

                      <View style={{ flexDirection: 'row', }}>

                        <Image style={{ height: 28, width: 28, marginLeft: 5 }} source={require("../../assets/Rectangle103.png")}></Image>
                        <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 12, color: "grey", marginTop: 5, marginLeft: 10 }}> {object_user_enroll} enrolled</Text>

                      </View>

                    </View>

                  </TouchableOpacity>

                )
              }}
              ListEmptyComponent={<NoDataFound styles={{ marginTop: "27%" }} />}

            />
          </View>
          //  {/* ****************************Tranding product flatlist****************** */}
          :

          <View style={{ marginTop: 10, }}>
            <FlatList
              data={data2}
              scrollEnabled={false}
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id}
              renderItem={({ item }) => {

                const { object_id,
                  object_title,
                  object_price,
                  object_user_enroll,
                  object_sale_price,
                  object_rating,
                  object_image } = item

                return (
                  <TouchableOpacity onPress={() => {
                    props.navigation.navigate('ProductDetails', { data: { id: object_id } })
                  }} style={{ width: dimensions.SCREEN_WIDTH * 95 / 100, marginTop: 12, alignSelf: 'center' }}>
                    <ImageBackground style={{ height: 150, width: '100%', borderTopLeftRadius: 7, borderTopRightRadius: 7, overflow: 'hidden' }} source={{ uri: object_image ? object_image[0]?.image : '' }}>
                      <View style={{ flexDirection: "row", alignSelf: "flex-end", marginTop: 5 }}>
                        <TouchableOpacity onPress={async () => {
                          await addToWishlist(object_id, 2, user_details.access_token)

                          setreloadSearch({
                            state: 'update'
                          })

                        }} style={{ marginRight: 10 }}>
                          <Image style={{ height: 25, width: 25, tintColor: "#B357C3", }} source={require("../../assets/heartFilled.png")}></Image>

                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                          handleShare(object_title)
                        }} style={{ marginRight: 10 }}>
                          <Image style={{ height: 25, width: 25, }} source={require("../../assets/ShareNetwork.png")}></Image>
                        </TouchableOpacity>
                      </View>

                    </ImageBackground>

                    <View style={{ width: '100%', backgroundColor: '#fff', borderBottomLeftRadius: 5, borderBottomRightRadius: 5, paddingBottom: 10, padding: 5 }}>
                      <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 13, color: "#000", padding: 5 }}>{object_title}</Text>

                      <View style={{ flexDirection: "row", }}>

                        <Text style={[{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 14, color: "#B357C3", padding: 4, marginLeft: 2 }, StrikeThough]}>{object_price}</Text>
                        <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 14, color: "#B357C3", padding: 4, marginLeft: 2 }}>{object_sale_price}</Text>

                        <View style={{ flexDirection: "row", padding: 4, marginLeft: 25 }}>
                          <Image style={{ height: 12, width: 12, marginTop: 3 }} source={require("../../assets/star.png")}></Image>
                          <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 13, color: "#000", }}> {object_rating}</Text>
                        </View>
                      </View>


                      {/* <View style={{ width: '95%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                       <TouchableOpacity style={{ width: '48%', paddingVertical: 10, borderRadius: 4, justifyContent: 'center', backgroundColor: '#B357C3' }}>
                                         <Text style={{fontFamily:FONTFAMILY, color: '#fff', textAlign: 'center' }}>Add to cart</Text>
                                       </TouchableOpacity>
                                       <TouchableOpacity style={{ width: '48%', paddingVertical: 10, borderRadius: 4, justifyContent: 'center', backgroundColor: '#4556A6' }}>
                                         <Text style={{fontFamily:FONTFAMILY, color: '#fff', textAlign: 'center' }}>Buy Now</Text>
                                       </TouchableOpacity>
             
                                     </View> */}


                    </View>

                  </TouchableOpacity>

                )
              }}
              ListEmptyComponent={<NoDataFound styles={{ marginTop: "27%" }} />}
            />
          </View>


        }




        {loading ?
          <Loader />
          : null
        }
        <View style={{ width: 50, height: 150 }} />
      </ScrollView>
    </LinearGradient>
  </>
  );
}
const styles = StyleSheet.create({


});
export default WishList