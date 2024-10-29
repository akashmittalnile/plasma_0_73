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
    TouchableOpacity, ImageBackground,
    RefreshControl,
    ActivityIndicator
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
    follow_unfollow,
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
import { WebView } from 'react-native-webview';
import useAPI from '../../utility/hooks/useAPI';
import useHideBottomTab from '../../utility/hooks/useHideBottomTab';
import {
    responsiveFontSize,
    responsiveHeight,
    responsiveWidth,
} from 'react-native-responsive-dimensions';
import { sliceTitle } from '../../utility/MyFunctions';
import MySearchBar from '../../component/MySearchBar';
import NoDataFound from '../../component/NoDataFound';
import { FONTFAMILY, FONTFAMILYBOLD, FONTFAMILYSEMIBOLD } from '../../utility/fonts';



const AllCommunities = (props) => {

    const dispatch = useDispatch();

    const [searchVal, setSearchVal] = useState('');
    const [data, setData] = useState({})
    const communitiesList = data?.data || []
    const followedCommunities = data?.data?.filter((item, _) => item?.is_followed).length || 0



    const { getAPI, postAPI, loading } = useAPI()

    async function getAllCommunities() {

        const res = await getAPI({ endPoint: 'communities', })
        if (res) {
            setData(res)
            // console.log("SON.stringify", JSON.stringify(res?.data));
        }

    }

    async function searchOnAllCommunities(keyword) {

        const res = await getAPI({ endPoint: 'communities?search=' + keyword })
        if (res) {
            setData(res)
            // console.log("SON.stringify", JSON.stringify(res?.data));
        }

    }

    const toggleFollow = async (status, id) => {

        await postAPI({
            endPoint: follow_unfollow, bodyJSON: {
                id: id,
                status: status
            }
        })

        getAllCommunities()


    }

    useEffect(() => {

        getAllCommunities()

        return () => {

        }
    }, [])


    return (
        <>
            <LinearGradient colors={['#300076', '#53045F']} style={{ flex: 1, padding: 12 }}>
                <SafeAreaView />
                <HomeHeader2
                    height={60}
                    // paddingHorizontal={15}
                    title={'All Communities'}
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
                            getAllCommunities()

                        }} />}>
                    <View style={styles.communityAndMessageBox}>
                        <View style={styles.communityContainer}>
                            <TouchableOpacity
                                onPress={() => {
                                    // goToScreenHandler('FollowedCommunity');
                                    console.log({ communitiesList }, { data });
                                }}>
                                <Image
                                    source={require('../../assets/global.png')}
                                    style={styles.img}
                                    resizeMode="contain"
                                />
                                <Text style={styles.text}>Followed Communities</Text>
                                <View>
                                    <Text style={styles.number}>{followedCommunities}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.communityContainer}>
                            <TouchableOpacity
                                onPress={() => {
                                    // goToScreenHandler('MyCommunity');
                                }}>
                                <Image
                                    source={require('../../assets/global.png')}
                                    style={styles.img}
                                    resizeMode="contain"
                                />
                                <Text style={styles.text}>All Communities</Text>
                                <View>
                                    <Text style={styles.number}>{communitiesList?.length}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        {/* <View style={styles.communityContainer}>
        <TouchableOpacity
          onPress={() => {
            goToScreenHandler('Chat');
          }}>
          <Image
            source={require('../../assets/Icons/messages.png')}
            style={styles.img}
            resizeMode="contain"
          />
          <Text style={styles.text}>Messages</Text>
          <Text style={{fontFamily:FONTFAMILY,color: 'gray'}}>New</Text>
          <View>
            <Text style={styles.number}>{unSeenMessage}</Text>
          </View>
        </TouchableOpacity>
      </View> */}
                    </View>

                    {/* <View style={{ height: 15 }} /> */}

                    <MySearchBar onSearchSubmit={(text)=>{
                        searchOnAllCommunities(text)
                    }} placeHolder='Communities' textInputStyle={{ left: 0 }} />

                    {communitiesList?.map((item, index) => {


                        return (<TouchableOpacity onPressIn={() => {

                            if (!(item?.is_followed)) {
                                Toast.show("Please follow the community first")
                                return
                            }

                            props.navigation.navigate('CommunityDetails', { "communityID": item?.id })
                        }} key={index}
                            style={{ backgroundColor: 'white', borderRadius: 10, marginTop: 10, paddingVertical: 3 }}
                            activeOpacity={0.5}
                            onPress={null}
                        >
                            <View style={{ width: '100%', }}>
                                {/* header */}
                                <View style={styles.header}>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'flex-start',
                                            alignItems: 'center',
                                            width: '55%',
                                        }}>
                                        <View
                                            style={{
                                                // height: responsiveHeight(5),
                                                width: responsiveHeight(5),
                                                borderRadius: responsiveHeight(3),
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                // backgroundColor: globalStyles.veryLightGray,
                                            }}>
                                            <Image
                                                // source={require('../../assets/notification.png')}
                                                source={{ uri: item?.images[0]?.image }}
                                                resizeMode="cover"
                                                // tintColor={"black"}
                                                style={{
                                                    height: responsiveHeight(5),
                                                    width: responsiveHeight(5),
                                                    borderRadius: responsiveHeight(3),
                                                }}
                                            />
                                        </View>
                                        <Text
                                            style={{
                                                color: 'black',
                                                // fontWeight: '500',
                                                marginLeft: responsiveWidth(2),
                                                width: '70%',
                                                fontFamily: FONTFAMILYBOLD
                                            }}>
                                            {sliceTitle(item?.name)}
                                        </Text>
                                    </View>
                                    <View style={styles.buttonContainer}>
                                        {true && (
                                            <View
                                                style={{
                                                    height: responsiveHeight(4),

                                                    marginRight: responsiveWidth(1),
                                                }}>
                                                {
                                                    // <IconButton
                                                    //     onPress={() => {
                                                    //         // editButtonHandler && editButtonHandler();
                                                    //     }}
                                                    //     // iconUri={Image.resolveAssetSource(edit).uri}
                                                    //     style={styles.moreButton}
                                                    // />
                                                    // <TouchableOpacity
                                                    //   disabled={loader}
                                                    //   style={{...styles.touch, backgroundColor: 'red'}}
                                                    //   onPress={onClick}>
                                                    //   <Text style={styles.buttonText}>{headerButtonText}</Text>
                                                    // </TouchableOpacity>
                                                }
                                            </View>
                                        )}

                                        {true && (
                                            <View
                                                style={{
                                                    // ...globalStyles.shadowStyle,
                                                    height: responsiveHeight(4),
                                                }}>
                                                <TouchableOpacity style={[{ height: 30, backgroundColor: "#B357C3", borderRadius: 7, justifyContent: "center", alignSelf: "center", }, styles.touch]}
                                                    onPress={() => { toggleFollow(item?.is_followed ? 0 : 1, item?.id) }}>
                                                    <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 13, color: "#fff", textAlign: "center", fontFamily:FONTFAMILYSEMIBOLD }}>{item?.is_followed ? 'Unfollow' : 'Follow'}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    </View>
                                </View>

                                {/* tab images */}
                                {/* {imagesNode?.length > 0 && (
            <View style={styles.tabImgsContainer}>{imagesNode}</View>
        )} */}

                                {/* plan */}

                                <View style={styles.planContainer}>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            flex: 2,
                                            height: '100%',
                                        }}>
                                        <Text
                                            style={{
                                                fontSize: responsiveFontSize(1.7),
                                                fontWeight: '500',
                                                letterSpacing: 0.8, fontFamily:FONTFAMILYSEMIBOLD
                                                // color: globalStyles.themeBlue,
                                            }}>{`${item?.community_post} Posts`}</Text>
                                        {/* <View style={styles.imgContainer}>
<Image
source={require('../../assets/Icons/plan.png')}
resizeMode="contain"
style={styles.img}
/>
</View>
<View style={{marginLeft: responsiveWidth(2)}}>
<Text
style={{
  fontSize: responsiveFontSize(1.6),
  fontWeight: '500',
  color: 'black',
  marginBottom: responsiveHeight(0.5),
}}>
{planName}
</Text>
<Text
style={{
  fontSize: responsiveFontSize(1.3),
  color: 'black',
}}>
{planPrice}
</Text>
</View> */}
                                    </View>

                                    {/* members images */}
                                    <View style={{ height: responsiveHeight(4) }}>
                                        <TouchableOpacity disabled={true}>
                                            {
                                                <View style={styles.tabMembersContainer}>
                                                    <View
                                                        style={{
                                                            position: 'relative',
                                                            height: responsiveHeight(4),
                                                            width: responsiveHeight(5),
                                                        }}>
                                                        {(
                                                            <View
                                                                style={{
                                                                    ...styles.tabMemberContainer,
                                                                    left: responsiveWidth(3),
                                                                }}>
                                                                {/* <Image
                                            source={{ uri: memberImages[memberImages?.length - 3] }}
                                            style={[styles.memberImg, { zIndex: 1000 }]}
                                            resizeMode="cover"
                                        /> */}
                                                            </View>
                                                        )}
                                                        {(
                                                            <View
                                                                style={{
                                                                    ...styles.tabMemberContainer,
                                                                    left: responsiveWidth(4),
                                                                }}>
                                                                {/* <Image
                                            source={{ uri: memberImages[memberImages?.length - 2] }}
                                            style={[styles.memberImg, { zIndex: 1500 }]}
                                            resizeMode="cover"
                                        /> */}
                                                            </View>
                                                        )}
                                                        {(
                                                            <View
                                                                style={{
                                                                    ...styles.tabMemberContainer,
                                                                    left: responsiveWidth(5.5),
                                                                }}>
                                                                {/* <Image
                                            source={{ uri: memberImages[memberImages?.length - 1] }}
                                            style={[styles.memberImg, { zIndex: 2000 }]}
                                            resizeMode="cover"
                                        /> */}
                                                            </View>
                                                        )}
                                                    </View>
                                                    <Text
                                                        style={{
                                                            marginLeft: responsiveWidth(7),
                                                            color: 'black', fontFamily:FONTFAMILYSEMIBOLD
                                                        }}>
                                                        {`${item?.community_follower} Followers`}
                                                    </Text>
                                                </View>
                                            }
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>)
                    })}

                    {communitiesList?.length == 0 &&
                    <NoDataFound msg='No Communities Found' styles={{marginTop: 15}}/>
                    }
                </ScrollView>

            </LinearGradient>
            {loading && <Loader />}
        </>
    )
}

