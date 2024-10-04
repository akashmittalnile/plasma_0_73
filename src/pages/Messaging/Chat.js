import React, { useCallback, useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput, Alert, PermissionsAndroid, Platform, FlatList, KeyboardAvoidingView } from 'react-native';
import { dimensions, Mycolors } from '../../utility/Mycolors';
import LinearGradient from 'react-native-linear-gradient';
import { nanoid } from '@reduxjs/toolkit'
import { firebase } from '@react-native-firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import useAPI from '../../utility/hooks/useAPI';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import ChatSection from './ChatSection';
import useHideBottomTab from '../../utility/hooks/useHideBottomTab';
import moment from 'moment';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';
import Loader from '../../WebApi/Loader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FONTFAMILY } from '../../utility/fonts';



const Chat = (props) => {

  const dispatch = useDispatch();
  const flatlistRef = React.useRef(null);
  const [chat, setChat] = React.useState('');
  const [file, setFile] = React.useState(undefined);
  const [ok, setOk] = React.useState(false);
  const [chatArray, setChatArray] = useState([
    //   {
    //   text: "",
    //   createdAt: "",
    //   senderId: '',
    //   _id: "",
    // }
  ]);
  const [selectedImage, setselectedImage] = useState(null)


  const userdetails = useSelector(state => state.user.user_details);
  const access_token = userdetails.access_token

  const { getAPI, loading, postAPI, controlLoader } = useAPI()

  async function seen_message() {
    const res = await postAPI({ endPoint: 'seen-message', toastEnable: false, loaderOn: false })
    console.log("seen-message", { res });
  }

  React.useEffect(() => {
    setOk(true);
    // seenMessageHandler();

    seen_message()
  }, []);


  // console.log({ userdetails: userdetails });

  // useHideBottomTab()

  async function chat_record(msg) {
    const res = await postAPI({
      endPoint: 'chat-record', toastEnable: false, bodyJSON: {
        msg: msg
      },
      loaderOn: false
    })
    // setselectedImage(null)
    // controlLoader(false)
    console.log("chat_record", { msg });
    if (res) {
      console.log({ res });
    }
  }

  useEffect(() => {
    let unsubscribe
    const fetchData = async () => {
      unsubscribe = await chatSnapshot();

      console.log({ unsubscribe });
    };
    fetchData();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);


  const chatSnapshot = async () => {
    try {

      console.log("satrt");

      const unsubscribe = firebase
        ?.firestore()
        .collection('plasmapen_chats')
        .doc(`1-${userdetails?.user?.id}`)

        .collection('messages')
        ?.orderBy('createdAt', 'desc')
        ?.onSnapshot((snapshot) => {

          console.log({ snapshot: snapshot?._docs });
          // return

          if (!ok) {
            getChatData(snapshot?._docs);
          } else {
            setChatArray((preData) => [
              {
                createdAt: timeHandler(snapshot?._docs[0]?._data?.createdAt),
                senderId: snapshot?._docs[0]?._data?.sendBy,
                text: snapshot?._docs[0]?._data?.text,
                _id: snapshot?._docs[0]?._data?._id,
                imageUrl: snapshot?._docs?.[0]?._data?.imageUrl,
              },
              ...preData,
            ]);
            setChat('');
            flatlistRef?.current?.scrollToEnd();
          }
        });
      return unsubscribe;
    } catch (err) {
      console.log('err in chat snapshot', err?.message);
    }
  };

  const timeHandler = (timestamp) => {
    if (timestamp) {
      const milliseconds =
        timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
      const date = new Date(milliseconds);
      const _temp = date.toLocaleString()?.split(',')[1]?.trim()?.split(':');
      const trimTemp = [..._temp[2]?.trim()];
      const period =
        trimTemp[trimTemp?.length - 2] + trimTemp[trimTemp?.length - 1];
      const time = `${_temp[0]}:${_temp[1]} ${period}`;
      return `${moment(date).format('MMM D, YYYY')} ${time}`;
    }
    return '';
  };

  const getChatData = async (data) => {
    if (data?.length === 0) {
      return;
    }
    try {
      const arr = data?.map((item) => {
        const time = timeHandler(item?._data?.createdAt);
        return {
          text: item?._data?.text,
          createdAt: time,
          senderId: item?._data?.sendBy,
          _id: item?._data?._id,
          imageUrl: item?._data?.imageUrl,
        };
      });
      if (arr?.length > 0) {
        setChatArray(arr);
      }
    } catch (err) {
      console.log('err in getting chat', err);
    }
  };

  const chatHandler = (chat) => {
    setChat(chat);
  };



  const selectImage = () => {
    launchImageLibrary({}, (response) => {
      if (response.assets) {
        // sendChatHandler(response.assets[0]); // Pass the selected image to the handler
        setselectedImage(response.assets[0])
      }
    });
  };



  const sendChatHandler = async () => {
    selectedImage && controlLoader(true)
    const msg = chat;
    const messageId = nanoid();
    try {
      setChat('');
      const sendMsgForAPI = selectedImage ? "Sent an attachment" : msg
      // Step 2.1: Upload the attachment if selected
      let imageUrl = null;
      if (selectedImage) {
        const storageRef = storage().ref(`attachments/${messageId}`);
        await storageRef.putFile(selectedImage.uri);
        imageUrl = await storageRef.getDownloadURL();
      }


      // Step 2.2: Send the message with or without the attachment
      await firebase
        ?.firestore()
        .collection('plasmapen_chats')
        .doc(`1-${userdetails?.user?.id}`)
        ?.collection('messages')
        .add({
          text: msg,
          // image: image,
          imageUrl: imageUrl,  // Add the image URL here if exists
          sendBy: userdetails?.user?.id,
          sendTo: 1,
          adminName: 'plasmapenAdmin',
          userName: userdetails?.user?.first_name,
          user: {
            _id: userdetails?.user?.id,
          },
          _id: messageId,
          createdAt: new Date(),
        });


      setselectedImage(null)
      controlLoader(false)
      await chat_record(sendMsgForAPI)

    } catch (err) {
      console.log('err in sending text', err?.message);
    }
  };


  const renderChat = ({ item, index }) => {
    console.log("renderChat", item?.imageUrl);
    return (
      <ChatSection
        key={index}
        userName={
          item?.senderId == userdetails?.user?.id
            ? userdetails?.user?.first_name
              ? userdetails?.user?.first_name
              : 'You'
            : 'Admin'
        }
        // chat={item?.imageUrl}
        chat={item?.text}
        own={item?.senderId == userdetails?.user?.id ? true : false}
        time={item?.createdAt}
        imageUrl={item?.imageUrl}
      />
    );
  };




  return (
    <LinearGradient colors={['#300076', '#53045F']} style={{ flex: 1 }}>
      <SafeAreaView style={{}} />

      {/* ******** Header ********** */}

      <View style={{
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, justifyContent: 'space-between',
        width: '100%', height: 55,
      }}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={{ marginTop: 7 }} onPress={() => { props.navigation.goBack() }}>
            <Image source={Mycolors.BG_COLOR == '#fff' ? require('../../assets/arrow_right_black.png') : require('../../assets/arrow_right_black.png')} style={{ width: 24, height: 16, alignSelf: 'center' }}></Image>
          </TouchableOpacity>
          <View style={{ width: 35, height: 35, borderRadius: 15, marginHorizontal: 10, borderRadius: 15 }}>
            <Image source={require('../../assets/Frame6353.png')} style={{ width: 35, height: 35, alignSelf: 'center', borderRadius: 15 }}></Image>
          </View>
          <View>
            <Text style={{fontFamily:FONTFAMILY, color: '#fff', fontWeight: 'bold', fontSize: 11 }}>Hi</Text>
            <Text style={{fontFamily:FONTFAMILY, color: '#DF81EF', fontWeight: 'bold', marginTop: 3, fontSize: 15 }}>Admin</Text>
          </View>
        </View>
        {/* <View style={{ flexDirection: 'row' }}>
          <Image source={require('../../assets/notification.png')} style={{ width: 25, height: 25, alignSelf: 'center', marginRight: 8 }}></Image>
          <Image source={require('../../assets/shoppingbag.png')} style={{ width: 25, height: 25, alignSelf: 'center', tintColor: '#fff' }}></Image>
        </View> */}

      </View>


      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          keyboardShouldPersistTaps="always"
          bounces={false}
          scrollEnabled={chatArray?.length === 0 ? false : true}>
          <View style={styles.chatContainer}>
            {chatArray?.length > 0 ? (
              <FlatList
                keyboardShouldPersistTaps="always"
                inverted={true}
                ref={flatlistRef}
                data={chatArray}
                renderItem={renderChat}
                keyExtractor={(_, index) => index.toString()}
                bounces={false}
                contentContainerStyle={styles.flatlist}
                getItemLayout={(data, index) => ({
                  length: 0,
                  offset: 0 * index,
                  index,
                })}
              />
            ) : (
              <View style={styles.noChatContainer}>

                <Text
                  style={{
                    fontSize: responsiveFontSize(3),
                    textAlign: 'center',
                    color: 'white',
                  }}>
                  No messages yet
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.sendMessageContainer}>
          <View style={styles.textInputContainer}>
            <TextInput
              value={selectedImage ? selectedImage?.fileName.slice(0, 15) + "." + selectedImage?.type.split("/")[1] : chat}
              style={styles.textInput}
              onChangeText={chatHandler}
              placeholder="Type message"
              placeholderTextColor="gray"
              editable={selectedImage == null}
            />
            <TouchableOpacity style={styles.touch} onPress={() => {
              selectImage()
            }
            }>
              {selectedImage && <TouchableOpacity onPress={() => {
                setselectedImage(null)
              }} style={{
                position: 'absolute', right: -4, top: -5, padding: 2, backgroundColor: 'white', borderRadius: 50, shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,

                elevation: 5,
              }}>
                <Image style={{ width: 20, height: 20, }} tintColor={"#A13BB6"} source={require('../../assets/crossed.png')}></Image>
              </TouchableOpacity>}
              <Image
                source={selectedImage ? { uri: selectedImage?.uri } : require('./attached.png')}
                resizeMode="contain"
                style={styles.attachedFiles}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.sendButtonContainer}>
            <TouchableOpacity
              onPress={() => {
                console.log({ selectedImage });
                // return
                sendChatHandler(null)
              }}
              style={{
                ...styles.sendButtonTouch,
                backgroundColor:
                  (chat.length > 0 || selectedImage != null)
                    ? Mycolors?.Purple
                    : "grey",
              }}
              disabled={!(chat.length > 0 || selectedImage != null)}>
              <Image
                source={require('./send.png')}
                resizeMode="contain"
                style={styles.sendIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>



      {loading && <Loader />}


    </LinearGradient>
  );
}
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: Mycolors.DrawerBGcolor
  },
  input: {
    paddingHorizontal: 10,
    fontSize: 13,
    borderColor: Mycolors.GrayColor,
    backgroundColor: Mycolors.DrawerBGcolor,
    borderRadius: 8,
    color: Mycolors.TEXT_COLOR,
  },

  headerContainer: {
    position: 'relative',
    height: responsiveHeight(18),
    backgroundColor: "blue",
    borderWidth: 1,
  },
  chatImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
  },
  text: {
    marginTop: responsiveHeight(5),
    width: '100%',
    color: 'white',
    textAlign: 'center',
    fontSize: responsiveFontSize(2),
    fontWeight: '400',
    opacity: 0.7,
  },
  chatContainer: {
    height: responsiveHeight(75),
  },
  flatlist: {
    paddingBottom: responsiveHeight(2),
  },
  sendMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: responsiveHeight(3),
    paddingHorizontal: '3%',
    height: responsiveHeight(8),
  },
  textInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: responsiveHeight(6.5),
    width: responsiveWidth(77),
    borderRadius: responsiveHeight(5),
    elevation: 2,
    shadowColor: 'rgba(137, 137, 137, .25)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    backgroundColor: 'white',
  },
  textInput: {
    flex: 1,
    height: '100%',
    width: '80%',
    paddingHorizontal: '5%',
    fontSize: responsiveFontSize(1.8),
    letterSpacing: 0.8,
    color: 'black',
  },
  touch: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingRight: responsiveWidth(4),
  },
  attachedFiles: {
    height: responsiveHeight(3),
    width: responsiveWidth(6),
  },
  sendButtonContainer: {
    height: responsiveHeight(5),
    width: responsiveHeight(5),
    borderRadius: responsiveHeight(2.5),
    overflow: 'hidden',
  },
  sendButtonTouch: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  sendIcon: {
    height: responsiveHeight(2),
    width: responsiveWidth(5),
  },
  noChatContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default Chat