import { View, Text, ScrollView, FlatList, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'
import HomeHeader2 from '../../component/HomeHeader2'
import { dimensions } from '../../utility/Mycolors'
import useAPI from '../../utility/hooks/useAPI'
import Loader from '../../WebApi/Loader'
import SkeletonContainer from '../../component/Skelton/SkeltonContainer'
import { FONTFAMILY } from '../../utility/fonts'

const GetGoalBackup = (props) => {



    const [goal, setGoal] = useState([])

    const { getAPI, loading } = useAPI()

    useEffect(() => {

        !(async () => {

            const resp = await getAPI({endPoint: 'get-goal'})

            // console.log(resp?.data);

            resp && setGoal(resp?.data)

        })()


    }, [])


    const RenderItemLead = ({ item }) => {
        return (
            <View style={[{
                width: dimensions.SCREEN_WIDTH * 0.90,
                height: 'auto',
                borderRadius: 10,
                marginVertical: 12,
                padding: 10,
                alignSelf: 'center',
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 3,
                },
                shadowRadius: 5,
                shadowOpacity: 0.05,
                elevation: 2,


            }, { backgroundColor: 'white' }]}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{
                        height: 50,
                        width: 50,
                        borderRadius: 50,
                        backgroundColor: '#53045F',
                        justifyContent: 'center',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        {/* <Mycourse width={27} height={27} style={{ alignSelf: 'center' }}></Mycourse> */}
                        <Image source={require('../../assets/menu-board.png')} style={{ height: 25, width: 25, tintColor: '#fff' }}></Image>


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
                        fontFamily: "Roboto",
                        marginHorizontal: 12,

                    }}>{item.goal_statement}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginHorizontal: 10, marginVertical: 14, justifyContent: 'space-between' }}>
                    {/* <MyText
                        text={`Goal Type: ${item.goal_type}`}
                        fontWeight="bold"
                        fontSize={14}
                        textColor={Color.LIGHT_BLACK}
                        fontFamily="Roboto"

                        style={{
                        }}
                    /> */}

                    <Text style={{fontFamily:FONTFAMILY,
                        alignSelf: 'center', fontWeight: "bold",
                        fontSize: 14,
                        textColor: 'black',
                        fontFamily: "Roboto",
                        marginHorizontal: 12,

                    }}>{`Goal Type: ${item.goal_type}`}</Text>

                    {/* <MyText
                        text={
                            // moment(item?.achieve_date).format('MM/DD/YYYY')
                            item?.achieve_date
                        }
                        fontWeight="400"
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
                        fontFamily: "Roboto",
                        marginHorizontal: 12,

                    }}>{item?.achieve_date}</Text>
                </View>
                <View style={{ flexDirection: 'row', }}>
                    <TouchableOpacity style={[{
                        width: 125,
                        height: 44,
                        borderRadius: 5, backgroundColor: '#F1190A',
                        marginHorizontal: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
                    },]} onPress={() => { item.id }}>
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

                        <Text style={{fontFamily:FONTFAMILY,
                            alignSelf: 'center', fontWeight: "bold",
                            fontSize: 14,
                            color: 'white',
                            fontFamily: FONTFAMILY,
                            marginHorizontal: 12,
                            fontWeight: "500"

                        }}>{'Delete'}</Text>

                    </TouchableOpacity>

                    <TouchableOpacity style={[{
                        width: 125,
                        height: 44,
                        borderRadius: 5, backgroundColor: '#F1190A',
                        marginHorizontal: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
                    }, { backgroundColor: '#53045F', marginLeft: -5 }]} onPress={() => {
                        return
                        navigation.navigate('EditGoal', { id: item.id })
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

                        <Text style={{fontFamily:FONTFAMILY,
                            alignSelf: 'center', fontWeight: "bold",
                            fontSize: 14,
                            color: 'white',
                            fontFamily: "Roboto",
                            marginHorizontal: 12,
                            fontWeight: "500"

                        }}>{'Edit'}</Text>
                    </TouchableOpacity>
                </View>
            </View >
        )
    }


    return (<>
        <LinearGradient colors={['#300076', '#53045F']} style={{ flex: 1, padding: 5 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <HomeHeader2
                    height={60}
                    // paddingHorizontal={15}
                    title={'All Goals'}
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

                    <View style={{ marginTop: 10 }}>
                        <FlatList
                            horizontal={false}
                            data={goal}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={RenderItemLead}
                        // ListEmptyComponent={() => (
                        //     <View style={{
                        //         alignSelf: 'center', justifyContent: 'center', width: dimensions.SCREEN_WIDTH * 0.90, flex: 1,
                        //         alignItems: 'center', height: dimensions.SCREEN_HEIGHT * 0.60
                        //     }}>
                        //         <Nodata style={{ alignSelf: 'center' }} height={119} width={119}></Nodata>
                        //         <MyText text={'No data found !'} fontWeight='500' fontSize={24} textColor={Color.LIGHT_BLACK} fontFamily='Roboto' style={{ alignSelf: 'center', top: 4 }} />
                        //         <MyText text={'Oops! this information is not available for a moment'} fontWeight='400' fontSize={16} textColor={'#959FA6'} fontFamily='Roboto' style={{ alignSelf: 'center', textAlign: 'center', width: dimensions.SCREEN_WIDTH * 0.60, top: 4 }} />

                        //     </View>
                        // )}
                        />
                    </View>


                </ScrollView>
            </SafeAreaView>
            {loading && <SkeletonContainer/>}
        </LinearGradient>
        
        </>
    )
}

// export default GetGoalBackup