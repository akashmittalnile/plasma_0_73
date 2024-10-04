import { View, Text, TouchableOpacity, Image, Share, Alert } from 'react-native'
import React from 'react'

export const handleShare = async (title = '') => {
    try {
      const result = await Share.share({
        message:
          title,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  }

export default function ShareComponent({ title = '', imgStyle={} }) {

    
  
    return <TouchableOpacity onPress={() => handleShare(title)} style={{ marginRight: 10 }}>
      <Image style={[{ height: 25, width: 25, }, imgStyle]} source={require("../assets/ShareNetwork.png")}></Image>
    </TouchableOpacity>
  }