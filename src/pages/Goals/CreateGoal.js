import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ScrollView, SafeAreaView, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import HomeHeader2 from '../../component/HomeHeader2';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import Loader from '../../WebApi/Loader';
import useAPI from '../../utility/hooks/useAPI';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import useHideBottomTab from '../../utility/hooks/useHideBottomTab';
import Toast from 'react-native-simple-toast';
import SkeletonContainer from '../../component/Skelton/SkeltonContainer';
import { Mycolors } from '../../utility/Mycolors';
import { FONTFAMILY } from '../../utility/fonts';

const goalType = [{
    id:
        '1',
    name: 'A-Type'
},
{
    id:
        '2',
    name: 'B-Type'
},
{
    id:
        '3',
    name: 'C-Type'
}];







const Nodata = () => {
    return (
        <View>
            <Text style={{fontFamily:FONTFAMILY,fontFamily:FONTFAMILY}}>No data found!</Text>
        </View>
    );
};







const CreateGoal = (props) => {

    const goalData = props?.route?.params?.goalData
    console.log({ goalData });
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(new Date());
    const [goalTypeIndex, setgoalTypeIndex] = useState(0)


    const selectedDate = moment(date).format('YYYY-MM-DD')
    const selectedDateShowOnly = moment(date).format('MM-DD-YYYY')
    // const activeItem = goalType[goalTypeIndex].name
    const activeItem = goalType[goalTypeIndex]?.name


    const [multiLineText, setMultiLineText] = useState('');
    const [task, setTask] = useState('');
    const [goalWeek, setGoalWeek] = useState('');
    const [goalSix, setGoalSix] = useState('');
    const [goal, setGoal] = useState('');
    const [goalOneYear, setGoalOneYear] = useState('');
    const [accountabilityPartner, setAccountabilityPartner] = useState('');

    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    // const [activeItem, setActiveItem] = useState(''); // Assuming initial state
    // const [goalTypeIndex, setgoalTypeIndex] = useState(0); // Assuming initial state
    const [My_Alert, setMy_Alert] = useState(false);
    const [alert_sms, setAlertSms] = useState(''); // Assuming initial state
    // useHideBottomTab()

    const { error, getAPI, postAPI, loading, putAPI } = useAPI()


    useEffect(() => {

        if (goalData) {

            const { achieve_date,
                goal_statement,
                user_id,
                goal_type,
                goal_for_me,
                one_week_milestones,
                one_month_milestones,
                six_month_milestones,
                one_year_goal,
                accountability_partner,

            } = goalData

            //Set Date
            const [month, day, year] = achieve_date.split('-').map(Number);
            setDate(new Date(year, month - 1, day))

            setMultiLineText(goal_statement)
            setTask(goal_for_me)

            // activeItem(goal_type) setgoalTypeIndex
            setgoalTypeIndex(goalType.findIndex((goalVal) => goalVal.name == goal_type))

            setGoalSix(six_month_milestones)
            setGoal(one_month_milestones)
            setGoalOneYear(one_year_goal)
            setAccountabilityPartner(accountability_partner)
            setGoalWeek(one_week_milestones)

        }

        return () => {

        }
    }, [])



    const Validation = () => {
        { console.log('m goal----????', goalTypeIndex !== 0 && (goalOneYear == '' || goal == '')); }
        { console.log('my selected dte>>>>>---->.', activeItem) }
        if (String(multiLineText).trim().length === 0) {
            Toast.show('Please enter C-Type goal statement');
            return false;

        } else if (selectedDate === null) {
            Toast.show('Please enter the date when you will achieve this goal');
            return false;
        }
        else if (task === '') {
            Toast.show('Please enter the details you will be needing to reach this goal');
            return false;
        } else if (activeItem === '') {
            Toast.show('Please enter the steps to achieve the goal');
            return false;
        }
        // else if (goalTypeIndex !== 0 && goal == '') {
        else if (goalTypeIndex !== 0 && goalSix == '') {
            console.log({goal});
            

            const msg = goalTypeIndex === 1 ? 'Please enter what wil you accomplish in one week' : 'Please enter what wil you accomplish in six month'

            Toast.show(msg);
            return false;

        }


        // else if (goalTypeIndex !== 0 && (goalOneYear === '' || goal === '')) {
        //     Toast.show({ type: 'error', text1: goalTypeIndex === 1 ? 'Please enter what wil you accomplish in one month' : 'Please enter what wil you accomplish in one year' });
        //     return false;
        // }
        // else if (goalOneYear == '') {
        //     Toast.show({ text1: 'Please enter what wil you accomplish in one year' });
        //     return false;
        // }
        else if (accountabilityPartner == '') {
            Toast.show({ type: 'error', text1: 'Please enter your accountability partner' });
            return false;
        }
        return true;
    };

    async function submitGoal() {

        if (!Validation()) {
            return
        }

        const data = {

            goal_statement: multiLineText,
            achieve_date: selectedDate,
            goal_for_me: task,
            goal_type: activeItem,
            six_month_milestones: goalSix,
            one_month_milestones: goal,
            one_year_goal: goalOneYear,
            accountability_partner: accountabilityPartner,
            one_week_milestones: goalWeek

        }

        const endPoint = goalData ? 'update-goal/' + goalData?.id : 'goal'
        console.log({ endPoint });

        let resp = null

        if (goalData) {
            console.log("goalData");
            resp = await putAPI({ endPoint: endPoint, bodyJSON: data, isSendJSON: goalData ? true : false })
        } else {
            resp = await postAPI({ endPoint: endPoint, bodyJSON: data })
        }

        if (!resp) {
            return
        }
        // Toast.show(resp?.message)


        props?.navigation?.replace("GetGoals")




    }



    const RenderSchdule = ({ item, index }) => {
        const backgroundColor = index === goalTypeIndex ? Mycolors.Purple : 'white';
        const text = index === goalTypeIndex ? 'white' : Mycolors.Purple;

        return (
            <TouchableOpacity style={[styles.groupView, { backgroundColor }]}
                onPress={() => setgoalTypeIndex(index)
                    // handleItemPress(item.title, index)} // Call handleItemPress on press
                }
            >
                <Text
                    style={{ fontWeight: '600', fontSize: 15, color: text, fontFamily: FONTFAMILY }}>{item.name + " Goal"}</Text>
            </TouchableOpacity >
        )
    };

    return (
        <>
            <LinearGradient colors={['#300076', '#53045F']} style={{ flex: 1 }}>
                <SafeAreaView style={{ flex: 1, }}>
                    <HomeHeader2
                        height={60}
                        // paddingHorizontal={15}
                        title={'Create Goal'}
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

                    <View style={{ backgroundColor: 'transparent', width: '100%', height: "100%", }}>



                        <ScrollView style={{ backgroundColor: 'transparent', width: '100%', height: "100%", }}>
                            <View
                                style={{
                                    backgroundColor: 'transparent',
                                    width: '92%',
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                }}
                            >
                                <View style={{ marginTop: 26 }}>
                                    <Text style={{fontFamily:FONTFAMILY, fontWeight: '700', fontSize: 14, color: 'white', marginTop: 10 }}>
                                        What steps will I take to get there now?
                                    </Text>
                                    <FlatList
                                        horizontal={true}
                                        data={goalType}
                                        showsVerticalScrollIndicator={false}
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={RenderSchdule}
                                        ListEmptyCreateGoal={() => (
                                            <View
                                                style={{
                                                    alignSelf: 'center',
                                                    justifyContent: 'center',
                                                    width: '95%',
                                                    flex: 1,
                                                    alignItems: 'center',
                                                    height: '60%',
                                                }}
                                            >
                                                <Nodata style={{ alignSelf: 'center' }} height={119} width={119} />
                                                <Text
                                                    style={{
                                                        alignSelf: 'center',
                                                        top: 4,
                                                        fontWeight: '500',
                                                        fontSize: 24,
                                                        color: 'gray', fontFamily:FONTFAMILY
                                                    }}
                                                >
                                                    No data found !
                                                </Text>
                                                <Text
                                                    style={{
                                                        alignSelf: 'center',
                                                        textAlign: 'center',
                                                        width: '60%',
                                                        top: 4,
                                                        fontWeight: '400',
                                                        fontSize: 16,
                                                        color: 'gray', fontFamily:FONTFAMILY
                                                    }}
                                                >
                                                    Oops! this information is not available for a moment
                                                </Text>
                                            </View>
                                        )}
                                        style={{ marginTop: 10 }}
                                    />
                                </View>

                                <View style={{ marginTop: 22 }}>
                                    <Text
                                        style={{
                                            fontWeight: 'bold',
                                            fontSize: 16,
                                            color: 'white', fontFamily:FONTFAMILY
                                        }}
                                    >
                                        My {activeItem} Goal Statement
                                    </Text>
                                    <TextInput
                                        style={styles.input}
                                        multiline={true}
                                        numberOfLines={4}
                                        placeholder="Type here..."
                                        value={multiLineText}
                                        onChangeText={text => setMultiLineText(text)}
                                        textAlignVertical="top"
                                    />
                                </View>



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
                                    minimumDate={date}
                                />
                                <View style={{ marginTop: 26 }}>
                                    <Text
                                        style={{
                                            fontWeight: '700',
                                            fontSize: 14,
                                            color: 'white', fontFamily:FONTFAMILY
                                        }}
                                    >
                                        When will I Achieve This?
                                    </Text>
                                    <TouchableOpacity style={styles.calendarView} onPress={() => setOpen(true)}>
                                        <Text
                                            style={{
                                                marginHorizontal: 14,
                                                color: 'black', fontFamily:FONTFAMILY
                                            }}
                                        >
                                            {selectedDateShowOnly}
                                        </Text>
                                        <View style={[styles.calendarImg,]}>
                                            <Image style={{ height: 18, width: 18, marginLeft: 15 }} source={require("../../assets/calendar.png")}></Image>
                                        </View>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ marginTop: 26 }}>
                                    <Text
                                        style={{
                                            fontWeight: 'bold',
                                            fontSize: 16,
                                            color: 'white', fontFamily:FONTFAMILY
                                        }}
                                    >
                                        What will it Take For Me To Get This Done?
                                    </Text>
                                    <TextInput
                                        style={styles.input}
                                        multiline={true}
                                        numberOfLines={4}
                                        placeholder="Type here..."
                                        value={task}
                                        onChangeText={text => setTask(text)}
                                        textAlignVertical="top"
                                    />
                                </View>

                                {console.log('my active index--->>', goalTypeIndex)}
                                {goalTypeIndex !== 0 && (
                                    <View style={{ marginTop: 26 }}>
                                        <Text style={{fontFamily:FONTFAMILY, fontWeight: '700', fontSize: 14, color: 'white', marginBottom: 15 }}>
                                            {goalTypeIndex === 1 ? 'In One Week , I Will Accomplish' : 'In Six Month , I Will Accomplish'}
                                        </Text>
                                        <TextInput
                                            style={styles.input}
                                            multiline={true}
                                            numberOfLines={4}
                                            placeholder="Type here..."
                                            value={goalTypeIndex === 1 ? goalWeek : goalSix}
                                            onChangeText={text => (goalTypeIndex === 1 ? setGoalWeek(text) : setGoalSix(text))}
                                            textAlignVertical="top"
                                        />
                                    </View>
                                )}
                                {goalTypeIndex !== 0 && (
                                    <View style={{ marginTop: 26 }}>
                                        <Text style={{fontFamily:FONTFAMILY, fontWeight: '700', fontSize: 14, color: 'white', marginBottom: 15 }}>
                                            {goalTypeIndex === 1 ? 'In One Month , I Will Accomplish' : 'In One Year , I Will Accomplish'}
                                        </Text>
                                        <TextInput
                                            style={styles.input}
                                            multiline={true}
                                            numberOfLines={4}
                                            placeholder="Type here..."
                                            value={goalTypeIndex === 1 ? goal : goalOneYear}
                                            onChangeText={text => (goalTypeIndex === 1 ? setGoal(text) : setGoalOneYear(text))}
                                            textAlignVertical="top"
                                        />
                                    </View>
                                )}

                                <View style={{ marginTop: 26 }}>
                                    <Text
                                        style={{
                                            fontWeight: '700',
                                            fontSize: 14,
                                            color: 'white', fontFamily:FONTFAMILY
                                        }}
                                    >
                                        My Accountability Partner Is:
                                    </Text>
                                    <TextInput
                                        style={styles.input}
                                        multiline={true}
                                        numberOfLines={4}
                                        placeholder="Type here..."
                                        value={accountabilityPartner}
                                        onChangeText={(text) => setAccountabilityPartner(text)}
                                        textAlignVertical="top"
                                    />
                                </View>


                            </View>

                            <View style={{ marginTop: 26 }} />
                            <TouchableOpacity
                                style={{
                                    width: '85%',
                                    height: 50,
                                    backgroundColor: Mycolors.Purple,
                                    alignSelf: 'center',
                                    borderRadius: 5,
                                    justifyContent: 'center',
                                }}
                                onPress={() => submitGoal()}
                            >
                                <Text
                                    style={{
                                        alignSelf: 'center',
                                        fontWeight: '700',
                                        fontSize: 14,
                                        color: 'white', fontFamily:FONTFAMILY
                                    }}
                                >
                                    {goalData ? "Update Your Goal" : "Set Your Goal"}
                                </Text>
                            </TouchableOpacity>

                            <View style={{ height: 100, width: '100%' }} />

                        </ScrollView>
                    </View>

                </SafeAreaView>
            </LinearGradient>

            {loading && <Loader />}

            {loading && <Loader />}
        </>
    );
};

const styles = {
    groupView: {
        width: 'auto',
        padding: 10,
        paddingHorizontal: 15,
        borderRadius: 6,
        backgroundColor: '#ACCE39',
        borderWidth: 0,
        borderColor: '#959FA6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 18
    },
    input: {
        height: 100,
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderRadius: 10,
        width: '100%',
        marginHorizontal: 12,
        marginLeft: 12,
        alignSelf: 'center',
        borderRadius: 5,
        borderColor: '#959FA6',
        borderWidth: 1,
        backgroundColor: 'white',
        padding: 12,
        fontWeight: '500',
        color: '#292929', marginTop: 10, fontFamily:FONTFAMILY
    },
    calendarView: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 10,
        width: '100%',
        backgroundColor: 'white',
        alignSelf: 'center',
        borderRadius: 5,
        borderColor: '#959FA6',
        borderWidth: 1,
        fontWeight: '500',
        color: '#292929',
        alignItems: 'center', marginTop: 10
    },
    calendarImg: {
        width: 38,
        height: 38,
        backgroundColor: 'transparent',
        borderRadius: 10,
        marginVertical: 5,
        marginRight: 12,
        justifyContent: 'center',
    },
};

export default CreateGoal;