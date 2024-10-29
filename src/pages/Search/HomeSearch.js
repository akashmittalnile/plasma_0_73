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
import { FONTFAMILYSEMIBOLD } from '../../utility/fonts';
import { sliceTitle, TYPE } from '../../utility/MyFunctions';
import LessonComp from '../../component/LessonComp';
import AddToCartHandleComponent from '../../component/AddToCartHandleComponent';
import { addToWishlist } from '../../WebApi/GlobalAPICalls';
import { useSelector } from 'react-redux';
import { handleShare } from '../../component/ShareComponent';

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

const HomeSearch = (props) => {
    const userdetaile = useSelector(state => state.user.user_details);
    const comingFrom = props?.route?.params?.comingFrom
    // const [loading, setLoading] = useState(false)
    const [flag, setFlag] = useState('http://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg')
    const [code, setcode] = useState('+1')
    const [My_Alert, setMy_Alert] = useState(false)
    const [alert_sms, setalert_sms] = useState('')
    const [select1, setselect1] = useState(comingFrom ? !(TYPE.isCourse(comingFrom)) : false)
    const [data, setdata] = useState([])
    const [data2, setdata2] = useState([])
    const [openFilterModal, setOpenFilterModal] = useState(false)

    const [filter, setFilter] = useState('');
    // const [type, settype] = useState(1)
    const [highlow, sethighlow] = useState(null)
    const [ratings, setratings] = useState(null)
    const [coursesCatIDs, setCoursesCatIDs] = useState([])

    const finalCoursesCatIDs = select1 ? coursesCatIDs.filter((item) => item?.type_name == 'Product') : coursesCatIDs.filter((item) => item?.type_name == 'Course')

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

    const { getAPI, loading, controlLoader } = useAPI()

    const filterObj = {
        type,
        filter: filter.length == 0 ? null : filter,
        highlow,
        // category_id,
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
        type == 1 ? tagDataObj('Type', "Course", () => setselect1(true)) : tagDataObj('Type', "Product", () => setselect1(false))
        // type == 1 && (selectedCategory && tagDataObj('Category', selectedCategory?.title, setSelectedCategory))
        selectedCategory && tagDataObj('Category', selectedCategory?.title, setSelectedCategory)
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

        if (comingFrom?.baseUrl) {
            return `${comingFrom?.baseUrl}${queryString}`;
        }

        return `multi-filter?${queryString}`;
    }




    // const result = convertToQueryString(filterObj);
    // console.log(result); // "multi-filter?type=2&filter=Foundation&highlow=2&category_id=3&ratings=3&date=2000-04-13"


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
            // console.log("repsonse", { res: JSON.stringify(res) });
            if (comingFrom?.baseUrl) {
                setdata(res?.data)
                setselect1(false)
                return
            }

            select1 ? setdata2(res?.data) : setdata(res?.data)
            // setdata(res?.data)
            // setdata2(res?.data?.product)
        }
        else {
            console.log("responseFalse");

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


function getTitle() {
    
    if (comingFrom?.baseUrl) {
        return 'My Courses'
    }
    
    return comingFrom ? TYPE.isCourse(comingFrom) ? 'Courses' : 'Products' : 'Search'
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
                        {"Search Filter"}
                    </Text>


                </View>


                <View style={{ alignSelf: 'flex-start', width: '90%', backgroundColor: 'white', alignItems: 'flex-start', marginLeft: 20, marginBottom: 20, }}>
                    <Text
                        style={{
                            fontFamily: FONTFAMILYSEMIBOLD,
                            // marginHorizontal: 14,
                            color: 'black',
                            marginVertical: 5,
                            fontWeight: '500'
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
                            style={{
                                marginHorizontal: 14,
                                color: 'black',
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
                            style={{
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
                            fontFamily: FONTFAMILYSEMIBOLD,
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
                            fontFamily: FONTFAMILYSEMIBOLD,
                            // marginHorizontal: 14,
                            color: 'black',
                            marginVertical: 5,
                            fontWeight: '500'
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
                            style={{
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
                            style={{
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
                            style={{
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
                            style={{
                                marginHorizontal: 14,
                                color: 'black',
                            }}
                        >
                            {"1 and More"}
                        </Text>
                    </TouchableOpacity>





                </View>


                {
                // !(comingFrom)
                false
                 && <View style={{ alignSelf: 'flex-start', width: '90%', backgroundColor: 'white', alignItems: 'flex-start', marginLeft: 20, marginBottom: 20, }}>
                    <Text
                        style={{
                            fontFamily: FONTFAMILYSEMIBOLD,
                            // marginHorizontal: 14,
                            color: 'black',
                            marginVertical: 5,
                            fontWeight: '500'
                        }}
                    >
                        {"Select Type"}
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







                </View>}

                {
                // !select1 
                true
                && <View style={{ marginBottom: 15, }}>
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
                    arr={finalCoursesCatIDs}
                    // arr={coursesCatIDs}
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
                title={getTitle()}
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
                    // console.log({data,data2});

                }} onSearchSubmit={(text) => {
                    getSearch(text)
                }} placeHolder={'Courses and Products'} />


                <View style={{ width: '95%', marginBottom: 10, backgroundColor: 'transparent', marginLeft: 2, marginTop: -10 }}>
                    {filterTagArray?.map((item, index) => {

                        if (item?.title == 'Type') {
                            return <React.Fragment key={index}></React.Fragment>
                        }

                        return <View key={index} style={{ flexDirection: 'row', padding: 5, }}>
                            <View style={{ backgroundColor: '#B357C3', padding: 10, borderRadius: 7, flexDirection: 'row', justifyContent: 'center' }}>
                                <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, color: 'white', fontWeight: '600' }}>{item?.title}: </Text>
                                <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, color: 'white', }}> {item?.value}</Text>
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
                {!(comingFrom) && <View style={{ width: '95%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', }}>

                    <TouchableOpacity style={{ width: '48%', paddingVertical: 12, borderRadius: 4, justifyContent: 'center', backgroundColor: select1 ? '#fff' : '#B357C3' }}
                        onPress={() => {
                            setSelectedCategory((state)=>null)
                            setselect1(false)
                            console.log("convertToQueryString", convertToQueryString(), filterTagArray)
                        }}>
                        <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, color: select1 ? '#000' : '#fff', textAlign: 'center' }}>Course</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ width: '48%', paddingVertical: 12, borderRadius: 4, justifyContent: 'center', backgroundColor: select1 ? '#B357C3' : '#fff' }}
                        onPress={() => { 
                            setSelectedCategory((state)=>null)
                            setselect1(true)
                             }}>
                        <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, color: select1 ? '#fff' : '#000', textAlign: 'center' }}>Product</Text>
                    </TouchableOpacity>
                </View>}



                {/* ****************************Tranding courde flatlist****************** */}
                {/* {!false ? */}
                {comingFrom ?

                    comingFrom?.baseUrl ?
                        <View style={{ marginTop: 10, }}>
                            <FlatList
                                data={data}
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item }) => {
                                    return (
                                        <TouchableOpacity style={{ width: dimensions.SCREEN_WIDTH * 95 / 100, alignSelf: 'center', marginTop: 15 }}
                                            onPress={() => { props.navigation.navigate('CourseDetails', { data: item }) }}>
                                            <ImageBackground style={{ height: 170, width: '100%', borderTopLeftRadius: 7, borderTopRightRadius: 7, overflow: 'hidden' }} source={{ uri: item.image }}>
                                                {/* <View style={{ flexDirection: "row", alignSelf: "flex-end", marginTop: 5 }}>
                                            <TouchableOpacity onPress={async () => {
                                                // return
                                                await addToWishlist(item?.id, 1, userdetaile.access_token)
                                                getCourcesdata()
                                            }} style={{ marginRight: 10 }}>
                                                <Image style={{ height: 25, width: 25, tintColor: "#B357C3", }} source={item?.wishlist ? require("../../assets/heartFilled.png") : require("../../assets/heart.png")}></Image>

                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => {
                                                handleShare(item.title)
                                            }} style={{ marginRight: 10 }}>
                                                <Image style={{ height: 25, width: 25, }} source={require("../../assets/ShareNetwork.png")}></Image>
                                            </TouchableOpacity>
                                        </View> */}
                                                {/* <TouchableOpacity style={{width:'100%',height:35,backgroundColor:'rgba(100,80,200,0.5)',position:'absolute',bottom:0,justifyContent:'center',zIndex:999}}>
                <Text style={{fontFamily:FONTFAMILYSEMIBOLD,textAlign:'center',color:'#fff'}}>Free Course</Text>
                  </TouchableOpacity> */}

                                            </ImageBackground>

                                            <View style={{ width: '100%', backgroundColor: '#fff', borderBottomLeftRadius: 5, borderBottomRightRadius: 5, padding: 10 }}>
                                                <View style={{ flexDirection: "row", width: '100%', backgroundColor: 'white', justifyContent: 'space-between' }}>
                                                    <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 13, color: "#000", padding: 5 }}>{item.title}</Text>
                                                    <View style={{ flexDirection: "row", padding: 4, }}>
                                                        <Image style={{ height: 12, width: 12, marginTop: 3 }} source={require("../../assets/star.png")}></Image>
                                                        <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 13, color: "#000", }}> {item?.rating}</Text>
                                                    </View>
                                                </View>


                                                <View style={{ flexDirection: "row" }}>

                                                    {/* <Text style={[{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 14, color: "#B357C3", padding: 4, marginLeft: 2, }, StrikeThough]}>${item.course_fee}</Text> */}
                                                    <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 14, color: "#B357C3", padding: 4, marginLeft: 2 }}>{sliceTitle(item?.description, 50)}</Text>

                                                    {/* <View style={{ flexDirection: "row", padding: 4, marginLeft: 25 }}>
                                                <Image style={{ height: 12, width: 12, marginTop: 1 }} source={require("../../assets/star.png")}></Image>
                                                <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 13, color: "#000", }}> 4.7</Text>
                                            </View> */}

                                                    {/* <TouchableOpacity style={{ height: 23, width: 60, backgroundColor: "#fff", borderRadius: 4, justifyContent: "center", borderWidth: 1, borderColor: '#B357C3', marginLeft: 20 }}>
                                                <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 12, color: "#B357C3", textAlign: "center" }}>{item.lesson_count} lesson</Text>
                                            </TouchableOpacity> */}


                                                </View>
                                                        <View style={{flexDirection:'row'}}>
                                                <TouchableOpacity style={{ height: 25, width: 70, backgroundColor: "#fff", borderRadius: 4, justifyContent: "center", borderWidth: 1, borderColor: '#B357C3', marginLeft: 6, marginTop: 4, }}>
                                                    <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 12, color: "#B357C3", textAlign: "center" }}>{item.lesson_count} lessons</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={{ height: 25, width: 70, backgroundColor: "#fff", borderRadius: 4, justifyContent: "center", borderWidth: 1, borderColor: '#B357C3', marginLeft: 15, marginTop: 4, }}>
                                                    <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 12, color: "#B357C3", textAlign: "center" }}>{item.category_name}</Text>
                                                </TouchableOpacity>
                                                </View>
                                                {/* <View style={{ flexDirection: 'row', }}>

                                            <Image style={{ height: 28, width: 28, marginLeft: 5 }} source={require("../../assets/Rectangle103.png")}></Image>
                                            <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 12, color: "grey", marginTop: 5, marginLeft: 10 }}> +1182 enrolled</Text>

                                        </View> */}


                                                <View style={{ width: '100%', height: 24, backgroundColor: '#132a3a', marginTop: 12, borderRadius: 5 }}>

                                                    <View style={{
                                                        width: item?.completion_status && String(item?.completion_status) + '%', backgroundColor: '#B357C3', height: 24,
                                                        // borderTopLeftRadius: 5, borderBottomLeftRadius: 5
                                                        borderRadius: 5
                                                    }} />
                                                    {/* <View style={{width: '50%'}}/> */}


                                                    <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, position: 'absolute', color: 'white', left: '38%', top: 2 }}> {item?.completion_status && String(item?.completion_status) + '%'} Completed</Text>
                                                </View>


                                            </View>



                                        </TouchableOpacity>

                                    )
                                }}
                                keyExtractor={item => item.id}
                                ListEmptyComponent={<NoDataFound styles={{ marginTop: "27%" }} />}
                            />
                        </View>
                        :
                        TYPE.isCourse(comingFrom) ?

                            <View style={{ marginTop: 4, }}>
                                <FlatList
                                    data={data}
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={({ item }) => {
                                        return (
                                            <TouchableOpacity style={{ width: dimensions.SCREEN_WIDTH * 95 / 100, alignSelf: 'center', marginTop: 15 }}
                                                onPress={() => { props.navigation.navigate('CourseDetails', { data: item }) }}>
                                                <ImageBackground style={{ height: 170, width: '100%', borderTopLeftRadius: 7, borderTopRightRadius: 7, overflow: 'hidden' }} source={{ uri: item.image }}>
                                                    <View style={{ flexDirection: "row", alignSelf: "flex-end", marginTop: 5 }}>
                                                        <TouchableOpacity
                                                            onPress={async () => {
                                                                // return
                                                                await addToWishlist(item?.id, 1, userdetaile.access_token)
                                                                // getCourcesdata()
                                                                getSearch()
                                                            }}
                                                            style={{ marginRight: 10 }}>
                                                            <Image style={{ height: 25, width: 25, tintColor: "#B357C3", }} source={item?.wishlist ? require("../../assets/heartFilled.png") : require("../../assets/heart.png")}></Image>

                                                        </TouchableOpacity>
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                handleShare(item.title)
                                                            }}
                                                            style={{ marginRight: 10 }}>
                                                            <Image style={{ height: 25, width: 25, }} source={require("../../assets/ShareNetwork.png")}></Image>
                                                        </TouchableOpacity>
                                                    </View>
                                                    {/* <TouchableOpacity style={{width:'100%',height:35,backgroundColor:'rgba(100,80,200,0.5)',position:'absolute',bottom:0,justifyContent:'center',zIndex:999}}>
                     <Text style={{fontFamily:FONTFAMILYSEMIBOLD,textAlign:'center',color:'#fff'}}>Free Course</Text>
                       </TouchableOpacity> */}

                                                </ImageBackground>

                                                <View style={{ width: '100%', backgroundColor: '#fff', borderBottomLeftRadius: 5, borderBottomRightRadius: 5, padding: 10 }}>
                                                    <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 13, color: "#000", padding: 5 }}>{item.title}</Text>

                                                    <View style={{ flexDirection: "row" }}>

                                                        {/* <Text style={[{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 14, color: "#B357C3", padding: 4, marginLeft: 2, }, StrikeThough]}>${item.course_fee}</Text> */}
                                                        <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 14, color: "#B357C3", padding: 4, marginLeft: 2 }}>${item.course_sale_fee}</Text>

                                                        <View style={{ flexDirection: "row", padding: 4, marginLeft: 25 }}>
                                                            <Image style={{ height: 12, width: 12, marginTop: 3 }} source={require("../../assets/star.png")}></Image>
                                                            <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 13, color: "#000", }}> {item?.rating}</Text>
                                                        </View>

                                                        {/* <TouchableOpacity style={{ height: 23, width: 70, backgroundColor: "#fff", borderRadius: 4, justifyContent: "center", borderWidth: 1, borderColor: '#B357C3', marginLeft: 20 }}>
                             <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 12, color: "#B357C3", textAlign: "center" }}>{item.lesson_count} Lessons</Text>
                           </TouchableOpacity> */}

                                                        <LessonComp style={{ marginLeft: 20 }} count={item?.lesson_count} />
                                                        <LessonComp removeLesson style={{ marginLeft: 20 }} count={item?.category_name} />

                                                    </View>

                                                    <View style={{ flexDirection: 'row', }}>

                                                        <Image style={{ height: 28, width: 28, marginLeft: 5 }} source={require("../../assets/Rectangle103.png")}></Image>
                                                        <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 13, color: "black", marginTop: 5, marginLeft: 5 }}> {item?.total_purchase} Enrolled</Text>

                                                    </View>

                                                </View>

                                            </TouchableOpacity>

                                        )
                                    }}
                                    keyExtractor={item => item.id}

                                    ListEmptyComponent={<NoDataFound styles={{ marginTop: '32%' }} />}
                                />
                            </View>
                            :
                            <View style={{ marginTop: 10, }}>
                                <FlatList
                                    data={data2}
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={({ item }) => {

                                        const { title,
                                            price,
                                            rating, images, sale_price, wishlist } = item

                                        return (
                                            <View style={{ width: dimensions.SCREEN_WIDTH * 95 / 100, alignSelf: 'center', marginTop: 15 }}
                                                onPress={() => { props.navigation.navigate('ProductDetails', { data: item }) }}>
                                                <TouchableOpacity activeOpacity={0.5}
                                                    onPress={() => {
                                                        props.navigation.navigate('ProductDetails', { data: item })
                                                        // console.log(item?.id);
                                                    }} style={{ width: '100%' }}>
                                                    <ImageBackground style={{ height: 170, width: '100%', borderTopLeftRadius: 7, borderTopRightRadius: 7, overflow: 'hidden' }} source={{ uri: images[0].image }}>
                                                        <View style={{ flexDirection: "row", alignSelf: "flex-end", marginTop: 5 }}>
                                                            <TouchableOpacity
                                                                onPress={async () => {
                                                                    await addToWishlist(item?.id, 2, userdetaile.access_token)
                                                                    //   getProductdata()
                                                                    getSearch()
                                                                }}
                                                                style={{ marginRight: 10 }}>

                                                                <Image style={{ height: 25, width: 25, tintColor: "#B357C3", }} source={wishlist ? require("../../assets/heartFilled.png") : require("../../assets/heart.png")}></Image>

                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={() => {
                                                                handleShare(title)
                                                            }} style={{ marginRight: 10 }}>
                                                                <Image style={{ height: 25, width: 25, }} source={require("../../assets/ShareNetwork.png")}></Image>
                                                            </TouchableOpacity>
                                                        </View>


                                                    </ImageBackground>
                                                </TouchableOpacity>


                                                <View style={{ width: '100%', backgroundColor: '#fff', borderBottomLeftRadius: 5, borderBottomRightRadius: 5, padding: 10 }}>
                                                    <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 13, color: "#000", padding: 5 }}>{title}</Text>

                                                    <View style={{ flexDirection: "row" }}>

                                                        <Text style={[{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 14, color: "#B357C3", padding: 4, marginLeft: 2, }, StrikeThough]}>${price}</Text>
                                                        <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 14, color: "#B357C3", padding: 4, marginLeft: 2 }}>${sale_price}</Text>

                                                        <View style={{ flexDirection: "row", padding: 4, marginLeft: 25 }}>
                                                            <Image style={{ height: 12, width: 12, marginTop: 3 }} source={require("../../assets/star.png")}></Image>
                                                            <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 13, color: "#000", }}> {rating}</Text>
                                                        </View>


                                                    </View>

                                                    <View style={{ width: responsiveWidth(90), alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>

                                                        <AddToCartHandleComponent startLoader={() => {
                                                            // setLoading(true)
                                                            controlLoader(true)
                                                        }
                                                        } id={item?.id} type={2} in_cart={item?.in_cart} addRemoveButton={true}
                                                            //   callback={getProductdata}
                                                            callback={getSearch}
                                                        >
                                                            <View style={{ width: responsiveWidth(42), paddingVertical: 10, borderRadius: 4, justifyContent: 'center', backgroundColor: '#B357C3' }}>
                                                                <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, color: '#fff', textAlign: 'center' }}> {item?.in_cart ? "Remove from Cart" : "Add to cart"} </Text>
                                                            </View>
                                                        </AddToCartHandleComponent>

                                                        <AddToCartHandleComponent startLoader={() => {
                                                            // setLoading(true)
                                                            controlLoader(true)
                                                        }} id={item?.id} type={2} in_cart={item?.in_cart} buyBtn={true}
                                                            // callback={getProductdata}
                                                            callback={getSearch}
                                                        >
                                                            <View style={{ width: responsiveWidth(42), paddingVertical: 10, borderRadius: 4, justifyContent: 'center', backgroundColor: '#4556A6' }}>
                                                                <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, color: '#fff', textAlign: 'center' }}>Buy Now</Text>
                                                            </View>
                                                        </AddToCartHandleComponent>

                                                    </View>

                                                </View>

                                            </View>

                                        )
                                    }}
                                    keyExtractor={item => item.id}
                                    ListEmptyComponent={<NoDataFound styles={{ marginTop: '32%' }} />}
                                />
                            </View>
                    :
                    !select1 ?
                        <View style={{ marginTop: 4, }}>
                            <FlatList
                                scrollEnabled={false}
                                data={data}
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={item => item.id}
                                renderItem={({ item }) => {

                                    let {
                                        title,
                                        image,
                                        updated_at,
                                        lesson_count, rating, course_fee, course_sale_fee
                                    } = item



                                    return (
                                        <TouchableOpacity onPress={() => { props.navigation.navigate('CourseDetails', { data: item, }) }} style={{ width: dimensions.SCREEN_WIDTH * 95 / 100, alignSelf: 'center', marginTop: 15, backgroundColor: '#fff', borderRadius: 7 }}>

                                            <View style={{
                                                width: '100%', backgroundColor: '#fff', flexDirection: "row", justifyContent: "space-between", padding: 10, borderRadius: 7, borderBottomColor: 'rgba(0,0,0,0.2)', borderBottomWidth: 0.5, alignItems: 'center'
                                            }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 13, color: "#000", }}>Date: </Text>
                                                    <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 13, color: "#B357C3", marginLeft: 5 }}>{updated_at.split(" ")[0]}</Text>

                                                </View>
                                                {/* <TouchableOpacity style={{ height: 30, backgroundColor: "#4556A6", borderRadius: 4, justifyContent: "center", paddingHorizontal: 10 }}>
                        <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 13, color: "#fff", }}>Start Over Again</Text>
                      </TouchableOpacity> */}
                                            </View>


                                            <View style={{ width: '100%', backgroundColor: '#FFFFFF', alignSelf: "center", marginTop: 10, borderBottomLeftRadius: 7, borderBottomRightRadius: 7 }}>
                                                {/* <View style={{ flexDirection: "row", width: '25%', height: 20, backgroundColor: "#fff", borderRadius: 3, justifyContent: "center", marginBottom: 7, borderWidth: 1, borderColor: "#34A853", marginLeft: 10 }}>
                        <Image style={{ height: 14, width: 14, marginRight: 10, marginTop: 2 }} source={require("../../assets/tickcircle.png")}></Image>
                        <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 11, color: "#34A853", alignSelf: "center" }}>Completed</Text>
                      </View> */}

                                                <View style={{ flexDirection: "row" }}>
                                                    <Image style={{ height: 80, width: dimensions.SCREEN_WIDTH * 30 / 100, marginLeft: 10, borderRadius: 7 }} source=
                                                        {{ uri: image }}
                                                    // {require("../../assets/Rectangle104.png")}
                                                    ></Image>
                                                    <View style={{ marginLeft: 10 }}>
                                                        <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 13, color: "#000", }}>{title}</Text>

                                                        <View style={{ flexDirection: "row", marginTop: 8 }}>
                                                            {/* <Text style={[{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 13, color: "#B357C3", }, StrikeThough]}>${course_fee}</Text> */}
                                                            <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 13, color: "#B357C3", marginLeft: 5 }}>${course_sale_fee}</Text>
                                                            <Image style={{ height: 10, width: 10, marginLeft: 15, marginTop: 2 }} source={require("../../assets/star.png")}></Image>
                                                            <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 12, color: "#000", }}> {rating}</Text>
                                                        </View>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <TouchableOpacity style={{ height: 19, width: 60, backgroundColor: "#fff", borderRadius: 4, justifyContent: "center", borderWidth: 1, borderColor: '#B357C3', marginTop: 8 }}>
                                                                <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 11, color: "#B357C3", textAlign: "center" }}>{lesson_count}{lesson_count < 2 ? ' Lesson' : ' Lessons'}</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity style={{ height: 19, width: 70, backgroundColor: "#fff", borderRadius: 4, justifyContent: "center", borderWidth: 1, borderColor: '#B357C3', marginTop: 8, marginLeft: 10 }}>
                                                                <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 11, color: "#B357C3", textAlign: "center" }}>{item?.category_name}</Text>
                                                            </TouchableOpacity>
                                                        </View>

                                                    </View>

                                                </View>
                                                {/* <View style={{ flexDirection: 'row', margin: 10 }}>
                        <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 12, color: "#000", }}>Completed Course on:</Text>
                        <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 12, color: "#B357C3", marginLeft: 5 }}>26 jun /2023</Text>

                      </View> */}
                                                <View style={{ width: '100%', height: 10 }} />
                                            </View>

                                            {/* <TouchableOpacity style={{ width: '100%', height: 45, backgroundColor: '#B357C3', justifyContent: 'center', borderBottomLeftRadius: 7, borderBottomRightRadius: 7 }}>
                      <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                        <Image style={{ height: 18, width: 18, tintColor: '#fff' }} source={require("../../assets/edit2.png")}></Image>
                        <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 14, color: "#fff", marginLeft: 10 }}>Write your review here</Text>

                      </View>
                    </TouchableOpacity> */}

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
                                scrollEnabled={false}
                                data={data2}
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={item => item.id}
                                renderItem={({ item }) => {

                                    const { title,
                                        price,
                                        sale_price,
                                        updated_at,
                                        rating,
                                        images,
                                        quantity } = item


                                    return <TouchableOpacity style={{ width: dimensions.SCREEN_WIDTH * 95 / 100, alignSelf: 'center', marginTop: 15, backgroundColor: '#fff', borderRadius: 7, paddingBottom: 12 }}
                                        onPress={() => { props.navigation.navigate('ProductDetails', { data: item, }) }}>

                                        <View style={{
                                            width: '100%', backgroundColor: '#fff', flexDirection: "row", justifyContent: "space-between", padding: 10, borderRadius: 7, borderBottomColor: 'rgba(0,0,0,0.2)', borderBottomWidth: 0.5, alignItems: 'center'
                                        }}>
                                            <View style={{ flexDirection: 'row', backgroundColor: 'transparent' }}>
                                                <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 13, color: "#000", }}>Date: </Text>
                                                <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 13, color: "#B357C3", marginLeft: 5 }}>{updated_at?.split(" ")[0]}</Text>

                                            </View>
                                            {/* <TouchableOpacity style={{ height: 30, backgroundColor: "transparent", borderRadius: 4, justifyContent: "center", paddingHorizontal: 10, borderColor: '#4556A6', borderWidth: 0.5 }}>
                                            <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 13, color: "#4556A6", }}>Picked-up</Text>
                                        </TouchableOpacity> */}
                                        </View>


                                        <View style={{ width: '100%', backgroundColor: '#FFFFFF', alignSelf: "center", marginTop: 10, borderBottomLeftRadius: 7, borderBottomRightRadius: 7 }}>

                                            <View style={{ flexDirection: "row" }}>
                                                <Image style={{ height: 80, width: dimensions.SCREEN_WIDTH * 30 / 100, marginLeft: 10, borderRadius: 7 }}
                                                    source={{ uri: images[0]?.image }}
                                                ></Image>
                                                <View style={{ marginLeft: 10 }}>
                                                    <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 13, color: "#000", }}>{title}</Text>

                                                    <View style={{ flexDirection: "row", marginTop: 8 }}>
                                                        <Text style={[{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 13, color: "#B357C3", }, StrikeThough]}>${price}</Text>
                                                        <Text style={[{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 13, color: "#B357C3", marginLeft: 8 },]}>${sale_price}</Text>

                                                    </View>

                                                    {/* <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 12, color: "#000", marginTop: 7 }}>{"jjjj"}</Text> */}
                                                    <View style={{ flexDirection: "row", marginTop: 8 }}>

                                                        <Image style={{ height: 10, width: 10, marginLeft: 0, marginTop: 2 }} source={require("../../assets/star.png")}></Image>
                                                        <Text style={{ fontFamily: FONTFAMILYSEMIBOLD, fontSize: 12, color: "#000", }}> {rating}</Text>
                                                    </View>

                                                </View>

                                            </View>

                                        </View>

                                        {/* <TouchableOpacity style={{ width: '100%', height: 45, backgroundColor: '#B357C3', justifyContent: 'center', borderBottomLeftRadius: 7, borderBottomRightRadius: 7, marginTop: 10 }}>
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                      <Image style={{ height: 18, width: 18, tintColor: '#fff' }} source={require("../../assets/edit2.png")}></Image>
                      <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 14, color: "#fff", marginLeft: 10 }}>Write your review here</Text>

                    </View>
                  </TouchableOpacity> */}

                                    </TouchableOpacity>
                                }}
                                ListEmptyComponent={<NoDataFound styles={{ marginTop: "27%" }} />}
                            />
                        </View>


                }




                
                <View style={{ width: 50, height: 150 }} />
            </ScrollView>
            {loading ?
                    <Loader />
                    : null
                }
        </LinearGradient>
    </>
    );
}
const styles = StyleSheet.create({


});
export default HomeSearch