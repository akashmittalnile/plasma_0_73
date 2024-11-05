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
import { FONTFAMILY, FONTFAMILYBOLD, FONTFAMILYSEMIBOLD } from '../../utility/fonts';

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

const GetGoals = (props) => {
    // const [loading, setLoading] = useState(false)
    const [flag, setFlag] = useState('http://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg')
    const [code, setcode] = useState('+1')
    const [My_Alert, setMy_Alert] = useState(false)
    const [alert_sms, setalert_sms] = useState('')
    const [select1, setselect1] = useState(false)
    const [data, setdata] = useState([])

    const [openFilterModal, setOpenFilterModal] = useState(false)

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

    const { getAPI, loading, deleteAPI } = useAPI()

    const filterObj = {
        type,
        filter: filter.length == 0 ? null : filter,
        date: isDateChanged ? selectedDate : null,
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

        return `get-goal?${queryString}`;
    }




    // const result = convertToQueryString(filterObj);
    // console.log(result); // "get-goal?type=2&filter=Foundation&highlow=2&category_id=3&ratings=3&date=2000-04-13"


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
            setdata(res?.data)
            // setdata(res?.data)
            // setdata2(res?.data?.product)
        } else {
            setdata([])
        }

    }

    async function deleteGoal(id) {
        const endPointURL = 'delete-goal/' + id
        const res = await deleteAPI({ endPoint: endPointURL })
        await getSearch()
    }


    useEffect(() => {

        getSearch("")

    }, [reloadSearch])

    useEffect(() => {
        // getCoursesCatID()

        return () => {

        }
    }, [])


    const RenderItemLead = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    setGoalModal(true)
                    setgoalModalData(item)
                }}
                style={[{
                    width: dimensions.SCREEN_WIDTH * 0.90,
                    // height: 'auto',
                    borderRadius: 10,
                    marginVertical: 12,
                    // padding: 10,
                    alignSelf: 'center',
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 1,
                    },
                    shadowOpacity: 0.18,
                    shadowRadius: 1.00,

                    elevation: 1,


                }, { backgroundColor: 'white' }]}>
                <View style={{
                    flexDirection: 'row', backgroundColor: 'white', borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    paddingVertical: 5,
                    paddingHorizontal: 5,

                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 1,
                    },
                    shadowOpacity: 0.22,
                    shadowRadius: 2.22,

                    elevation: 3,
                }}>
                    <View style={{
                        height: 50,
                        width: 50,
                        borderRadius: 50,
                        // backgroundColor: Mycolors.DARK_BLUE,
                        justifyContent: 'center',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        {/* <Mycourse width={27} height={27} style={{ alignSelf: 'center' }}></Mycourse> */}
                        <Image source={{ uri: item?.user_profile }} style={{ height: 40, width: 40, borderRadius: 50 }}></Image>

                        {/* require('../../assets/menu-board.png') */}
                    </View>
                    {/* <MyText
                        text={item.goal_statement}
                        fontWeight="bold"
                        fontSize={14}
                        textColor={Color.LIGHT_BLACK}
                        fontFamily="Roboto"
                        marginHorizontal={12}
                        style={{

                            alignSelf: 'center',

                        }}
                    /> */}
                    <Text style={{fontFamily:FONTFAMILY,
                        alignSelf: 'center', fontWeight: "bold",
                        fontSize: 14,
                        textColor: 'black',
                        fontFamily: FONTFAMILYBOLD,
                        marginHorizontal: 12,

                    }}>{item.goal_statement}</Text>
                </View>

                <View style={{ padding: 0, paddingVertical: 15, }}>
                    <View style={{
                        flexDirection: 'row',
                        //  marginHorizontal: 10, 
                        //  marginTop: 14,
                        justifyContent: 'space-between'
                    }}>


                        <Text style={{fontFamily:FONTFAMILYSEMIBOLD,
                            alignSelf: 'center',
                            fontSize: 14,
                            textColor: 'black',
                            fontFamily: FONTFAMILYSEMIBOLD,
                            marginHorizontal: 12,

                        }}>{`Goal Type`}</Text>


                        <Text style={{fontFamily:FONTFAMILYSEMIBOLD,
                            alignSelf: 'center',
                            fontSize: 14,
                            textColor: 'black',
                            fontFamily: FONTFAMILYSEMIBOLD,
                            marginHorizontal: 12,

                        }}>{"Date"}</Text>
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        //  marginHorizontal: 10, 
                        //  marginVertical: 14,
                        justifyContent: 'space-between', marginTop: 7,
                    }}>


                        <Text style={{fontFamily:FONTFAMILYSEMIBOLD,
                            alignSelf: 'center',
                            fontSize: 14,
                            color: 'black',
                            // fontFamily: FONTFAMILY,
                            marginHorizontal: 12,

                        }}>{`${item.goal_type}`}</Text>


                        <Text style={{fontFamily:FONTFAMILYSEMIBOLD,
                            alignSelf: 'center',
                            fontSize: 14,
                            color: 'black',
                            fontFamily: FONTFAMILYSEMIBOLD,
                            marginHorizontal: 12,

                        }}>{item?.achieve_date}</Text>
                    </View>


                    <View style={{ flexDirection: 'row', marginTop: 18, backgroundColor: 'white', justifyContent: 'space-between', height: 35 }}>
                        <TouchableOpacity style={[{
                            width: '45%',
                            height: '100%',
                            borderRadius: 5, backgroundColor: '#F1190A',
                            marginHorizontal: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
                        },]} onPress={() => { deleteGoal(item?.id) }}>
                            {/* <Delte></Delte> */}
                            {/* Remove */}
                            {/* <MyText
                            text={'Delete'}
                            fontWeight="500"
                            fontSize={14}
                            textColor={Color.WHITE}
                            fontFamily="Roboto"
                            marginHorizontal={12}
                            style={{

                                alignSelf: 'center',

                            }}
                        /> */}
                            <Image source={require('../../assets/trash.png')} style={{ width: 15, height: 15, tintColor: 'white' }} />
                            <Text style={{fontFamily:FONTFAMILYSEMIBOLD,
                                alignSelf: 'center', fontWeight: "bold",
                                fontSize: 14,
                                color: 'white',
                                fontFamily: FONTFAMILYSEMIBOLD,
                                marginHorizontal: 12,
                                fontWeight: "500"

                            }}>{'Delete'}</Text>

                        </TouchableOpacity>

                        <TouchableOpacity style={[{
                            width: '45%',
                            height: '100%',
                            borderRadius: 5, backgroundColor: '#F1190A',
                            marginHorizontal: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
                        }, { backgroundColor: Mycolors.Purple, marginLeft: -5 }]} onPress={() => {
                            // return
                            props.navigation.navigate('CreateGoal', { goalData: item })
                        }}>

                            {/* <Resume></Resume> */}
                            {/* <MyText
                            text={'Edit'}
                            fontWeight="500"
                            fontSize={14}
                            textColor={Color.WHITE}
                            fontFamily="Roboto"
                            marginHorizontal={12}
                            style={{

                                alignSelf: 'center',

                            }}
                        /> */}
                            <Image source={require('../../assets/edit.png')} style={{ width: 15, height: 15, tintColor: 'white' }} />
                            <Text style={{fontFamily:FONTFAMILYSEMIBOLD,
                                alignSelf: 'center', fontWeight: "bold",
                                fontSize: 14,
                                color: 'white',
                                fontFamily: FONTFAMILYSEMIBOLD,
                                marginHorizontal: 12,
                                fontWeight: "500"

                            }}>{'Edit'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </TouchableOpacity >
        )
    }


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
                        style={{fontFamily:FONTFAMILY,
                            // marginHorizontal: 14,
                            color: 'black',
                            marginVertical: 5,
                            fontWeight: '600',
                            fontSize: 18
                        }}
                    >
                        {"Goal Filter"}
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
                        style={{fontFamily:FONTFAMILYSEMIBOLD,
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
                                fontFamily: FONTFAMILY
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
                        style={{fontFamily:FONTFAMILYSEMIBOLD,
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
                                fontFamily: FONTFAMILY

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
            <HomeHeader2
                height={60}
                // paddingHorizontal={15}
                title={'Goals'}
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
            <ScrollView>
                <MySearchBar searchVal={filter} setSearchVal={setFilter} isfilter onFilterPress={() => {
                    setOpenFilterModal(true)
                }} onSearchSubmit={(text) => {
                    getSearch(text)
                }} placeHolder={'Goals'} />


                <View style={{ width: '95%', marginBottom: 10, backgroundColor: 'transparent', marginLeft: 2 }}>
                    {filterTagArray?.map((item, index) => {

                        return <View style={{ flexDirection: 'row', paddingHorizontal: 10, padding:5 }}>
                            <View style={{ backgroundColor: '#B357C3', padding: 10, borderRadius: 7, flexDirection: 'row', justifyContent: 'center' }}>
                                <Text style={{fontFamily:FONTFAMILY, color: 'white', fontWeight: '600' }}>{item?.title}: </Text>
                                <Text style={{fontFamily:FONTFAMILY, color: 'white', }}> {item?.value}</Text>
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



                <View style={{ marginTop: filterTagArray.length ? 0 :-12, }}>
                    <FlatList
                        scrollEnabled={false}
                        data={data}
                        showsHorizontalScrollIndicator={false}
                        // keyExtractor={(_,index) => index}
                        renderItem={RenderItemLead}
                        ListEmptyComponent={<NoDataFound styles={{ marginTop: "27%" }} />}

                    />
                </View>

                {loading ?
                    <Loader />
                    : null
                }
                <View style={{ width: 50, height: 150 }} />
            </ScrollView>

        </LinearGradient>
        <GoalModal goalModal={goalModal} setGoalModal={setGoalModal} goalModalData={goalModalData} />
    </>
    );
}
const styles = StyleSheet.create({

    containerView: {
        width: dimensions.SCREEN_WIDTH * 0.88,
        height: 'auto',
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: 0,
        borderStyle: 'solid',
        borderLeftColor: '#959FA6',
        borderLeftWidth: 3,
        borderRightColor: '#959FA6',
        borderTopColor: '#959FA6',
        borderBottomColor: '#959FA6',
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        paddingVertical: 10,
        margin: 5,
        paddingHorizontal: 12,

        borderColor: 'rgba(0, 0, 0, 0.15)',
        // iOS shadow properties
        shadowColor: 'rgba(0, 0, 0, 0.15)',
        shadowOffset: { width: 0, height: 10 }, // Increased height for a more pronounced bottom shadow
        shadowOpacity: 1,
        shadowRadius: 11,
        // Android shadow property
        elevation: 12,
    },

    noDataText: {
        // color: Color.THEME_BLACK,
        fontSize: 20,
        fontWeight: '500',
        // textAlign: 'center',
    },
    containerBottomView: {
        width: dimensions.SCREEN_WIDTH * 0.88,
        height: 'auto',
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: 5,
        // borderStyle: 'solid',
        // borderLeftColor: '#959FA6',
        // borderLeftWidth: 3,
        // borderRightColor: '#959FA6',
        // borderTopColor: '#959FA6',
        // borderBottomColor: '#959FA6',
        // borderTopLeftRadius: 5,
        // borderBottomLeftRadius: 5,
        paddingVertical: 12,
        margin: 5,
        paddingHorizontal: 5,

        // borderColor: Mycolors?.Purple,
        borderColor: "#d4a1dd",
        borderWidth:0.2,
        // iOS shadow properties
        // shadowColor: 'rgba(0, 0, 0, 0.15)',
        // shadowColor: 'rgba(0, 0, 0, 0.15)',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4.65,
        
        elevation: 6,
    }
});
export default GetGoals


export const GoalModal = ({ goalModal, setGoalModal, user, goalModalData,  }) => {

    function GoalTextComponent({ title = '', content = '', image=null}) {

        if (!content) {
            return <></>
        }

        return (<>
            <Text
                style={[
                    styles.noDataText,
                    {
                        fontWeight: '400',
                        fontSize: 14,
                        color: "black",
                        fontFamily: 'Roboto',
                        
                    },
                ]}>
                {title}
            </Text>
            <View
                style={[
                    styles.containerBottomView,
                    {
                        // shadowColor: '#000000',
                        // shadowOffset: {
                        //     width: 3,
                        //     height: 3,
                        // },
                        // shadowRadius: 10,
                        // shadowOpacity: 1,
                        margin: 5,
                        elevation: 5,
                        marginTop: 10,
                        marginBottom: 25,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    },
                ]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View
                        style={{
                            paddingHorizontal: 14,
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                        }}>

                        <Text
                            style={[
                                styles.noDataText,
                                {
                                    fontWeight: '400',
                                    fontSize: 13,
                                    color: '#515a61',
                                    fontFamily: 'Roboto',
                                    lineHeight: 24,
                                },
                            ]}>
                            {content}
                        </Text>
                    </View>
                </View>
               {image && <Image style={{ height: 20, width: 20, tintColor: Mycolors?.Purple,marginRight: 8 }} source={image} />} 
            </View></>)
    }


    return (
        <Modal
            isVisible={goalModal}
            swipeDirection="down"
            onBackdropPress={() => setGoalModal(false)}
            onSwipeComplete={e => {
                setGoalModal(false);
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
            {goalModalData &&
                <View
                    style={{
                        // height: '80%',
                        backgroundColor: 'white',
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                        padding: 20,
                        width: '99%',
                        borderBottomLeftRadius: 30,
                        borderBottomRightRadius: 30,
                        alignSelf: 'center',
                        marginTop: '25%',
                        paddingBottom: 25,
                    }}>
                    <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
                        <View style={{ height: 'auto', paddingVertical: 10,  }}>
                            <>

                                <Image
                                    source={{ uri: goalModalData?.user_profile }}
                                    style={{
                                        height: 50,
                                        width: 50,
                                        borderRadius: 50,
                                        alignSelf: 'center',
                                    }}
                                />

                                <Text
                                    style={[
                                        //   styles.noDataText,
                                        {
                                            alignSelf: 'center',
                                            marginTop: 6,
                                            fontWeight: 'bold',
                                            fontSize: 16,
                                            color: Mycolors.DARK_BLUE,
                                            fontFamily: 'Roboto',
                                            marginBottom:15
                                        },
                                    ]}>
                                    {/* {`Goal Detail`} */}
                                    {goalModalData?.user_name}
                                </Text>



                             
                              
                                <GoalTextComponent title='Date' content={goalModalData?.achieve_date} image={require("../../assets/calendar.png")}/>
                                <GoalTextComponent title='Type' content={goalModalData?.goal_type} image={require("../../assets/ic-a_type.png")}/>


                                <View style={{ height: 20 }} />
                                <GoalTextComponent title='My Statement' content={goalModalData?.goal_statement} />

                                <GoalTextComponent title='What will it take for me to get this done?' content={goalModalData?.goal_for_me} />

                                <GoalTextComponent title='In One Week, I will Accomplish' content={goalModalData?.one_week_milestones} />

                                <GoalTextComponent title='In One Month, I will Accomplish' content={goalModalData?.one_month_milestones} />

                                <GoalTextComponent title='In Six month, I will Accomplish' content={goalModalData?.six_month_milestones} />

                                <GoalTextComponent title='In One Year, I will Accomplish' content={goalModalData?.one_year_goal} />

                                <GoalTextComponent title='My Accountability Partner is' content={goalModalData?.accountability_partner} />


                            </>
                        </View>
                    </ScrollView>
                </View>
            }
        </Modal>
    );
};


