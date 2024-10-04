import React, { useEffect, useState } from 'react';
import { View,  Text, StyleSheet,Image,FlatList,ImageBackground, SafeAreaView,StatusBar, ScrollView,TextInput,Keyboard, Alert, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Loader from '../../WebApi/Loader';
import HomeHeader from '../../component/HomeHeader';
import { dimensions } from '../../utility/Mycolors';
import MySearchBar from '../../component/MySearchBar';
import HomeHeader2 from '../../component/HomeHeader2';
import { FONTFAMILY } from '../../utility/fonts';

const OrderHistory = (props) => {
  const [loading, setLoading] = useState(false)
  const [flag,setFlag]=useState('http://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg')
  const [code,setcode]=useState('+1')
  const [My_Alert, setMy_Alert] = useState(false)
  const [alert_sms, setalert_sms] = useState('')
  const [select1, setselect1] = useState(false)
  const [data, setdata] = useState([
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'First Item',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Second Item',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Third Item',
    },
  ])
  const [data2, setdata2] = useState([
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'First Item',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Second Item',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Third Item',
    },
  ])
useEffect(()=>{
  
}) 


  return (
    <LinearGradient colors={['#300076', '#53045F']} style={{flex: 1,}}>
    <SafeAreaView />
    <StatusBar />

    
      {/* ******************Header******************** */}
      <HomeHeader2
          height={60}
          // paddingHorizontal={15}
          title={'Order History'}
          press1={() => {
            props.navigation.goBack();
          }}
          img1={require('../../assets/arrow_right_black.png')}
          img1width={25}
          img1height={25}
          press2={() => {props.navigation.navigate('Notification')}}
          img2={require('../../assets/notification.png')}
          img2width={25}
          img2height={25}
          press3={() => {}}
          img3={require('../../assets/shoppingbag.png')}
          img3width={25}
          img3height={25}
          backgroundColor={'transparent'}
        />
 {/* ******************Search******************** */}
        <MySearchBar placeHolder={'Order History'}/>
    
        <ScrollView>         
 {/* ****************************Tranding flatlist****************** */}
 {!select1 ?
   <View style={{ marginTop: 10, }}>
          <FlatList
            data={data}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => {
              return (
                <View style={{ width: dimensions.SCREEN_WIDTH * 95 / 100,alignSelf:'center' ,marginTop:15,backgroundColor:'#fff',borderRadius:7}}>
                
                  <View style={{ width:'100%',backgroundColor:'#fff',flexDirection:"row",justifyContent:"space-between",padding:10,borderRadius:7,borderBottomColor:'rgba(0,0,0,0.2)',borderBottomWidth:0.5,alignItems:'center'
                  }}>
                    <View style={{flexDirection:'row'}}>
                      <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#000",  }}>Order number:</Text>
                      <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#B357C3",marginLeft:5 }}>#6574446</Text>
                
                    </View>
                    <TouchableOpacity style={{height:30,backgroundColor:"transparent",borderRadius:4,justifyContent:"center",paddingHorizontal:10}}>
                  <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "gray", }}>10h ago</Text>
                  </TouchableOpacity>
                  </View>
                

                    <View style={{width:'100%',backgroundColor:'#FFFFFF',alignSelf:"center",marginTop:10 }}>
                    <View style={{flexDirection:"row",height:20,backgroundColor:"#fff",borderRadius:3,justifyContent:"center",marginBottom:7,marginLeft:10,alignSelf:'flex-start'}}>
                 <Image style={{ height: 14, width: 14,marginRight:10,marginTop:2}} source={require("../../assets/tickcircle.png")}></Image>
                 <Text style={{fontFamily:FONTFAMILY, fontSize: 11, color: "#34A853",alignSelf:"center"  }}>Course Successfully Purchased!</Text>
                 </View>

                  <View style={{flexDirection:"row"}}>
                 <Image style={{ height: 80,  width: dimensions.SCREEN_WIDTH * 30 / 100,marginLeft:10,borderRadius:7}} source={require("../../assets/Rectangle104.png")}></Image>
                 <View style={{marginLeft:10}}>
                 <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#000", }}>CoolJet Starter Kit</Text>

                <View style={{flexDirection:"row",marginTop:8}}>
                 <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#B357C3", }}>$13.00</Text>
                 <Image style={{ height: 10, width: 10,marginLeft:15,marginTop:2 }} source={require("../../assets/star.png")}></Image>
               <Text style={{fontFamily:FONTFAMILY, fontSize: 12, color: "#000", }}> 4.7</Text>
               </View>
               <TouchableOpacity style={{ height: 19, width: 55, backgroundColor: "#fff", borderRadius: 4, justifyContent: "center", borderWidth: 1, borderColor: '#B357C3',marginTop:8}}>
                        <Text style={{fontFamily:FONTFAMILY, fontSize: 11, color: "#B357C3", textAlign: "center" }}>1 lesson</Text>
                      </TouchableOpacity>

                 </View>

                 </View>
                     
                    </View>
                   
               <TouchableOpacity style={{width:'100%',height:45,backgroundColor:'#B357C3',justifyContent: 'center',borderBottomLeftRadius:7,borderBottomRightRadius:7,marginTop:10}}>
                    <View style={{flexDirection:'row',alignSelf:'center'}}>
                    <Image style={{ height: 18, width: 18,tintColor:'#fff' }} source={require("../../assets/White_download_icon.png")}></Image>
                    <Text style={{fontFamily:FONTFAMILY, fontSize: 14, color: "#fff",marginLeft:10 }}>Download Payment Invoice</Text>
            
                    </View>
               </TouchableOpacity>

                </View>

              )
            }}
            keyExtractor={item => item.id}
          />
        </View>
