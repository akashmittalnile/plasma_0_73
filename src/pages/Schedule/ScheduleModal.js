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
import { FONTFAMILY } from '../../utility/fonts'
import { Mycolors } from '../../utility/Mycolors'
import Modal from "react-native-modal";

export const ScheduleModal = ({ scheduleModal=false, setScheduleModal, schedules={}}) => {

    const startDateTime = `${moment(schedules?.schedule_start_date).format('MM/DD/YYYY')}, ${moment(schedules?.schedule_start_time, "HH:mm:ss").format("hh:mm A")}`
    // const endDateTime = `${moment(schedules?.schedule_end_date).format('MM/DD/YYYY')}, ${moment(schedules?.schedule_end_time, "HH:mm:ss").format("hh:mm A")}`
  
    const startDate = moment(schedules?.schedule_start_time, "HH:mm:ss").format("hh:mm A")
    const endDate = moment(schedules?.schedule_end_time, "HH:mm:ss").format("hh:mm A")
    return (
        <Modal
            isVisible={scheduleModal}
            swipeDirection="down"
            onBackdropPress={() => setScheduleModal(false)}
            onSwipeComplete={e => {
                setScheduleModal(false);
            }}
            animationIn={'fadeIn'}
            animationOut={'fadeOut'}
            scrollTo={() => { }}
            scrollOffset={1}
            propagateSwipe={true}
            coverScreen={false}
            backdropColor="transparent"
            style={{
                // justifyContent: 'flex-end',
                margin: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
            }}>
            {schedules &&
            <View style={{width: '100%', padding:10}}>
                <View style={{ width: '100%', backgroundColor: 'white', borderRadius: 10, flexDirection: 'column', marginTop: 10, }}>

                <View style={{ width: '100%', borderBottomColor: 'grey', borderBottomWidth: 0.5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 12,  }}>

                  <View style={{ flex: 1, }}>
                    <Text style={{ fontFamily: FONTFAMILY, fontSize: 15, color: 'black', fontWeight: '500' }}>{schedules?.meeting_title}</Text>
                  </View>

                </View>

                <View style={{ borderBottomColor: 'grey', borderBottomWidth: 0.5, flexDirection: 'row', justifyContent: 'space-between', alignItems: '', padding: 7, backgroundColor: 'white'}}>

                  <View style={{ backgroundColor: 'white', justifyContent: 'space-evenly', width: '100%', bottom: 6 }}>
                    <View style={{ flexDirection: 'row', width: '100%', backgroundColor: 'transparent', justifyContent: 'space-between' }}>
                      <View style={{height: 120, justifyContent: 'space-evenly'}}>
                      <View style={{ flexDirection: 'row', }}>
                          <Image style={{ height: 18, width: 18, marginRight: 10, tintColor: Mycolors.Purple }} source={require("../../assets/calendar.png")} />
                          <Text style={{ fontFamily: FONTFAMILY, fontSize: 15, color: 'black', }}>Weekly</Text>
                        </View>
                        <View style={{ flexDirection: 'row', }}>
                          <Image style={{ height: 18, width: 18, marginRight: 10, tintColor: Mycolors.Purple }} source={require("./clock.png")} />
                          <Text style={{ fontFamily: FONTFAMILY, fontSize: 15, color: 'black', }}>Start Time: {startDate}</Text>

                        </View>
                        <View style={{ flexDirection: 'row', }}>
                        <Image style={{ height: 18, width: 18, marginRight: 10, tintColor: Mycolors.Purple }} source={require("./clock.png")} />
                          <Text style={{ fontFamily: FONTFAMILY, fontSize: 15, color: 'black', }}>End Time: {endDate}</Text>
                        </View>
                      </View>
                      <Image style={{ height: 120, width: 120, marginRight: 10, tintColor: Mycolors.Purple }} source={require("./meeting.png")} />
                    </View>

                    <View style={{ flexDirection: 'row', }}>
                      <Image style={{ height: 18, width: 18, marginRight: 10, tintColor: Mycolors.Purple  }} source={require("../../assets/stickynote.png")} />
                      <Text style={{ fontFamily: FONTFAMILY, fontSize: 15, color: 'black', }}>Note: {schedules?.note}</Text>
                    </View>
                    
                  </View>


                </View>

               

                <View style={{ width: '100%', borderBottomColor: 'grey', borderBottomWidth: 0.5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 7,  }}>

                  {/* <View style={{ flex: 1, }}> */}
                  <TouchableOpacity onPress={() => {
                  Linking.openURL(schedules?.zoom_link)
                }} style={{ backgroundColor: "white", borderRadius: 7, justifyContent: "center", flexDirection: 'row', alignItems: 'center' }}>
                  <Image style={{ height: 25, width: 25, marginRight: 4,  }} source={require("./Zoom.png")} />
                  <Text style={{ fontFamily: FONTFAMILY, fontSize: 15, color: "#47AFF0", textAlign: "center", fontWeight: "400" }}>Join Zoom</Text>
                </TouchableOpacity>
                    <Text style={{ fontFamily: FONTFAMILY, fontSize: 15, color: 'black', fontWeight: '500' }}>{startDateTime}</Text>
                  {/* </View> */}

                </View>

              </View>
              </View>
            }
        </Modal>
    );
};