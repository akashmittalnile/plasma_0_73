import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ImageBackground, SafeAreaView, StatusBar, ScrollView, TextInput, Keyboard, Alert, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Loader from '../../WebApi/Loader';
import HomeHeader from '../../component/HomeHeader';
import { dimensions } from '../../utility/Mycolors';
import { useSelector } from 'react-redux';
import { requestGetWithoutBody } from '../../WebApi/Service';
import NoDataFound from '../../component/NoDataFound';
import { StrikeThough } from '../../utility/FontStyles';
import { handleShare } from '../../component/ShareComponent';
import { addToWishlist } from '../../WebApi/GlobalAPICalls';
import useAPI from '../../utility/hooks/useAPI';
import { FONTFAMILY } from '../../utility/fonts';
const WishListBackup = (props) => {
  const user_details = useSelector(state => state.user.user_details);
  const { getCartList } = useAPI()
  const [loading, setLoading] = useState(false)
  const [flag, setFlag] = useState('http://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg')
  const [code, setcode] = useState('+1')
  const [My_Alert, setMy_Alert] = useState(false)
  const [alert_sms, setalert_sms] = useState('')
  const [select1, setselect1] = useState(false)
  const [data, setdata] = useState([])
  const [data2, setdata2] = useState([])

  const tabType = select1 ? 2 : 1

  const getWishList = async () => {

    setLoading(true);
    const { responseJson, err } = await requestGetWithoutBody(`wishlist?type=${tabType}`, user_details.access_token)

    console.log("ddddd",`wishlist?type=${tabType}`);

    setLoading(false);
    console.log('getWishList==>>', responseJson);
    if (err == null) {
      if (responseJson.status) {

        // setdata(responseJson.data);
        console.log("getWishList", responseJson.data);
        // select1 ? setdata2(JSON.parse(JSON.stringify(responseJson.data))) : setdata(JSON.parse(JSON.stringify(responseJson.data)))

        if (select1) {
          setdata2(JSON.parse(JSON.stringify(responseJson.data)))
        }else{
          setdata(JSON.parse(JSON.stringify(responseJson.data)))
        }

      } else {
        if (select1) {
          setdata2([])
        }else{
          setdata([])
        }
      }
    } else {
    }
  };

  useEffect(() => {
    getWishList()


    return () => {

    }
  }, [select1])



  return (
    <LinearGradient colors={['#300076', '#53045F']} style={{ flex: 1, }}>
      <SafeAreaView />
      <StatusBar />


      {/* ******************Header******************** */}
      <HomeHeader />
      {/* ******************Type******************** */}
      <View style={{ width: '95%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 25 }}>
        <TouchableOpacity style={{ width: '48%', paddingVertical: 12, borderRadius: 4, justifyContent: 'center', backgroundColor: select1 ? '#fff' : '#B357C3' }}
          onPress={() => { setselect1(false) }}>
          <Text style={{fontFamily:FONTFAMILY, color: select1 ? '#000' : '#fff', textAlign: 'center' }}>Course</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ width: '48%', paddingVertical: 12, borderRadius: 4, justifyContent: 'center', backgroundColor: select1 ? '#B357C3' : '#fff' }}
          onPress={() => { setselect1(true) }}>
          <Text style={{fontFamily:FONTFAMILY, color: select1 ? '#fff' : '#000', textAlign: 'center' }}>Product</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {/* ****************************Tranding flatlist****************** */}
        {!select1 ? (



          <View style={{ marginTop: 10, }}>

            {data.length === 0 ? <NoDataFound styles={{ marginTop: '20%' }} /> :
              <FlatList
                data={data}
                showsHorizontalScrollIndicator={false}
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
                          <TouchableOpacity onPress={async()=>{
                           await addToWishlist(object_id, 1, user_details?.access_token)
                            await getCartList()
                           await getWishList()
                          }} style={{ marginRight: 10 }}>
                            <Image style={{ height: 25, width: 25, tintColor: "#B357C3", }} source={require("../../assets/heartFilled.png")}></Image>

                          </TouchableOpacity>
                          <TouchableOpacity onPress={()=>{
                            handleShare(object_title)
                          }} style={{ marginRight: 10 }}>
                            <Image style={{ height: 25, width: 25, }} source={require("../../assets/ShareNetwork.png")}></Image>
                          </TouchableOpacity>
                        </View>

                      </ImageBackground>

                      <View style={{ width: '100%', backgroundColor: '#fff', borderBottomLeftRadius: 5, borderBottomRightRadius: 5, padding: 10 }}>
                        <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#000", padding: 5 }}>{object_title}</Text>

                        <View style={{ flexDirection: "row" }}>

                          <Text style={[{fontFamily:FONTFAMILY, fontSize: 14, color: "#B357C3", padding: 4, marginLeft: 2 }, StrikeThough]}>${object_price}</Text>
                          <Text style={{fontFamily:FONTFAMILY, fontSize: 14, color: "#B357C3", padding: 4, marginLeft: 2 }}>${object_price}</Text>

                          <View style={{ flexDirection: "row", padding: 4, marginLeft: 25 }}>
                            <Image style={{ height: 12, width: 12, marginTop: 1 }} source={require("../../assets/star.png")}></Image>
                            <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#000", }}> {object_rating}</Text>
                          </View>

                          <TouchableOpacity style={{ height: 23, width: 60, backgroundColor: "#fff", borderRadius: 4, justifyContent: "center", borderWidth: 1, borderColor: '#B357C3', marginLeft: 20 }}>
                            <Text style={{fontFamily:FONTFAMILY, fontSize: 12, color: "#B357C3", textAlign: "center" }}>{object_lesson_count} lesson</Text>
                          </TouchableOpacity>


                        </View>

                        <View style={{ flexDirection: 'row', }}>

                          <Image style={{ height: 28, width: 28, marginLeft: 5 }} source={require("../../assets/Rectangle103.png")}></Image>
                          <Text style={{fontFamily:FONTFAMILY, fontSize: 12, color: "grey", marginTop: 5, marginLeft: 10 }}> {object_user_enroll} enrolled</Text>

                        </View>

                      </View>

                    </TouchableOpacity>

                  )
                }}
                keyExtractor={(item, index) => String(index)}
              />}
          </View>


          //  {/* ****************************Tranding222222 flatlist****************** */}

        ) :
          <View style={{ marginTop: 10, }}>
            {data2.length === 0 ? <NoDataFound styles={{ marginTop: '20%' }} /> :
              <FlatList
                data={data2}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => {

                 const  { object_id,
                  object_title,
                  object_price,
                  object_user_enroll,
                  object_sale_price,
                  object_rating,
                  object_image } = item

                  return (
                    <TouchableOpacity onPress={()=>{
                      props.navigation.navigate('ProductDetails', { data: {id: object_id} })
                    }} style={{ width: dimensions.SCREEN_WIDTH * 95 / 100, marginTop: 12, alignSelf: 'center' }}>
                      <ImageBackground style={{ height: 150, width: '100%', borderTopLeftRadius: 7, borderTopRightRadius: 7, overflow: 'hidden' }} source={{uri: object_image ? object_image[0]?.image : ''}}>
                        <View style={{ flexDirection: "row", alignSelf: "flex-end", marginTop: 5 }}>
                          <TouchableOpacity onPress={async()=>{
                          await  addToWishlist(object_id,2,user_details.access_token)
                          await getWishList()

                          }} style={{ marginRight: 10 }}>
                            <Image style={{ height: 25, width: 25, tintColor: "#B357C3", }} source={require("../../assets/heartFilled.png")}></Image>

                          </TouchableOpacity>
                          <TouchableOpacity onPress={()=>{
                            handleShare(object_title)
                          }} style={{ marginRight: 10 }}>
                            <Image style={{ height: 25, width: 25, }} source={require("../../assets/ShareNetwork.png")}></Image>
                          </TouchableOpacity>
                        </View>

                      </ImageBackground>

                      <View style={{ width: '100%', backgroundColor: '#fff', borderBottomLeftRadius: 5, borderBottomRightRadius: 5, paddingBottom: 10, padding: 5 }}>
                        <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#000", padding: 5 }}>{object_title}</Text>

                        <View style={{ flexDirection: "row", }}>

                          <Text style={[{fontFamily:FONTFAMILY, fontSize: 14, color: "#B357C3", padding: 4, marginLeft: 2 }, StrikeThough]}>{object_price}</Text>
                          <Text style={{fontFamily:FONTFAMILY, fontSize: 14, color: "#B357C3", padding: 4, marginLeft: 2 }}>{object_sale_price}</Text>

                          <View style={{ flexDirection: "row", padding: 4, marginLeft: 25 }}>
                            <Image style={{ height: 12, width: 12, marginTop: 1 }} source={require("../../assets/star.png")}></Image>
                            <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#000", }}> {object_rating}</Text>
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
                keyExtractor={(item, index) => String(index)}
              />}
          </View>

        }



        {loading ?
          <Loader />
          : null
        }
        <View style={{ width: 50, height: 150 }} />
      </ScrollView>
    </LinearGradient>

  );
}
const styles = StyleSheet.create({


});
// export default WishListBackup