//  {/* ****************************Tranding222222 flatlist****************** */}
:
<View style={{ width: dimensions.SCREEN_WIDTH * 95 / 100,alignSelf:'center' ,marginTop:15,backgroundColor:'#fff',borderRadius:7}}>
                
<View style={{ width:'100%',backgroundColor:'#fff',flexDirection:"row",justifyContent:"space-between",padding:10,borderRadius:7,borderBottomColor:'rgba(0,0,0,0.2)',borderBottomWidth:0.5,alignItems:'center'
}}>
  <View style={{flexDirection:'row'}}>
    <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#000",  }}>Order ID:</Text>
    <Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#B357C3",marginLeft:5 }}>HBD89467673364767</Text>

  </View>
  <TouchableOpacity style={{height:30,backgroundColor:"transparent",borderRadius:4,justifyContent:"center",paddingHorizontal:10,borderColor:'#4556A6',borderWidth:0.5}}>
<Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#4556A6", }}>Picked-up</Text>
</TouchableOpacity>
</View>


  <View style={{width:'100%',backgroundColor:'#FFFFFF',alignSelf:"center",marginTop:10 }}>
 
<View style={{flexDirection:"row"}}>
<Image style={{ height: 80,  width: dimensions.SCREEN_WIDTH * 30 / 100,marginLeft:10,borderRadius:7}} source={require("../../assets/Rectangle104.png")}></Image>
<View style={{marginLeft:10}}>
<Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#000", }}>CoolJet Starter Kit</Text>

<View style={{flexDirection:"row",marginTop:8}}>
<Text style={{fontFamily:FONTFAMILY, fontSize: 13, color: "#B357C3", }}>$13.00</Text>
<Image style={{ height: 10, width: 10,marginLeft:15,marginTop:2 }} source={require("../../assets/star.png")}></Image>
<Text style={{fontFamily:FONTFAMILY, fontSize: 12, color: "#000", }}> 4.7</Text>
</View>
    
<Text style={{fontFamily:FONTFAMILY, fontSize: 12, color: "#000",marginTop:5  }}>26 jun /2023</Text>

</View>

</View>
   
  </View>
 
<TouchableOpacity style={{width:'100%',height:45,backgroundColor:'#B357C3',justifyContent: 'center',borderBottomLeftRadius:7,borderBottomRightRadius:7,marginTop:10}}>
  <View style={{flexDirection:'row',alignSelf:'center'}}>
  <Image style={{ height: 18, width: 18,tintColor:'#fff' }} source={require("../../assets/edit2.png")}></Image>
  <Text style={{fontFamily:FONTFAMILY, fontSize: 14, color: "#fff",marginLeft:10 }}>Write your review here</Text>

  </View>
</TouchableOpacity>

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
export default OrderHistory