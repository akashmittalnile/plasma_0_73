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
  Linking,
} from 'react-native';
import OnGoing from './clock.png'
import Zoom from './Zoom.png'
import MyButtons from '../../component/MyButtons';
import MyInputText from '../../component/MyInputText';
import { dimensions, Mycolors } from '../../utility/Mycolors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import {
  saveUserResult,
  onLogoutUser,
  saveUserToken,
} from '../../redux/actions/user_action';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
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
import EventCalendar from 'react-native-events-calendar';
import useAPI from '../../utility/hooks/useAPI';
import SkeletonContainer from '../../component/Skelton/SkeltonContainer';
import DatePicker from 'react-native-date-picker';
import { FONTFAMILY } from '../../utility/fonts';


// "start": "2024-07-03 15:58",
// "end": "2024-05-03 15:58",

// start: '2024-02-13 02:00:00', // yyyy/mm/dd
//       end: '2024-02-13 04:00:00',
const Schedule = props => {
  const dispatch = useDispatch();
  // const [loading, setLoading] = useState(false);
  const [My_Alert, setMy_Alert] = useState(false);
  const [alert_sms, setalert_sms] = useState('');
  const [events, setEvents] = useState([{
    "start": "2024-07-19 15:58",
    "end": "2024-07-19 16:58",
    "meeting_title": "testing for same user",
    "user_id": "7",
    "id": 8,
    "schedule_start_time": "15:58",
    "schedule_start_date": "2024-05-03",
    "schedule_end_time": "15:58",
    "zoom_link": "asasadxasa",
    "note": "zasSSADADsad",
    "meeting_type": "Bi-monthly",
    "created_at": "2024-07-12T08:34:13.000000Z",
    "updated_at": "2024-07-12T08:34:13.000000Z"
  }]);
  const { getAPI, loading } = useAPI()
  const Color = { WHITE: 'white', LIGHT_BLACK: 'grey', PRIMARY: '#ACCE39' }

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const selectedDate = moment(date).format('YYYY-MM-DD')

  async function getSchedule() {
    await getAPI({ endPoint: 'get-schedule' }).then((resp) => {
      setEvents(resp?.data)
      console.log("getAPI", resp);
    })
  }

  useEffect(() => {

    getSchedule()

  }, []);

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
  const eventClicked = (event) => {
    //On Click of event showing alert from here
    Alert.alert(JSON.stringify(event));

  };
  return (
    <LinearGradient colors={['#300076', '#53045F']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <HomeHeader2
          height={60}
          // paddingHorizontal={15}
          title={'Schedule'}
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
        {/* <ScrollView> */}

        <View style={{
          alignItems: 'center',
          justifyContent: 'center', flex: 1
        }}>
          <View style={{
            width: '100%', height: 50, position: 'absolute', backgroundColor: '#E4E7F0', 
            zIndex: 999,
            top: 1,
            justifyContent: 'center'
          }} >
            <DatePicker
              modal
              open={open}
              date={date}
              onConfirm={(date) => {
                setOpen(false);
                setDate(date);
              }}
              onCancel={() => {
                setOpen(false);
              }}
              mode="date"
            />
            <TouchableOpacity style={{
              height: 40,
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderRadius: 10,
              width: '90%',
              backgroundColor: 'white',
              alignSelf: 'center',
              borderRadius: 5,
              borderColor: '#959FA6',
              borderWidth: 0,
              fontWeight: '500',
              color: '#292929',
              alignItems: 'center', 
            }} onPress={() => setOpen(true)}>
              <Text  style={{fontFamily:FONTFAMILY,
                  marginHorizontal: 14,
                  color: 'black',
                }}
              >
                {selectedDate}
              </Text>
              {/* <View style={[styles.calendarImg,]}> */}
                <Image style={{ height: 18, width: 18, marginRight: 10 }} source={require("../../assets/calendar.png")}></Image>
              {/* </View> */}
            </TouchableOpacity>

          </View>

          {/* <TouchableOpacity style={{
            height: 50,
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderRadius: 10,
            width: '90%',
            backgroundColor: 'white',
            alignSelf: 'center',
            borderRadius: 5,
            borderColor: '#959FA6',
            borderWidth: 1,
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
              {selectedDate}
            </Text>
            <View style={{
              width: 38,
              height: 38,
              backgroundColor: 'transparent',
              borderRadius: 10,
              marginVertical: 5,
              marginRight: 12,
              justifyContent: 'center',
            }}>
              <Image style={{ height: 18, width: 18, marginLeft: 15 }} source={require("../../assets/calendar.png")}></Image>
            </View>
          </TouchableOpacity> */}

          <EventCalendar

            // initDate={'2024-05-03'}
            // initDate={selectedDate}
            initDate={selectedDate}
            eventTapped={eventClicked}
            // Function on event press
            events={events}
            // Passing the Array of event
            width={dimensions.SCREEN_WIDTH}
            // Container width
            size={60}
            renderEvent={(item) => {

              // const startTime = new Date(`${item.start}`);
              // const endTime = new Date(`${item.end}`);
              // const timeDifference = endTime - startTime;
              // var diff = (endTime.getTime() - startTime.getTime()) / 1000
              // diff /= (60 * 60)
              // console.log(Math.abs(Math.round(diff)))
              // console.log('timediiidd1111', Math.abs(Math.round(diff)));
              const startDate = new Date(`${item.start}`);
              const endDate = new Date(`${item.end}`);
              console.log({item});
              // Calculate the difference in milliseconds
              const diffInMilliseconds = endDate - startDate;

              // Convert the difference from milliseconds to hours
              const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
              console.log(Math.abs(Math.round(diffInHours)), 'round off data')
              const roundoff = Math.abs(Math.round(diffInHours))
              // Log the result
              console.log(diffInHours, 'diif in hourssss');

              const dateTime = `${moment(item.schedule_start_date).format('MM/DD/YYYY')}, ${moment(item.schedule_start_time, "HH:mm:ss").format("hh:mm A")}`

              // if (roundoff >= 2)
              if (true) {
                // console.log('if hsould be correct', roundoff > 2);
                return (
                  <TouchableOpacity style={{
                    width: '98%', borderRadius: 4,
                    backgroundColor: 'white',
                    shadowColor: '#000',
                    shadowRadius: 2,
                    shadowOpacity: 0.2,
                    elevation: 3,
                    zIndex: 999,
                    // paddingVertical: 10,


                  }}
                    onPress={() => {
                      props.navigation.navigate('ScheduleDetail', { scheduleID: item?.id }) 
                    }}
                  >
                    <View style={{ width: '100%', height: 20, borderBottomColor: 'grey', borderBottomWidth: 0.5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>

                      <View style={{ width: 50, alignItems: 'center', }}>
                        <Text style={{fontFamily:FONTFAMILY, fontSize: 10, color: 'black', }}>{item?.meeting_title}</Text>
                      </View>

                      {/* <View style={{ width: 50 }}>
                        <Text style={{fontFamily:FONTFAMILY, fontSize: 10, color: 'black', }}>Goals</Text>
                      </View> */}

                      {/* <TouchableOpacity style={{ width: 30, height: '100%', backgroundColor: "#B357C3", borderRadius: 7,  justifyContent: "center" }}>
                        <Text style={{fontFamily:FONTFAMILY, fontSize: 10, color: "#fff", textAlign: "center", fontWeight: "400" }}>View</Text>
                      </TouchableOpacity> */}

                    </View>
                    <View style={{ width: '100%', flexDirection: 'row', padding: 3 }}>
                      {/* <Image source={OnGoing} /> */}
                      <Text style={{fontFamily:FONTFAMILY, fontSize: 12, color: 'black', }}>{item.note}</Text>
                    </View>
                    <View style={{ width: '100%', flexDirection: 'row', padding: 3 }}>
                      <Image source={OnGoing} tintColor={Mycolors.Purple}/>
                      <Text style={{fontFamily:FONTFAMILY, fontSize: 12, color: 'black', marginLeft: 5 }}>{dateTime}</Text>
                    </View>
                    <View style={{ height: 0.5, backgroundColor: "grey" }} />
                    <TouchableOpacity  onPress={()=>{
                      Linking.openURL(item?.zoom_link)
                    }} style={{ width: '100%', flexDirection: 'row', padding: 5 }}>
                      <Image style={{ width: 18, height: 18 }} width={18} height={18} source={Zoom} />
                      <Text style={{fontFamily:FONTFAMILY, fontSize: 12, color: '#47AFF0', marginLeft: 5, }}>{"Join Zoom Meeting"}</Text>
                    </TouchableOpacity>


                  </TouchableOpacity>

                )
              }
              else {
                return (
                  <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', width: dimensions.SCREEN_WIDTH * 0.75, }} onPress={() => { navigation.navigate('SchduleDetails', { id: item?.id }) }}>
                    <Text
                      text={item.meeting_title}
                      fontFamily="Roboto"
                      fontWeight='700'
                      fontSize={14}
                      color={Color.LIGHT_BLACK}
                      style={{}}

                    >{item.meeting_title}</Text>
                    <Text>{moment(item.schedule_start_time, "HH:mm:ss").format("hh:mm A")}</Text>

                  </TouchableOpacity>
                )

              }
            }}

            scrollToFirst
          />
        </View>




        {/* </ScrollView> */}

        {My_Alert ? (
          <MyAlert
            sms={alert_sms}
            okPress={() => {
              setMy_Alert(false);
            }}
          />
        ) : null}

      </SafeAreaView>
      {loading && <SkeletonContainer />}
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
export default Schedule;
