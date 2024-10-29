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
  TouchableOpacity, FlatList, ImageBackground,
  Linking,
  PermissionsAndroid,
  Platform
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
import TextInputArea2 from '../../component/TextInputArea2';
import MySearchBar from '../../component/MySearchBar';
import useAPI from '../../utility/hooks/useAPI';
import Pdf from 'react-native-pdf';
import RNFetchBlob from 'rn-fetch-blob';
import { FONTFAMILY } from '../../utility/fonts';
import { requestDownloadingPermission } from '../../utility/MyFunctions';
import NoDataFound from '../../component/NoDataFound';

const DocumentList = (props) => {

  const { getAPI, loading } = useAPI()
  const [data, setdata] = useState([])

  const downloadInvoice = async (index) => {
    // setShowLoader(true);
    console.log('downloadInvoice', data?.[index]);
    let pdfUrl = data?.[index]?.file;
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
          description: 'PlasmaPen',
          title: `${data?.[index]?.name} invoice.pdf`,
          mime: 'application/pdf',
          mediaScannable: true,
        },
      })
        .fetch('GET', `${pdfUrl}`)
        .then(res => {
          // setShowLoader(false);
          console.log('The file saved to ', res);
        })
        .catch(error => {
          // setShowLoader(false);
          console.warn(error.message);
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
        })
        .catch(e => {
          // setShowLoader(false);
          console.log('The file saved to ERROR', e.message);
        });

  };

  // const requestDownloadingPermission = async (index) => {
  //     if (Platform.OS == 'ios') {
  //       downloadInvoice(index);
  //     } else {
  //       try {
  //         const granted = await PermissionsAndroid.request(
  //           PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //           {
  //             title: 'Downloading Permission',
  //             message:
  //               'PlasmaPen needs access to your downloading manager ',
  //             buttonNeutral: 'Ask Me Later',
  //             buttonNegative: 'Cancel',
  //             buttonPositive: 'OK',
  //           },
  //         );
  //         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //           downloadInvoice(index);
  //         } else {
  //           console.log('Camera permission denied');
  //         }
  //       } catch (err) {
  //         console.warn(err);
  //       }
  //     }

  //   };

  const getDocuments = async (search='') => {
    const res = await getAPI({ endPoint: "documents?search=" + search })

    if (res) {
      setdata(res?.data)
    }
  }

  useEffect(() => {

    getDocuments()

    return () => {

    }
  }, [])


  return (
    <LinearGradient colors={['#300076', '#53045F']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <HomeHeader2
          height={60}
          // paddingHorizontal={15}
          title={'Documents'}
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
        <MySearchBar placeHolder={'Documents'} onSearchSubmit={(text) => { 
          getDocuments(text)
        }} />
        <View style={{ marginTop: 10, }}>
          <FlatList

            data={data}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => {
              const { id,
                name,
                file,
                category_name,
                category_image,
                created_at, thumbnail } = item
              return (
                <View style={{ marginTop: 20, width: dimensions.SCREEN_WIDTH, paddingHorizontal: 10 }}>
                  <View style={{ width: '100%', alignItems: 'center', backgroundColor: 'white', height: 370, justifyContent: 'space-evenly', }}>
                    <View style={{ width: '100%', overflow: 'hidden', height: 250 }}>
                      {/* <Pdf */}
                      <Image
                      source={{uri:thumbnail}}
                      resizeMode='cover'
                        // scrollEnabled={false}
                        // source={{ uri: file }}
                        // onLoadComplete={(numberOfPages, filePath) => {
                        //   console.log(`Number of pages: ${numberOfPages}`);
                        // }}
                        // onPageChanged={(page, numberOfPages) => {
                        //   console.log(`Current page: ${page}`);
                        // }}
                        // onError={(error) => {
                        //   console.log(error);
                        // }}
                        style={{
                          width: '100%',
                          height: 400,
                          backgroundColor: 'white',
                        }}
                      />
                    </View>
                    <Text style={{ fontFamily: FONTFAMILY, fontSize: 20, color: '#4556A6', marginTop: 7 }}>{name}</Text>
                    <TouchableOpacity onPress={() => {
                      // Linking.openURL(file)
                      requestDownloadingPermission(data?.[index]?.file)
                    }}
                      style={{
                        width: '48%',
                        height: 40,
                        // paddingVertical: 10,
                        borderRadius: 500,
                        justifyContent: 'center',
                        // backgroundColor: '#4556A6',
                        backgroundColor: '#B357C3',
                        alignItems: 'center',
                        flexDirection: 'row'
                      }}>
                      <Image source={require('../../assets/White_download_icon.png')} style={{ height: 18, width: 18, marginTop: 4 }} />
                      <Text style={{ fontFamily: FONTFAMILY, color: '#fff', textAlign: 'center', marginLeft: 10, fontWeight: '500' }}>
                        Download
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

              )
            }}
            keyExtractor={item => item.id}
            ListFooterComponent={<View style={{ width: 200, height: 200 }} />}
            ListEmptyComponent={<NoDataFound styles={{marginTop: '32%'}}/>}
          />
        </View>

        {loading ? <Loader /> : null}
      </SafeAreaView>
    </LinearGradient>
  )
}

export default DocumentList

