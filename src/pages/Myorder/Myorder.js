import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ImageBackground, SafeAreaView, StatusBar, ScrollView, TextInput, Keyboard, Alert, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Loader from '../../WebApi/Loader';
import HomeHeader from '../../component/HomeHeader';
import { dimensions } from '../../utility/Mycolors';
import MySearchBar from '../../component/MySearchBar';
import useAPI from '../../utility/hooks/useAPI';
import NoDataFound from '../../component/NoDataFound';
import HomeHeader2 from '../../component/HomeHeader2';
import { useIsFocused } from '@react-navigation/native';
import { FONTFAMILY } from '../../utility/fonts';

const Myorder = (props) => {
  // const [loading, setLoading] = useState(false)
  const [flag, setFlag] = useState('http://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg')
  const [code, setcode] = useState('+1')
  const [My_Alert, setMy_Alert] = useState(false)
  const [alert_sms, setalert_sms] = useState('')
  const [select1, setselect1] = useState(props?.isProduct ? true : false)
  const [data, setdata] = useState([])
  const [data2, setdata2] = useState([])

  const isProductORCourse = select1 ? 2 : 1

  const { getAPI, loading } = useAPI()
  const isFocussed = useIsFocused()

  async function getCourse() {



    const res = await getAPI({ endPoint: 'my-order?type=' + isProductORCourse })

    if (res) {

      // select1 ?  : 

      if (select1)
        setdata2((old) => res?.data)
      else
        setdata((old) => res?.data)

    }

  }


  useEffect(() => {
    console.log("props?.isProduct", props?.isProduct);

    getCourse()

  }, [select1])

  useEffect(() => {

    isFocussed && getCourse()

  }, [isFocussed])

  const showBackBtnHeader = props?.route?.params?.showBackBtnHeader ?? false
  return (
    <LinearGradient colors={['#300076', '#53045F']} style={{ flex: 1, }}>
      <SafeAreaView />
      <StatusBar />


      {/* ******************Header******************** */}
      {!showBackBtnHeader ? <HomeHeader />

        :
        <HomeHeader2
          height={60}
          // paddingHorizontal={15}
          title={'Certificate'}
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
      }
      {/* ******************Search******************** */}
      {/* <MySearchBar placeHolder={'Search by order number'} /> */}
      {/* ******************Type******************** */}
      <View style={{ width: '95%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 25 }}>
        <TouchableOpacity style={{ width: '48%', paddingVertical: 12, borderRadius: 4, justifyContent: 'center', backgroundColor: select1 ? '#fff' : '#B357C3' }}
          onPress={() => { setselect1(false) }}>
          <Text style={{ fontFamily: FONTFAMILY, color: select1 ? '#000' : '#fff', textAlign: 'center' }}>Course</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ width: '48%', paddingVertical: 12, borderRadius: 4, justifyContent: 'center', backgroundColor: select1 ? '#B357C3' : '#fff' }}
          onPress={() => { setselect1(true) }}>
          <Text style={{ fontFamily: FONTFAMILY, color: select1 ? '#fff' : '#000', textAlign: 'center' }}>Product</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {/* ****************************Tranding courde flatlist****************** */}
        {!select1 ?
          <View style={{ marginTop: 10, }}>
            <FlatList
              data={data}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => String(index)}
              renderItem={({ item }) => {

                let {
                  total_amount_paid,
                  order_date,
                  title,
                  sale_price,
                  lesson_count,
                  rating,
                  image


                } = item

                order_date = order_date?.split(" ")[0]

                return (
                  <TouchableOpacity onPress={() => { props.navigation.navigate('OrderDetails', { orderID: item?.id }) }} style={{ width: dimensions.SCREEN_WIDTH * 95 / 100, alignSelf: 'center', marginTop: 15, backgroundColor: '#fff', borderRadius: 7 }}>

                    <View style={{
                      width: '100%', backgroundColor: '#fff', flexDirection: "row", justifyContent: "space-between", padding: 10, borderRadius: 7, borderBottomColor: 'rgba(0,0,0,0.2)', borderBottomWidth: 0.5, alignItems: 'center'
                    }}>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontFamily: FONTFAMILY, fontSize: 13, color: "#000", }}>Order Date</Text>
                        <Text style={{ fontFamily: FONTFAMILY, fontSize: 13, color: "#B357C3", marginLeft: 5 }}>{order_date}</Text>

                      </View>
                      {/* <TouchableOpacity style={{ height: 30, backgroundColor: "#4556A6", borderRadius: 4, justifyContent: "center", paddingHorizontal: 10 }}>
                        <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#fff", }}>Start Over Again</Text>
                      </TouchableOpacity> */}
                    </View>


                    <View style={{ width: '100%', backgroundColor: '#FFFFFF', alignSelf: "center", marginTop: 10, borderBottomLeftRadius: 7, borderBottomRightRadius: 7 }}>
                      {/* <View style={{ flexDirection: "row", width: '25%', height: 20, backgroundColor: "#fff", borderRadius: 3, justifyContent: "center", marginBottom: 7, borderWidth: 1, borderColor: "#34A853", marginLeft: 10 }}>
                        <Image style={{ height: 14, width: 14, marginRight: 10, marginTop: 2 }} source={require("../../assets/tickcircle.png")}></Image>
                        <Text style={{fontFamily:FONTFAMILY, fontSize: 11, color: "#34A853", alignSelf: "center" }}>Completed</Text>
                      </View> */}

                      <View style={{ flexDirection: "row" }}>
                        <Image style={{ height: 80, width: dimensions.SCREEN_WIDTH * 30 / 100, marginLeft: 10, borderRadius: 7 }} source={{ uri: image }}></Image>
                        <View style={{ marginLeft: 10 }}>
                          <Text style={{ fontFamily: FONTFAMILY, fontSize: 13, color: "#000", }}>{title}</Text>

                          <View style={{ flexDirection: "row", marginTop: 8 }}>
                            <Text style={{ fontFamily: FONTFAMILY, fontSize: 13, color: "#B357C3", }}>$
                              {total_amount_paid}
                              {/* {total_amount_paid} */}

                            </Text>
                            <Image style={{ height: 10, width: 10, marginLeft: 15, marginTop: 2 }} source={require("../../assets/star.png")}></Image>
                            <Text style={{ fontFamily: FONTFAMILY, fontSize: 12, color: "#000", }}> {rating}</Text>
                          </View>
                          <TouchableOpacity style={{ height: 19, width: 55, backgroundColor: "#fff", borderRadius: 4, justifyContent: "center", borderWidth: 1, borderColor: '#B357C3', marginTop: 8 }}>
                            <Text style={{ fontFamily: FONTFAMILY, fontSize: 11, color: "#B357C3", textAlign: "center" }}>{lesson_count} lesson</Text>
                          </TouchableOpacity>

                        </View>

                      </View>
                      {/* <View style={{ flexDirection: 'row', margin: 10 }}>
                        <Text style={{fontFamily:FONTFAMILY, fontSize: 12, color: "#000", }}>Completed Course on:</Text>
                        <Text style={{fontFamily:FONTFAMILY, fontSize: 12, color: "#B357C3", marginLeft: 5 }}>26 jun /2023</Text>

                      </View> */}
                      <View style={{ width: '100%', height: 10 }} />
                    </View>

                    {/* <TouchableOpacity style={{ width: '100%', height: 45, backgroundColor: '#B357C3', justifyContent: 'center', borderBottomLeftRadius: 7, borderBottomRightRadius: 7 }}>
                      <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                        <Image style={{ height: 18, width: 18, tintColor: '#fff' }} source={require("../../assets/edit2.png")}></Image>
                        <Text style={{fontFamily:FONTFAMILY, fontSize: 14, color: "#fff", marginLeft: 10 }}>Write your review here</Text>

                      </View>
                    </TouchableOpacity> */}

                  </TouchableOpacity>

                )
              }}
              ListEmptyComponent={<NoDataFound styles={{ marginTop: '37%' }} />}
            />
          </View>
          //  {/* ****************************Tranding product flatlist****************** */}
          :

          <View style={{ marginTop: 10, }}>
            <FlatList
              data={data2}
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id}
              renderItem={({ item }) => {


                return <TouchableOpacity style={{ width: dimensions.SCREEN_WIDTH * 95 / 100, alignSelf: 'center', marginTop: 15, backgroundColor: '#fff', borderRadius: 7, paddingBottom: 12 }}
                  onPress={() => { props.navigation.navigate('OrderDetails', { orderID: item?.id }) }}>

                  <View style={{
                    width: '100%', backgroundColor: '#fff', flexDirection: "row", justifyContent: "space-between", padding: 10, borderRadius: 7, borderBottomColor: 'rgba(0,0,0,0.2)', borderBottomWidth: 0.5, alignItems: 'center'
                  }}>
                    <View style={{ flexDirection: 'row', backgroundColor: 'transparent' }}>
                      <Text style={{ fontFamily: FONTFAMILY, fontSize: 13, color: "#000", }}>Order ID:</Text>
                      <Text style={{ fontFamily: FONTFAMILY, fontSize: 13, color: "#B357C3", marginLeft: 5 }}>{item?.order_number}</Text>

                    </View>
                    <TouchableOpacity style={{ height: 30, backgroundColor: "transparent", borderRadius: 4, justifyContent: "center", paddingHorizontal: 10, borderColor: '#4556A6', borderWidth: 0.5 }}>
                      <Text style={{ fontFamily: FONTFAMILY, fontSize: 13, color: "#4556A6", }}>Paid</Text>
                      {/* <Text style={{ fontFamily: FONTFAMILY, fontSize: 13, color: "#4556A6", }}>Picked-up</Text> */}
                    </TouchableOpacity>
                  </View>


                  <View style={{ width: '100%', backgroundColor: '#FFFFFF', alignSelf: "center", marginTop: 10, borderBottomLeftRadius: 7, borderBottomRightRadius: 7 }}>

                    <View style={{ flexDirection: "row" }}>
                      <Image style={{ height: 80, width: dimensions.SCREEN_WIDTH * 30 / 100, marginLeft: 10, borderRadius: 7 }}
                        source={
                          // require("../../assets/Rectangle104.png")
                          { uri: item?.images[0]?.image }
                        }
                      ></Image>
                      <View style={{ marginLeft: 10 }}>
                        <Text style={{ fontFamily: FONTFAMILY, fontSize: 13, color: "#000", }}>{item?.title}</Text>

                        <View style={{ flexDirection: "row", marginTop: 8 }}>
                          <Text style={{ fontFamily: FONTFAMILY, fontSize: 13, color: "#B357C3", }}>${item?.total_amount_paid}</Text>
                          <Image style={{ height: 10, width: 10, marginLeft: 15, marginTop: 2 }} source={require("../../assets/star.png")}></Image>
                          <Text style={{ fontFamily: FONTFAMILY, fontSize: 12, color: "#000", }}> {item?.rating}</Text>
                        </View>

                        <Text style={{ fontFamily: FONTFAMILY, fontSize: 12, color: "#000", marginTop: 7 }}>{item?.order_date?.split(" ")[0]}</Text>

                      </View>

                    </View>

                  </View>

                  {/* <TouchableOpacity style={{ width: '100%', height: 45, backgroundColor: '#B357C3', justifyContent: 'center', borderBottomLeftRadius: 7, borderBottomRightRadius: 7, marginTop: 10 }}>
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                      <Image style={{ height: 18, width: 18, tintColor: '#fff' }} source={require("../../assets/edit2.png")}></Image>
                      <Text style={{fontFamily:FONTFAMILY, fontSize: 14, color: "#fff", marginLeft: 10 }}>Write your review here</Text>

                    </View>
                  </TouchableOpacity> */}

                </TouchableOpacity>
              }}
              ListEmptyComponent={<NoDataFound styles={{ marginTop: '37%' }} />}
            />
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
export default Myorder