import { View, Text, SafeAreaView, TouchableOpacity, Image, ViewComponent, ImageBackground, ScrollView, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import HomeHeader2 from '../../component/HomeHeader2'
import useAPI from '../../utility/hooks/useAPI'
import { useDispatch, useSelector } from 'react-redux'
import { reloadCommunity } from '../../redux/reduxSlices/communitySlice'
import Loader from '../../WebApi/Loader'
import { dimensions } from '../../utility/Mycolors'
import AllCommentsComp from './Comments/AllCommentsComp'
import NoDataFound from '../../component/NoDataFound'
import { Pages } from 'react-native-pages';
import { FONTFAMILY, FONTFAMILYSEMIBOLD } from '../../utility/fonts'
// import { Image } from 'react-native-svg'

const PostDetails = (props) => {

    const [item, setitem] = useState()

    const { getAPI, loading, postAPI, deleteAPI } = useAPI()

    const updateCommunity = useSelector(state => state.community.updateCommunity);
    const dispatch = useDispatch();

    const postID = props.route.params.postID;
    console.log("props.route", props.route.params);


    async function getPostDetails() {


        const res = await getAPI({ endPoint: `post-details/${postID}` })
        if (!res) {
            return
        }

        console.log({ res });

        setitem(res?.data)



    }

    async function likeDislike() {

        await postAPI({
            endPoint: "like-unlike-post", bodyJSON: {
                id: postID,
                type: 1
            }
        })
        // getPostDetails()
        dispatch(reloadCommunity())

    }

    useEffect(() => {

        getPostDetails()

    }, [updateCommunity]);

    function reloadAPI() {
        getPostDetails()
    }

    // console.log(item);

    return (
        <LinearGradient colors={['#300076', '#53045F']} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={() => {
                                getPostDetails()
                            }} />}
                >
                    <HomeHeader2
                        height={60}
                        // paddingHorizontal={15}
                        title={'Post'}
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
                    <View style={{
                        alignItems: 'center',
                        flex: 1,
                        paddingHorizontal: 10,
                    }}>

                        <View style={{ height: 210, width: dimensions.SCREEN_WIDTH }}>
                            <Pages>

                                {item?.images?.map((image, index) => <ImageBackground style={{ height: 200, width: '100%', borderTopLeftRadius: 7, borderTopRightRadius: 7, overflow: 'hidden' }} resizeMode='cover' source=
                                    // {require("../../assets/Rectangle1036.png")}
                                    {{ uri: image.image }}
                                >

                                </ImageBackground>

                                )}


                            </Pages>
                        </View>




                        <View style={{ width: '100%', padding: 10 }}>
                            <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 16, color: "#fff", fontWeight: '600' }}>{item?.title}</Text>

                            <View style={{ flexDirection: "row", width: dimensions.SCREEN_WIDTH * 95 / 100, paddingVertical: 10, }}>
                                <Image style={{ width: 30, height: 30, borderRadius: 25 }} source={{ uri: item?.created_by_profile }} />
                                <View style={{ flexDirection: 'row', width: 120, marginRight: 5 }}>
                                    {/* <Text style={{fontFamily:FONTFAMILY, fontSize: 14, color: "#fff", paddingVertical: 4, marginLeft: 4 }}>By-</Text> */}
                                    <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 14, color: "white", paddingVertical: 4, marginLeft: 9 }}>{item?.created_by}</Text>

                                </View>

                                <View style={{ flexDirection: "row", padding: 4, marginLeft: 5 }}>
                                    <Image style={{ height: 18, width: 18, marginTop: -1, tintColor: '#fff' }} source={require("../../assets/calendar.png")}></Image>
                                    <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 13, color: "#B357C3", marginRight: 8, marginLeft: 5 }}>
                                        {item?.created_at.split(" ")[0]}
                                        {/* {item?.updated_at.split(" ")[0]} */}

                                    </Text>
                                </View>
                                <TouchableOpacity onPress={likeDislike} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 5, backgroundColor: '#B357C3', paddingHorizontal: 8, paddingVertical: 5, marginLeft: 5, marginBottom: 2 }}>
                                    <Image style={{ width: 18, height: 18, tintColor: "white" }} source={{ uri: item?.is_like ? "https://cdn-icons-png.flaticon.com/128/1077/1077035.png" : 'https://cdn-icons-png.flaticon.com/512/1077/1077086.png' }} />
                                    <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 13, color: "white", marginLeft: 3 }}> {item?.like_count} Likes</Text>
                                </TouchableOpacity>

                                {/* <TouchableOpacity style={{ height: 23, backgroundColor: "transparent", borderRadius: 4, justifyContent: "center", borderWidth: 1, borderColor: '#B357C3', marginLeft: 10, paddingHorizontal: 10 }}>
                                <Text style={{fontFamily:FONTFAMILY, fontSize: 12, color: "#B357C3", textAlign: "center" }}>Skin care tips</Text>
                            </TouchableOpacity> */}


                            </View>

                            <View style={{}}>

                                <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 12, color: "#fff", marginTop: 5, marginLeft: 1 }}>{item?.description}</Text>
                                {/* <WebView
                      originWhitelist={['*']}
                    source={{ html: '<p>Skincare is not just about looking good, it’s about caring for the health and wellbeing of your skin. Today, information about skincare is readily available online, but it’s not always accurate. With a quick search on social media, you can find posts detailing the best products for your skin, and hacks to ensure that your skin is always looking flawless. But, there’s no guarantee that this information is anything more than a common myth. It’s important to debunk skincare myths, as misinformation can lead to ineffective routines, wasted money on products that don’t work, and even damage to your skin. </p>' }}
                    />    */}


                            </View>


                            <View onPress={() => { }} style={{ width: '100%', borderRadius: 10, justifyContent: 'space-evenly', alignItems: 'center', padding: 10 }}>





                                {/* {item &&
                                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 5, borderTopLeftRadius: 10, borderTopRightRadius: 10, marginTop: 15 }}>

                                       

                                        <TouchableOpacity onPress={likeDislike} style={{ width: '33%', height: 30, borderColor: "#1079C0", borderWidth: 0.3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 5, backgroundColor: 'white' }}>
                                            <Image style={{ width: 20, height: 20, tintColor: "#1079C0" }} source={{ uri: !(item?.is_liked) ? "https://cdn-icons-png.flaticon.com/128/1077/1077035.png" : 'https://cdn-icons-png.flaticon.com/512/1077/1077086.png' }} />
                                            {item?.is_liked && <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "grey", marginLeft: 3 }}> {item?.like_count}</Text>}
                                        </TouchableOpacity>


                                        <TouchableOpacity onPress={() => {
                                            props?.navigation?.navigate("AllComments", { postID: postID })
                                        }}
                                            style={{ width: '33%', height: 30, borderColor: "#1079C0", borderWidth: 0.3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 5, backgroundColor: 'white' }}>
                                            <Image style={{ width: 20, height: 20, tintColor: "#1079C0" }} source={{ uri: true ? "https://cdn-icons-png.flaticon.com/512/1380/1380338.png" : 'https://cdn-icons-png.flaticon.com/512/1381/1381635.png' }} />
                                            <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "grey", marginLeft: 3 }}> {item?.comment_count}</Text>
                                        </TouchableOpacity>
                                    </View>

                                } */}

                            </View>

                            {/* All Comments */}
                            {/* <TouchableOpacity onPress={() => {
                                props?.navigation?.navigate("AllComments", { postID: postID })
                            }}
                                style={{ width: '33%', height: 30, borderColor: "#1079C0", borderWidth: 0.3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 5, backgroundColor: 'white' }}>
                                <Image style={{ width: 20, height: 20, tintColor: "#1079C0" }} source={{ uri: true ? "https://cdn-icons-png.flaticon.com/512/1380/1380338.png" : 'https://cdn-icons-png.flaticon.com/512/1381/1381635.png' }} />
                                <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "grey", marginLeft: 3 }}> {item?.comment_count}</Text>
                            </TouchableOpacity> */}

                        </View>



                        {item && <AllCommentsComp postAPI={postAPI} deleteAPI={deleteAPI} data={item} postID={postID} reloadAPI={reloadAPI}
                        // trimComment={3}
                        />

                        }
                    </View>
                </ScrollView>
            </SafeAreaView>
            {loading && <Loader />}
        </LinearGradient>
    )
}

export default PostDetails