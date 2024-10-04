import React, { useState, useEffect, useRef } from 'react';
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
    Keyboard, FlatList,
    TouchableOpacity, ImageBackground, Modal, PermissionsAndroid
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
import { add_cart, imgUrl, remove_cart, requestPostApi } from '../../WebApi/Service';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../../WebApi/Loader';
import Toast from 'react-native-simple-toast';
import MyAlert from '../../component/MyAlert';
import LinearGradient from 'react-native-linear-gradient';
// import Modal from 'react-native-modal';
import HomeHeader from '../../component/HomeHeader';
import HomeHeader2 from '../../component/HomeHeader2';
import { WebView } from 'react-native-webview';
import Video from 'react-native-video';
import VideoPlayer from '../../component/VideoPlayer';
import { StrikeThough } from '../../utility/FontStyles';
import ShareComponent, { handleShare } from '../../component/ShareComponent';
import { addToWishlist } from '../../WebApi/GlobalAPICalls';
import NewModal from 'react-native-modal';
import { launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import useAPI from '../../utility/hooks/useAPI';
import { FONTFAMILY } from '../../utility/fonts';


function AssignmentScreen(props) {

    const { postAPIForMedia, loading } = useAPI()
    const [images, setImages] = useState([]);
    const [documents, setDocuments] = useState([]);
    const selectDocuments = async () => {
        try {
            // const results = await DocumentPicker.pickMultiple({
            //     type: [DocumentPicker.types.allFiles],
            // });
            const results = await DocumentPicker.pick({
                allowMultiSelection: true, // Adjust based on new API
                type: [DocumentPicker.types.allFiles], // Adjust types as needed
            });
            setDocuments(results);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('User cancelled document picker');
            } else {
                console.error('DocumentPicker Error: ', err);
            }
        }
    };

    const { chapter_step_id, assignment_id } = props?.route?.params

    console.log(props?.route?.params);

    const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "App Camera Permission",
                    message: "App needs access to your camera ",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("Camera permission given");
                // opencamera()
            } else {
                console.log("Camera permission denied");
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const selectImages = () => {

        launchImageLibrary(
            {
                mediaType: 'photo',
                selectionLimit: 0, // 0 for unlimited selection
            },
            (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.errorMessage) {
                    console.log('ImagePicker Error: ', response.errorMessage);
                } else {
                    setImages(response.assets);
                }
            },
        );

    };

    const deleteDocument = (uri) => {
        setDocuments(documents.filter(doc => doc.uri !== uri));
    };

    const deleteImage = (uri) => {
        setImages(images.filter(image => image.uri !== uri));
    };


    const uploadDocuments = async () => {

        if (images?.length == 0 && documents?.length == 0) {
            Toast.show("At Least Select One Document !")
            return
        }

        const formData = new FormData();
        formData.append('chapter_step_id', chapter_step_id);
        formData.append('assignment_id', assignment_id);

        documents.forEach((doc, index) => {
            formData.append('file[]', {
                uri: doc.uri,
                type: doc.type,
                name: doc.name
            });
        });

        images.forEach((image) => {
            formData.append('file[]', {
                uri: image.uri,
                type: image.type,
                name: image.fileName
            });
        });
        console.log({ formData });
        console.log(images[0]);

        // return

        const res = await postAPIForMedia({ endPoint: 'upload-assignment', formData: formData })



        console.log('resresresres', { res });
        props.navigation.goBack();

    };


    return <>

        <LinearGradient colors={['#300076', '#53045F']} style={{ flex: 1 }}>
            <SafeAreaView />
            <HomeHeader2
                height={60}
                // paddingHorizontal={15}
                // title={'Course Details'}
                press1={() => {
                    // props.navigation.goBack();
                    props.navigation.goBack();
                }}
                img1={require('../../assets/arrow_right_black.png')}
                img1width={25}
                img1height={25}
                // press2={() => { props.navigation.navigate('Notification') }}
                // img2={require('../../assets/notification.png')}
                // img2width={25}
                // img2height={25}
                // press3={() => { }}
                // img3={require('../../assets/shoppingbag.png')}
                // img3width={25}
                // img3height={25}
                backgroundColor={'transparent'}
            />
            <ScrollView style={{ flex: 1, }}>
                <View style={{
                    backgroundColor: 'white', width: dimensions.SCREEN_WIDTH - 20,
                    // height: dimensions.SCREEN_HEIGHT * 0.3, 
                    alignSelf: 'center', borderRadius: 10, alignItems: 'center', paddingVertical: 20, paddingHorizontal: 10
                }}>

                    <Text style={{fontFamily:FONTFAMILY,
                        fontSize: 22,
                        color: 'black',

                    }}>
                        {"Upload your file"}
                    </Text>
                    <Text style={{fontFamily:FONTFAMILY,
                        fontSize: 14,
                        color: '#505667',
                        marginTop: 15
                    }}>
                        pdf, doc, xlsx
                    </Text>
                    {/* <Text style={{fontFamily:FONTFAMILY,
                        fontSize: 14,
                        color: '#505667',
                        marginTop: 15
                    }}>
                        Size: 5MB
                    </Text> */}


                    <View style={[{
                        width: '100%', height: 50, borderWidth: 0.3, borderColor: 'grey', borderRadius: 8, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', padding: 5,
                        marginTop: 15
                    }]}>

                        <TouchableOpacity onPress={() => { Platform.OS == 'ios' ? selectImages() : requestCameraPermission() }} style={{ width: '45%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ececec', borderRadius: 5, }}>
                            <Text style={{fontFamily:FONTFAMILY,
                                fontSize: 14,
                                color: '#505667'
                            }}>
                                Choose Image
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={selectDocuments} style={{ width: '45%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ececec', borderRadius: 5, }}>
                            <Text style={{fontFamily:FONTFAMILY,
                                fontSize: 14,
                                color: '#505667'
                            }}>
                                Choose File
                            </Text>
                        </TouchableOpacity>

                    </View>


                    {images?.map((item, index) => {

                        return (
                            <View style={[{
                                width: '100%', height: 50, borderWidth: 0.3, borderColor: 'grey', borderRadius: 8, flexDirection: 'row', alignItems: 'center', padding: 5,
                                marginTop: 15, justifyContent: 'space-between'
                            }]}>

                                <View style={{ width: '90%', height: '100%', justifyContent: 'flex-start', borderRadius: 5, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
                                    <Image
                                        source={{ uri: item.uri }}
                                        resizeMode="contain"
                                        style={{ width: 30, height: 30, marginRight: 5 }}
                                    // tintColor={'grey'}
                                    />
                                    <Text style={{fontFamily:FONTFAMILY,
                                        fontSize: 14,
                                        color: '#505667'
                                    }}> {item.fileName?.slice(0, 30)}</Text>
                                </View>
                                <TouchableOpacity onPress={() => deleteImage(item.uri)} style={{ height: '100%', backgroundColor: 'transparent', borderRadius: 5, justifyContent: 'center' }}>
                                    <Image
                                        source={require('../../assets/trash.png')}
                                        resizeMode="contain"
                                        style={{ width: 20, height: 20 }}
                                        tintColor={'red'}
                                    />
                                </TouchableOpacity>

                            </View>
                        )
                    })}

                    {documents?.map((item, index) => {

                        return (
                            <View style={[{
                                width: '100%', height: 50, borderWidth: 0.3, borderColor: 'grey', borderRadius: 8, flexDirection: 'row', alignItems: 'center', padding: 5,
                                marginTop: 15, justifyContent: 'space-between'
                            }]}>

                                <View style={{ width: '45%', height: '100%', justifyContent: 'flex-start', backgroundColor: 'transparent', borderRadius: 5, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
                                    <Image
                                        source={require('../../assets/FileText.png')}
                                        resizeMode="contain"
                                        style={{ width: 30, height: 30 }}
                                        tintColor={'grey'}
                                    />
                                    <Text style={{fontFamily:FONTFAMILY,
                                        fontSize: 14,
                                        color: '#505667'
                                    }}> {item.name}</Text>
                                </View>
                                <TouchableOpacity onPress={() => {
                                    deleteDocument(item.uri)
                                }} style={{ height: '100%', backgroundColor: 'transparent', borderRadius: 5, justifyContent: 'center' }}>
                                    <Image
                                        source={require('../../assets/trash.png')}
                                        resizeMode="contain"
                                        style={{ width: 20, height: 20 }}
                                        tintColor={'red'}
                                    />
                                </TouchableOpacity>

                            </View>
                        )
                    })}



                    {/* <View style={[{
                        width: '100%', height: 50, borderWidth: 0.3, borderColor: 'grey', borderRadius: 8, flexDirection: 'row', alignItems: 'center', padding: 5,
                        marginTop: 15, justifyContent: 'space-between'
                    }]}>

                        <View style={{ width: '45%', height: '100%', justifyContent: 'flex-start', backgroundColor: 'transparent', borderRadius: 5, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
                            <Image
                                source={require('../../assets/FileText.png')}
                                resizeMode="contain"
                                style={{ width: 30, height: 30 }}
                                tintColor={'grey'}
                            />
                            <Text style={{fontFamily:FONTFAMILY,
                                fontSize: 14,
                                color: '#505667'
                            }}> .jpg</Text>
                        </View>
                        <TouchableOpacity style={{ height: '100%', backgroundColor: 'transparent', borderRadius: 5, justifyContent: 'center' }}>
                            <Image
                                source={require('../../assets/trash.png')}
                                resizeMode="contain"
                                style={{ width: 20, height: 20 }}
                                tintColor={'red'}
                            />
                        </TouchableOpacity>

                    </View> */}

                </View>

                <TouchableOpacity onPress={() => {
                    uploadDocuments()
                }} style={{ width: '95%', height: 50, backgroundColor: '#A13BB6', justifyContent: 'center', alignItems: 'center', marginTop: 40, borderRadius: 10, alignSelf: 'center' }}>
                    <Text style={{fontFamily:FONTFAMILY,
                        fontSize: 15,
                        color: 'white'
                    }}>
                        Submit Assignment
                    </Text>
                </TouchableOpacity>


            </ScrollView>
            {loading && <Loader />}
        </LinearGradient>

    </>
}

export default AssignmentScreen

