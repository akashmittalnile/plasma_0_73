import React, { useEffect, useRef, useState } from 'react'
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import { dimensions, Mycolors } from '../utility/Mycolors'
import Video from 'react-native-video';
const VideoPlayer = (props) => {

  const myVideo = useRef(null)
  const [videoComponentKey, setVideoComponentKey] = useState(1)
  const [isPreloading, setIsPreloading] = useState(false)

  useEffect(() => {
    // console.log("props.file", myVideo.current?.seek(0));

    setVideoComponentKey((val) => (val + 1))


    return () => {

    }
  }, [props.file])


  return (
    <View
      style={[{
        width: dimensions.SCREEN_WIDTH - 20,
        height: 220,
        // backgroundColor: 'green',
        alignSelf: 'center',
        borderRadius: 10,
        overflow: 'hidden',
      }, props?.viewStyle]}>
      {isPreloading &&
        <ActivityIndicator
          animating
          color={"gray"}
          size="large"
          style={{ flex: 1, position: "absolute", top: "40%", left: "45%" }}
        />
      }
      <Video
        repeat={true}
        key={videoComponentKey}
        ref={myVideo}
        source={props?.localFile ?  props?.localFile : { uri: encodeURI(props.file) }}
        // source={require("./sample.mp4")}
        style={[{ width: '100%', height: 200, resizeMode: 'stretch', zIndex: 9999,  },props?.videoStyle]}

        controls={true}
        paused={props?.pus}
        resizeMode="stretch"

        onLoadStart={() => setIsPreloading(true)}
        // useNativeControls
        onReadyForDisplay={() => setIsPreloading(false)}
      />

    </View>
  )
}
export default VideoPlayer
