// WebViewScreen.js
import React from 'react';
import { StyleSheet, View, ActivityIndicator, SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { WebView } from 'react-native-webview';
import HomeHeader2 from '../../component/HomeHeader2';

const QuizWebViewModal = (props) => {

  const quiz_url = props.route.params?.quiz_url
  // const quiz_url = 'https://www.w3schools.com/'

  console.log({quiz_url});
  
  const handleNavigationStateChange = (navState) => {
    // setLoading(navState.loading);
    console.log('Current URL:', navState.url);

    if (navState.url == 'https://www.niletechinnovations.com/projects/plasmapen/blank') {
      props.navigation.goBack();
    }
  };

  return (
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
      <View style={styles.container}>
        <WebView
        onNavigationStateChange={handleNavigationStateChange}
          source={{ uri: quiz_url }}
          style={{ flex: 1 }}
          startInLoadingState={true}
          renderLoading={() => (
            <ActivityIndicator
              color='blue'
              size='large'
              style={styles.loading}
            />
          )}
          onLoadStart={()=>{
            console.log("start");
          }}
          onLoadEnd={()=>{
            console.log("end");
          }}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
});

export default QuizWebViewModal;
