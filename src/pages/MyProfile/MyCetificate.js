import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  Keyboard,
  Alert,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import LinearGradient from 'react-native-linear-gradient';
import Loader from '../../WebApi/Loader';
import HomeHeader from '../../component/HomeHeader';
import { dimensions } from '../../utility/Mycolors';
import HomeHeader2 from '../../component/HomeHeader2';
import { FONTFAMILY } from '../../utility/fonts';
import useAPI from '../../utility/hooks/useAPI';
import NoDataFound, { NoDataFoundModule } from '../../component/NoDataFound';
import { requestDownloadingPermission } from '../../utility/MyFunctions';

const MyCetificate = props => {
  const [loading, setLoading] = useState(false);
  const { getAPI, postAPI,  } = useAPI()
  const [flag, setFlag] = useState(
    'http://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg',
  );
  const [code, setcode] = useState('+1');
  const [My_Alert, setMy_Alert] = useState(false);
  const [alert_sms, setalert_sms] = useState('');
  const [select1, setselect1] = useState(false);

  const [data2, setdata2] = useState([]);

  function getCertificates() {
    setLoading(true)
    getAPI({ endPoint: 'certificates' }).then((res) => {
      setdata2(res?.data)
    }).catch(()=>{
      setLoading(false)
    }).finally(()=>{
      setLoading(false)
    })
  }

  useEffect(() => {
    getCertificates()
  }, []);

  // const requestDownloadingPermission = async (url) => {
  //   if (Platform.OS == 'ios') {
  //     downloadInvoice(url);
  //   } else {
  //     try {
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //         {
  //           title: 'Downloading Permission',
  //           message:
  //             'PlasmaPen needs access to your downloading manager ',
  //           buttonNeutral: 'Ask Me Later',
  //           buttonNegative: 'Cancel',
  //           buttonPositive: 'OK',
  //         },
  //       );
  //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //         downloadInvoice(url);
  //       } else {
  //         console.log('Download permission denied');
  //       }
  //     } catch (err) {
  //       console.warn(err);
  //     }
  //   }

  // };

  const downloadInvoice = async (url) => {
    // setShowLoader(true);
    setLoading(true)
    console.log('downloadInvoice', url);
    let pdfUrl = url
    let DownloadDir =
      Platform.OS == 'ios'
        ? RNFetchBlob.fs.dirs.DocumentDir
        : RNFetchBlob.fs.dirs.DownloadDir;
    const { dirs } = RNFetchBlob.fs;
    const dirToSave =
      Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
    const configfb = {
      fileCache: true,
      useDownloadManager: true,
      notification: true,
      mediaScannable: true,
      title: 'PlasmaPen',
      path: `${dirToSave}.pdf`,
    };
    console.log('here');
    const configOptions = Platform.select({
      ios: {
        fileCache: configfb.fileCache,
        title: configfb.title,
        path: configfb.path,
        appendExt: 'pdf',
      },
      android: configfb,
    });
    Platform.OS == 'android'
      ? RNFetchBlob.config({
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: `${DownloadDir}/.pdf`,
          description: 'Arkansas',
          title: `${orderData?.data?.order_number} invoice.pdf`,
          mime: 'application/pdf',
          mediaScannable: true,
        },
      })
        .fetch('GET', `${pdfUrl}`)
        .then(res => {
          // setShowLoader(false);
          console.log('The file saved to ', res);
          setLoading(false)
        })
        .catch(error => {
          // setShowLoader(false);
          console.error("downloadInvoice", error);
          setLoading(false)
        }).finally(() => {
          setLoading(false)
        })
      : RNFetchBlob.config(configOptions)
        .fetch('GET', `${pdfUrl}`, {})
        .then(res => {
          // setShowLoader(false);
          if (Platform.OS === 'ios') {
            RNFetchBlob.fs.writeFile(configfb.path, res.data, 'base64');
            RNFetchBlob.ios.previewDocument(configfb.path);
          }
          console.log('The file saved to ', res);
          setLoading(false)
        })
        .catch(e => {
          // setShowLoader(false);
          console.log('The file saved to ERROR', e.message);
          setLoading(false)
        }).finally(() => {
          setLoading(false)
        })

  };

  return (
    <LinearGradient colors={['#300076', '#53045F']} style={{ flex: 1 }}>
      <SafeAreaView />
      <StatusBar />

      {/* ******************Header******************** */}
      <HomeHeader2
        height={60}
        // paddingHorizontal={15}
        title={'My Certificates'}
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
            data={data2}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => {

              const { course_id,
                user_id,
                title,
                status,
                image,
                video,
                avg_rating,
                download_pdf } = item

              return (
                <TouchableOpacity key={index}
                  style={{
                    width: (dimensions.SCREEN_WIDTH * 95) / 100,
                    marginTop: 12,
                    alignSelf: 'center',
                  }}>
                  <ImageBackground
                    style={{
                      height: 150,
                      width: '100%',
                      borderTopLeftRadius: 7,
                      borderTopRightRadius: 7,
                      overflow: 'hidden',
                    }}
                    source={{ uri: image }}>

                  </ImageBackground>

                  <View
                    style={{
                      width: '100%',
                      backgroundColor: '#fff',
                      borderBottomLeftRadius: 5,
                      borderBottomRightRadius: 5,
                      paddingBottom: 10,
                      padding: 5,
                    }}>
                    <Text style={{ fontFamily: FONTFAMILY, fontSize: 14, color: '#000', padding: 5, fontWeight: '500' }}>
                      {title}
                    </Text>

                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>

                      <View
                        style={{
                          flexDirection: 'row',
                          padding: 4,
                          marginLeft: 5,
                        }}>
                        <Image
                          style={{ height: 12, width: 12, marginTop: 4 }}
                          source={require('../../assets/star.png')}></Image>
                        <Text style={{ fontFamily: FONTFAMILY, fontSize: 13, color: '#000', fontWeight: '400' }}>
                          {' '}
                          {avg_rating}
                        </Text>
                      </View>
                      {/* <View style={{ height: 25, width: 'auto', backgroundColor: "#fff", borderRadius: 4, justifyContent: "center", borderWidth: 1, borderColor: '#B357C3', marginLeft: 20, paddingHorizontal: 8 }}>
                        <Text style={{ fontFamily: FONTFAMILY, fontSize: 12, color: "#B357C3", textAlign: "center" }}>18 lessons</Text>
                      </View> */}
                    </View>

                    <View
                      style={{
                        width: '95%',
                        alignSelf: 'center',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          console.log(download_pdf);
                          props.navigation.navigate("DisclaimersPdf", { pdfData: download_pdf })
                        }}
                        style={{
                          width: '48%',
                          height: 40,
                          paddingVertical: 10,
                          borderRadius: 4,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#B357C3',
                          flexDirection: 'row'
                        }}>
                        <Image source={require('../../assets/white_eye.png')} style={{ height: 18, width: 18, alignSelf: "center", marginTop: 4 }} />
                        <Text style={{ fontFamily: FONTFAMILY, color: '#fff', textAlign: 'center', marginLeft: 10, fontWeight: '500' }}>
                          View
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                      onPress={()=>{
                        requestDownloadingPermission(download_pdf)
                      }}
                        style={{
                          width: '48%',
                          height: 40,
                          paddingVertical: 10,
                          borderRadius: 4,
                          justifyContent: 'center',
                          backgroundColor: '#4556A6',
                          alignItems: 'center',
                          flexDirection: 'row'
                        }}>
                        <Image source={require('../../assets/White_download_icon.png')} style={{ height: 18, width: 18, marginTop: 4 }} />
                        <Text style={{ fontFamily: FONTFAMILY, color: '#fff', textAlign: 'center', marginLeft: 10, fontWeight: '500' }}>
                          Download
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{ height: 10 }} />
                  </View>
                </TouchableOpacity>
              );
            }}
            keyExtractor={item => item.id}
            ListEmptyComponent={<View style={{ marginTop: '60%' }}><NoDataFoundModule /></View>}
          />
        </View>


        {loading ? <Loader /> : null}
        <View style={{ width: 50, height: 150 }} />
      </ScrollView>
    </LinearGradient >
  );
};
const styles = StyleSheet.create({

});

export default MyCetificate;
