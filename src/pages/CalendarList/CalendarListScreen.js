import { View, Text, Linking, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import LinearGradient from 'react-native-linear-gradient'
import HomeHeader2 from '../../component/HomeHeader2'
// import { TouchableOpacity } from 'react-native-gesture-handler'
import useAPI from '../../utility/hooks/useAPI'
import moment from 'moment'
import SkeletonContainer from '../../component/Skelton/SkeltonContainer'
import { GoalModal } from '../Goals/GetGoals'
import { Mycolors } from '../../utility/Mycolors'
import NoDataFound, { NoDataFoundModule } from '../../component/NoDataFound'
import MySearchBar from '../../component/MySearchBar'
import { FONTFAMILY } from '../../utility/fonts'
import { ScheduleModal } from '../Schedule/ScheduleModal'
import Modal from "react-native-modal";

import { StrikeThough } from '../../utility/FontStyles';

import DatePicker from 'react-native-date-picker';
import MyButtons from '../../component/MyButtons';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import CustomPicker from '../../component/CustomPicker';
// import { search } from 'react-native-country-picker-modal/lib/CountryService'
import { ScrollView } from 'react-native-gesture-handler'


const color = 'white'

const CalendarListScreen = (props) => {

  const dateString = props.route.params.dateString

  const [goals, setgoals] = useState([])
  const [schedules, setschedules] = useState([])
  const [goalModal, setGoalModal] = useState(false)
  const [goalModalData, setgoalModalData] = useState(null)

  const [scheduleModal, setscheduleModal] = useState(false)
  const [scheduleModalData, setscheduleModalData] = useState({})

  const { getAPI, loading } = useAPI()

  const [openFilterModal, setOpenFilterModal] = useState(false)

  const [filter, setFilter] = useState('');
  // const [type, settype] = useState(1)
  const [highlow, sethighlow] = useState(null)
  const [ratings, setratings] = useState(null)
  const [typeArr, settypeArr] = useState([
    'Schedule', 'Goals'
  ])
  const [typePicker, settypePicker] = useState(false)
  const [type, settype] = useState(null)


  const [open, setOpen] = useState(false);
  const [year, month, day,] = dateString.split('-').map(Number);
  // setDate(new Date(year, month - 1, day))
  // const [date, setDate] = useState(new Date());
  const [date, setDate] = useState(new Date(year, month - 1, day));
  const [isDateChanged, setisDateChanged] = useState(false)
  const selectedDate = moment(date).format('YYYY-MM-DD')
  const [reloadSearch, setreloadSearch] = useState({})


  const filterObj = {
    type: type == null ? null : type == 'Schedule' ? 1 : 2,
    search: filter.length == 0 ? null : filter,
    // date: isDateChanged ? selectedDate : null,
    date: selectedDate,
  };




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

    type && tagDataObj('Type', type, settype)
    filterObj?.date && tagDataObj('Date', filterObj?.date, () => {
      console.log("ddd");
      setisDateChanged(false)
      const [year, month, day,] = dateString.split('-').map(Number);
      setDate(new Date(year, month - 1, day))

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

    // return `get-goal?${queryString}`;
    return `schedule-goals-listing?date=${dateString}&${queryString}`;
  }




  function getScheduleGoalsListing(searchText = '') {

    console.log({ dateString });
    // return
    const endPointURL = convertToQueryString()
    // `schedule-goals-listing?search=${filter}&date=` + dateString
    console.log({ endPointURL });

    getAPI({ endPoint: endPointURL }).then((res) => {
      console.log("schedule-goals-listing", res.data);
      setschedules(res.data.schedules || [])
      setgoals(res.data.goals || [])
    })

  }

  useEffect(() => {

    getScheduleGoalsListing()

    return () => {

    }
  }, [reloadSearch])


  return (<>
    <Modal isVisible={openFilterModal}
      onBackdropPress={() => {
        setOpenFilterModal(false)
        // getSearch()
        getScheduleGoalsListing()
      }}
      swipeDirection="down"
    >
      <View style={{ width: '100%', backgroundColor: 'white', borderTopLeftRadius: 20, borderRadius: 20, alignItems: 'center', justifyContent: 'space-evenly', paddingVertical: 10 }}>


        {/* Title */}
        <View style={{ alignSelf: 'center', backgroundColor: 'white', alignItems: 'flex-start', marginBottom: 20, }}>
          <Text
            style={{
              fontFamily: FONTFAMILY,
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
              fontFamily: FONTFAMILY,
              // marginHorizontal: 14,
              color: 'black',
              // marginVertical:5,
              fontWeight: '500',
              alignSelf: 'flex-start'
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
            fontWeight: '500',
            color: '#292929',
            alignItems: 'center', marginTop: 10
          }} onPress={() => setOpen(true)}>
            <Text
              style={{
                marginHorizontal: 14,
                color: 'black',
              }}
            >
              {/* {isDateChanged ? selectedDate : "Choose Date"} */}
              {selectedDate}
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
              {/* {isDateChanged ?
                <TouchableOpacity onPress={() => setisDateChanged(false)}>
                  <Image style={{ height: 18, width: 18, marginLeft: 15 }} source={require("../../assets/crossed.png")} tintColor={'black'}></Image>
                </TouchableOpacity>
                : */}
              <Image style={{ height: 18, width: 18, marginLeft: 15 }} source={require("../../assets/calendar.png")}></Image>
              {/* } */}
            </View>
          </TouchableOpacity>
        </View>




        {/* <View style={{ alignSelf: 'flex-start', width: '90%', backgroundColor: 'white', alignItems: 'flex-start', marginLeft: 20, marginBottom: 20, }}>
                    <Text
                        style={{fontFamily:FONTFAMILY,
                            // marginHorizontal: 14,
                            color: 'black',
                            marginVertical: 5,
                            fontWeight: '500'
                        }}
                    >
                        {"Select Rating Filter"}
                    </Text>

                    <TouchableOpacity onPress={() => setselect1(false)} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
                        <View style={[{ width: 20, height: 20, borderRadius: 50, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#B357C3', }]}>
                            {!select1 && <View style={{ width: 15, height: 15, backgroundColor: '#A13BB6', borderRadius: 50 }}>

                            </View>
                            }
                        </View>
                        <Text
                            style={{
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
                            style={{
                                marginHorizontal: 14,
                                color: 'black',
                            }}
                        >
                            {"Product"}
                        </Text>
                    </TouchableOpacity>







                </View> */}

        <View style={{ marginBottom: 15, }}>
          <Text
            style={{
              fontFamily: FONTFAMILY,
              // marginHorizontal: 14,
              color: 'black',
              // marginVertical:5,
              fontWeight: '500',
              alignSelf: 'flex-start'
            }}
          >
            {"Select Type"}
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
          }} onPress={() => settypePicker(true)}>
            <Text
              style={{
                marginHorizontal: 14,
                color: 'black',
              }}
            >
              {type ?? "Select Type"}
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
              {type ?
                <TouchableOpacity onPress={() => settype(null)}>
                  <Image style={{ height: 18, width: 18, marginLeft: 15 }} source={require("../../assets/crossed.png")} tintColor={'black'}></Image>
                </TouchableOpacity>
                :
                <Image style={{ height: 18, width: 18, marginLeft: 15 }} source={require("../../assets/arrow-down-black.png")}></Image>
              }
            </View>
          </TouchableOpacity>
        </View>



        <CustomPicker showPicker={typePicker} handleClose={() => settypePicker(false)}
          handleSubmit={(item, index) => {
            settype(item)
          }}
          getValue={(item, index) => item}
          arr={typeArr}
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
            // getSearch(filter)
            getScheduleGoalsListing()

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
          title={'Schedule Details'}
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

        <MySearchBar setSearchVal={setFilter} isfilter placeHolder={'Search'} onSearchSubmit={(text) => { getScheduleGoalsListing(text) }} searchVal={filter} onFilterPress={() => {
          setOpenFilterModal(true)
        }} />

<ScrollView>
        <View style={{ width: '95%', marginBottom: 10, backgroundColor: 'transparent', marginLeft: 2 }}>
          {filterTagArray?.map((item, index) => {

            return <View style={{ flexDirection: 'row', paddingHorizontal: 10, }}>
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

        <View style={{ backgroundColor: 'transparent', width: '100%', height: "100%", paddingHorizontal: 20, marginTop: filterTagArray.length ? 0 : -15 }}>

          {/* <View style={{backgroundColor: 'red', width: '100%', height: 50}}>

          </View> */}
          {goals?.length != 0 &&
            <>
              <Text style={{ fontFamily: FONTFAMILY, fontSize: 20, color, fontFamily: FONTFAMILY }}>Goals</Text>


              {goals?.map((item, index) => {


                const dateTime = item?.achieve_date
                // `${moment(item?.achieve_date).format('MM/DD/YYYY')}, ${moment(item?.achieve_date, "HH:mm:ss").format("hh:mm A")}`

                return <>

                  {/* <View style={{ width: '100%', height: 200, backgroundColor: 'white', borderRadius: 10, flexDirection: 'column', marginTop: 10 }}>

                    <View style={{ width: '100%', height: 50, borderBottomColor: 'grey', borderBottomWidth: 0.5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 7 }}>

                      <View style={{ flex: 1, }}>
                        <Text style={{fontFamily:FONTFAMILY, fontSize: 15, color: 'black', }}>{item?.goal_statement}</Text>
                      </View>

                      <TouchableOpacity onPress={() => {
                        setGoalModal(true)
                        setgoalModalData(item)
                      }} style={{ width: 50, height: '100%', backgroundColor: "#B357C3", borderRadius: 7, marginLeft: 10, justifyContent: "center" }}>
                        <Text style={{fontFamily:FONTFAMILY, fontSize: 14, color: "#fff", textAlign: "center", fontWeight: "600" }}>View</Text>
                      </TouchableOpacity>

                    </View>
            
                    <View style={{ flex: 1, borderBottomColor: 'grey', borderBottomWidth: 0.5, flexDirection: 'column', justifyContent: 'space-evenly', alignItems: '', padding: 7, }}>


                      <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                        <Text style={{fontFamily:FONTFAMILY, fontSize: 15, color: 'black', }}>Start Date and Time:</Text>
                        <Text style={{fontFamily:FONTFAMILY, fontSize: 15, color: 'black', }}>{dateTime}</Text>
                      </View>
                      <Text style={{fontFamily:FONTFAMILY, fontSize: 15, color: 'black', }}>{item?.goal_for_me}</Text>

                      <TouchableOpacity style={{ paddingHorizontal: 10, height: 30, backgroundColor: "#47AFF0", borderRadius: 7, justifyContent: "center" }}>
                        <Text style={{fontFamily:FONTFAMILY, fontSize: 12, color: "#fff", textAlign: "center", fontWeight: "600" }}>{item?.goal_type}</Text>
                      </TouchableOpacity>

                    </View>



                  </View> */}
                  {/*  */}

                  <View style={{
                    width: '100%', backgroundColor: 'white', borderRadius: 10, flexDirection: 'column', marginTop: 10,

                  }}>

                    <View style={{
                      width: '100%', height: 50,
                      borderBottomColor: 'grey', borderBottomWidth: 0.5,
                      flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12,


                    }}>

                      <View style={{ flex: 1, }}>
                        <Text style={{ fontFamily: FONTFAMILY, fontSize: 15, color: 'black', fontFamily: FONTFAMILY }}>{item?.goal_statement}</Text>
                      </View>

                      <TouchableOpacity onPress={() => {
                        setGoalModal(true)
                        setgoalModalData(item)
                      }} style={{ width: 50, height: '100%', backgroundColor: "#B357C3", borderRadius: 7, marginLeft: 10, justifyContent: "center" }}>
                        <Text style={{ fontFamily: FONTFAMILY, fontSize: 14, color: "#fff", textAlign: "center", fontWeight: "600", fontFamily: FONTFAMILY }}>View</Text>
                      </TouchableOpacity>

                    </View>
                    {/* <View style={{width: '100%',
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 12,
                    },
                    shadowOpacity: 0.58,
                    shadowRadius: 16.00,
                    
                    elevation: 24, 
                    }}>
                  </View> */}
                    {/*  */}
                    <View style={{ borderBottomColor: 'grey', borderBottomWidth: 0.5, flexDirection: 'column', justifyContent: 'space-evenly', alignItems: '', padding: 12, }}>

                      <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: 10 }}>
                        <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                          <Text style={{ fontFamily: FONTFAMILY, fontSize: 15, color: 'black', fontFamily: FONTFAMILY }}>Start Date</Text>
                          <Text style={{ fontFamily: FONTFAMILY, fontSize: 15, color: 'grey', marginTop: 4, fontFamily: FONTFAMILY }}>{dateTime}</Text>
                        </View>

                        <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                          <Text style={{ fontFamily: FONTFAMILY, fontSize: 15, color: 'black', fontFamily: FONTFAMILY }}>Goal Type</Text>
                          <Text style={{ fontFamily: FONTFAMILY, fontSize: 15, color: 'grey', fontFamily: FONTFAMILY }}>{item?.goal_type}</Text>
                        </View>
                      </View>

                      <Text style={{ fontFamily: FONTFAMILY, fontSize: 15, color: 'black', marginTop: 12, fontFamily: FONTFAMILY }}>{"Goal Note"}</Text>
                      <Text style={{ fontFamily: FONTFAMILY, fontSize: 15, color: 'grey', marginTop: 4, marginBottom: 10, fontFamily: FONTFAMILY }}>{item?.goal_for_me}</Text>

                      {/* <TouchableOpacity onPress={() => {
                      Linking.openURL(item?.zoom_link)
                    }} style={{ paddingHorizontal: 10, height: 30, backgroundColor: "#47AFF0", borderRadius: 7, justifyContent: "center" }}>
                      <Text style={{fontFamily:FONTFAMILY, fontSize: 12, color: "#fff", textAlign: "center", fontWeight: "400" }}>Join Zoom Meeting</Text>
                    </TouchableOpacity> */}

                    </View>

                    {/* <TouchableOpacity onPress={() => {
                      Linking.openURL(item?.zoom_link)
                    }} style={{ paddingHorizontal: 20, height: 50, backgroundColor: Mycolors.Purple, borderBottomLeftRadius: 7, borderBottomRightRadius: 7, justifyContent: "center" }}>
                      <Text style={{fontFamily:FONTFAMILY, fontSize: 14, color: "#fff", textAlign: "center", fontWeight: "600" }}>Join Zoom Meeting</Text>
                    </TouchableOpacity> */}


                  </View>

                </>
              })}

            </>
          }
          <View style={{ height: 18 }}></View>
          {schedules?.length != 0 &&
            <>
              <Text style={{ fontFamily: FONTFAMILY, fontSize: 20, color, fontFamily: FONTFAMILY }}>Schedule</Text>

              {schedules?.map((item, index) => {
                console.log({ item });

                let dateTime = `${moment(item.schedule_start_date).format('MM/DD/YYYY')}, ${moment(item.schedule_start_time, "HH:mm:ss").format("hh:mm A")}`

                dateTime = item.schedule_start_date

                return <View style={{
                  width: '100%', backgroundColor: 'white', borderRadius: 10, flexDirection: 'column', marginTop: 10,

                }}>

                  <View style={{
                    width: '100%', height: 50,
                    borderBottomColor: 'grey', borderBottomWidth: 0.5,
                    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12,


                  }}>

                    <View style={{ flex: 1, }}>
                      <Text style={{ fontFamily: FONTFAMILY, fontSize: 15, color: 'black', fontFamily: FONTFAMILY }}>{item?.meeting_title}</Text>
                    </View>

                    <TouchableOpacity onPress={() => {
                      setscheduleModalData(item)
                      setscheduleModal(true)
                    }} style={{ width: 50, height: '100%', backgroundColor: "#B357C3", borderRadius: 7, marginLeft: 10, justifyContent: "center" }}>
                      <Text style={{ fontFamily: FONTFAMILY, fontSize: 14, color: "#fff", textAlign: "center", fontWeight: "600", fontFamily: FONTFAMILY }}>View</Text>
                    </TouchableOpacity>

                  </View>
                  {/* <View style={{width: '100%',
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 12,
                    },
                    shadowOpacity: 0.58,
                    shadowRadius: 16.00,
                    
                    elevation: 24, 
                    }}>
                  </View> */}
                  {/*  */}
                  <View style={{ borderBottomColor: 'grey', borderBottomWidth: 0.5, flexDirection: 'column', justifyContent: 'space-evenly', alignItems: '', padding: 12, }}>

                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: 10 }}>
                      <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Text style={{ fontFamily: FONTFAMILY, fontSize: 15, color: 'black', fontFamily: FONTFAMILY }}>Start Date</Text>
                        <Text style={{ fontFamily: FONTFAMILY, fontSize: 15, color: 'grey', marginTop: 4, fontFamily: FONTFAMILY }}>{dateTime}</Text>
                      </View>

                      <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Text style={{ fontFamily: FONTFAMILY, fontSize: 15, color: 'black', fontFamily: FONTFAMILY }}>Start Time</Text>
                        <Text style={{ fontFamily: FONTFAMILY, fontSize: 15, color: 'grey', fontFamily: FONTFAMILY }}>{item?.schedule_start_time}</Text>
                      </View>
                    </View>

                    <Text style={{ fontFamily: FONTFAMILY, fontSize: 15, color: 'black', marginTop: 12, fontFamily: FONTFAMILY }}>{'Notes'}</Text>
                    <Text style={{ fontFamily: FONTFAMILY, fontSize: 15, color: 'grey', marginTop: 4, marginBottom: 10, fontFamily: FONTFAMILY }}>{item?.note}</Text>

                    {/* <TouchableOpacity onPress={() => {
                      Linking.openURL(item?.zoom_link)
                    }} style={{ paddingHorizontal: 10, height: 30, backgroundColor: "#47AFF0", borderRadius: 7, justifyContent: "center" }}>
                      <Text style={{fontFamily:FONTFAMILY, fontSize: 12, color: "#fff", textAlign: "center", fontWeight: "400" }}>Join Zoom Meeting</Text>
                    </TouchableOpacity> */}

                  </View>

                  <TouchableOpacity onPress={() => {
                    Linking.openURL(item?.zoom_link)
                  }} style={{ paddingHorizontal: 20, height: 50, backgroundColor: Mycolors.Purple, borderBottomLeftRadius: 7, borderBottomRightRadius: 7, justifyContent: "center" }}>
                    <Text style={{ fontFamily: FONTFAMILY, fontSize: 14, color: "#fff", textAlign: "center", fontWeight: "600", fontFamily: FONTFAMILY }}>Join Zoom Meeting</Text>
                  </TouchableOpacity>


                </View>
              })}
            </>
          }


        </View>
        </ScrollView>
        <GoalModal goalModal={goalModal} setGoalModal={setGoalModal} goalModalData={goalModalData} />
        <ScheduleModal scheduleModal={scheduleModal} setScheduleModal={setscheduleModal} schedules={scheduleModalData} />


      </SafeAreaView>
      {loading && <SkeletonContainer />}
      {
        (goals?.length == 0 && schedules?.length == 0) &&

        <NoDataFoundModule marginBottom={'70%'} />
      }
    </LinearGradient>
  </>
  )
}

export default CalendarListScreen