export default AllCommunities

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        alignItems: 'center',
    },
    subContainer: {
        flex: 1,
        width: responsiveWidth(95),
    },
    rejectedCommunityContainer: {
        flexDirection: 'row',
        marginTop: responsiveHeight(2),
        paddingVertical: responsiveHeight(1.5),
        paddingHorizontal: responsiveWidth(2),
        borderRadius: responsiveWidth(2),
        // ...globalStyles.shadowStyle,
    },
    globalSearchIcon: {
        height: responsiveHeight(6),
        width: responsiveHeight(6),
    },
    rejectedCommunityTextContainer: {
        justifyContent: 'space-between',
        marginLeft: responsiveWidth(1),
    },
    communityAndMessageBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: responsiveHeight(2),
        width: '100%',
    },
    communityContainer: {
        width: '48%',
        // width: '30%',
        backgroundColor: 'white',
        elevation: 3,
        borderRadius: responsiveWidth(2),
        // shadowColor: globalStyles.lightGray,
        paddingHorizontal: responsiveWidth(2),
        paddingVertical:5
    },
    img: {
        marginTop: responsiveHeight(1),
        height: responsiveHeight(6),
        width: responsiveWidth(10),
    },
    text: {
        marginTop: responsiveHeight(1),
        color: 'black',
        fontSize: responsiveFontSize(1.6),
        fontWeight: '400', fontFamily:FONTFAMILYBOLD
    },
    number: {
        marginTop: responsiveHeight(0.5),
        // color: globalStyles.themeBlue,
        fontSize: responsiveFontSize(2),
        // fontWeight: '500',
        // paddingBottom: responsiveHeight(1),
        textAlignVertical: 'center', fontFamily:FONTFAMILYSEMIBOLD
    },
    searchBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: responsiveHeight(2),
        height: responsiveFontSize(7),
        borderRadius: responsiveWidth(2),
        overflow: 'hidden',
    },
    search: {
        height: '100%',
        width: '60%',
        borderRadius: responsiveWidth(2),
        backgroundColor: 'white',
        elevation: 3,
        // shadowColor: globalStyles.shadowColor,
    },
    noDataFoundContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: responsiveHeight(5),
    },
    noUserFoundImage: {
        height: responsiveHeight(10),
        width: responsiveWidth(20),
    },
    noUserFound: {
        fontSize: responsiveFontSize(2.5),
        fontWeight: '400',
        textAlign: 'center',
        color: 'black',
    },
    wrapper: {
        marginTop: responsiveHeight(1),
        paddingTop: responsiveHeight(1),
        width: '100%',
        borderRadius: responsiveWidth(2),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: responsiveHeight(6),
        width: responsiveWidth(94.5),
        paddingBottom: responsiveHeight(0.5),
        paddingHorizontal: responsiveWidth(2),
        borderBottomWidth: 0.4,
        // borderBottomColor: globalStyles.lightGray,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '45%',
    },
    touch: {
        justifyContent: 'center',
        height: '100%',
        width: responsiveWidth(17),
        paddingVertical: 5,
        alignItems: 'center',
        // backgroundColor: globalStyles.themeBlue,
        borderRadius: responsiveWidth(2),
        elevation: 3,
        // shadowColor: globalStyles.themeBlue,
    },
    buttonText: {
        paddingVertical: responsiveHeight(0.4),
        color: 'white',
        fontSize: responsiveFontSize(1.4),
        fontWeight: '700',
    },
    planContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: responsiveHeight(1),
        paddingBottom: responsiveHeight(1),
        paddingHorizontal: responsiveWidth(2),
        width: '100%',
    },
    imgContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: responsiveHeight(5),
        width: responsiveHeight(5),
        borderRadius: responsiveWidth(2),
        overflow: 'hidden',
    },
    img: {
        height: responsiveHeight(5),
        width: responsiveHeight(5),
    },
    tabImgsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: responsiveHeight(1.2),
        paddingBottom: responsiveHeight(1),
        paddingHorizontal: responsiveWidth(2),
        borderBottomWidth: 0.4,
        // borderBlockColor: globalStyles.lightGray,
    },
    tabImgContainer: {
        height: responsiveHeight(6),
        width: responsiveHeight(6),
        marginRight: responsiveWidth(1),
        borderRadius: responsiveWidth(2),
        overflow: 'hidden',
    },
    tabImg: {
        height: '100%',
        width: '100%',
    },
    tabMembersContainer: {
        position: 'relative',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: '100%',
    },
    tabMemberContainer: {
        position: 'absolute',
        height: responsiveHeight(4),
        width: responsiveHeight(4),
        borderRadius: responsiveHeight(2),
        overflow: 'hidden',
    },
    memberImg: {
        height: '100%',
        width: 'auto',
    },
    moreButton: {
        marginBottom: responsiveHeight(0.5),
        height: '100%',
        width: responsiveWidth(10),
        // backgroundColor: globalStyles.themeBlue,
    },
});