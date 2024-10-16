import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState, useRef } from 'react';
import { View, useColorScheme, } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
// import * as types  from '../redux/types';
// export const baseUrl = 'https://www.niletechinnovations.com/projects/plasmapen/api/'

export const baseUrl = 'https://app.plasmapen.com/api/'

export const imgUrl = 'https://www.niletechinnovations.com/upload/'

//API END POINT LISTS  

export const register = 'register'
export const login = 'login'
export const forgotpass = 'forgot-password'
export const otp_verfication = `otp-verfication`;
export const reset_password = `reset-password`;
export const profile = `profile`;
export const update_profile = `update-profile`;
export const change_password = `change-password`;
export const courses = `courses`;
export const course_details = `course-details/`;
export const submit_rating = `submit-rating`;
export const products = 'products';
export const product_details = 'product-details/';
export const course_category = 'course-category';
export const home = 'home';
export const add_cart = 'add-cart';
export const remove_cart = 'remove-cart';
export const update_product_quantity = "update-product-quantity";
export const cart_list = "cart-list";
export const coupon_applied = "coupon-applied";
export const remove_applied_coupon = "remove-applied-coupon";
export const follow_unfollow = "follow-unfollow";

export const cartItemType = {
  course: 1,
  product: 2
}


export const requestPostApi = async (endPoint, body, method, token, myHeaderForJSON = false) => {
  console.log('the token is :-', token)
  var header = {}
  if (token != '' && token != undefined) {
    header = { 'Content-Type': 'multipart/form-data', 'Accept': 'application/json', 'Authorization': 'Bearer ' + token, 'Cache-Control': 'no-cache' }
  } else {
    header = { 'Accept': 'application/x-www-form-urlencoded' }
  }

  if (myHeaderForJSON) {
    header = { "Content-Type": "application/json", 'Accept': 'application/json', 'Authorization': 'Bearer ' + token, 'Cache-Control': 'no-cache' }
  }

  console.log({ method });
  var url = baseUrl + endPoint
  console.log('post Request Url:-' + url + '\n')
  console.log({body})
  // console.log(header + '\n')
  let init

  if (body) {
    console.log("if (body) ");
    
    init = {
      method: method,
      body: body,
      headers: header,
    }
  }else{
    console.log("else (body) ");
    init = {
      method: method,
      headers: header
    }
  }

  try {
    let response = await fetch(url, init)
    let code = await response.status
    //let responseJ = await response.json();
    console.log('the api responce is', code)
    //  console.log("response.text()",response.text());
    if (code == 200) {
      let responseJson = await response.json();
      console.log(responseJson)
      return { responseJson: responseJson, err: null }
    } else if (code == 400 || code == 402) {
      let responseJson = await response.json();
      //Completion block 
      return { responseJson: null, err: responseJson.message }
    } else {
      // let responson = await response.json();
      // console.log(responson)
      return { responseJson: null, err: 'Something went wrong!' }
    }
  } catch (error) {
    console.error('the error is', 'requestPostApi',
      { endPoint }, error)
    return { responseJson: null, err: 'Something Went Wrong! Please check your internet connection.' }
    // return {responseJson:null,err:error}
  }
}

export const requestGetWithoutBody = async (endPoint, token, body = {}) => {
  console.log('the token is :-', token)
  var header = { 'Accept': 'application/json', 'Authorization': 'Bearer ' + token }

  if (!token) {
    header = { 'Accept': 'application/json' }
  }
  var url = baseUrl + endPoint


  //url = url + objToQueryString(body)
  console.log('Request Url:-' + url + '\n')
  try {
    let response = await fetch(url, {
      method: 'GET',
      headers: header,

    }
    )
    let code = await response.status
    console.log(code)
    if (code == 200) {
      let responseJson = await response.json();
      console.log('Code 200==>>', responseJson)
      return { responseJson: responseJson, err: null, code: code }
    } else if (code == 400) {
      return { responseJson: null, err: responseJson.message, code: code }

    } else if (code == 500) {
      console.log(response)

      return { responseJson: null, err: 'Something Went Wrong', code: code }

    } else {
      console.log(response)

      return { responseJson: null, err: 'Something went wrong!', code: code }
    }
  } catch (error) {
    console.error(error);
    return { responseJson: null, err: 'Something Went Wrong! Please check your internet connection.', code: 500 }

  }
}

export const requestGetApi = async (endPoint, body, method, token) => {
  console.log('the token is :-', token)
  var header = {}
  var url = baseUrl + endPoint

  if (token != '' && token != undefined) {
    header = { 'Content-Type': 'multipart/form-data', 'Accept': 'application/json', 'Authorization': 'Bearer ' + token, 'Cache-Control': 'no-cache' }
  } else {
    header = {}
  }

  //url = url + objToQueryString(body)
  console.log('Request Url:-' + url + '\n')
  try {
    let response = await fetch(url, {
      method: method,
      headers: header,
    }
    )
    let code = await response.status
    console.log(code)
    if (code == 200) {
      let responseJson = await response.json();
      console.log('Code 200==>>', responseJson)
      return { responseJson: responseJson, err: null, code: code }
    } else if (code == 400) {
      let responseJson = await response.json();
      return { responseJson: null, err: responseJson.message, code: code }

    } else if (code == 500) {
      console.log(response)

      return { responseJson: null, err: 'Something Went Wrong', code: code }

    } else {
      console.log(response)

      return { responseJson: null, err: 'Something went wrong!', code: code }
    }
  } catch (error) {
    console.error(error);
    return { responseJson: null, err: 'Something Went Wrong! Please check your internet connection.', code: 500 }

  }
}

export const requestPostApiMedia = async (endPoint, formData, method, token) => {
  var header = {}

  if (token != '' && token != undefined) {
    header = {
      'Content-type': 'multipart/form-data', 'apitoken': token, 'Cache-Control': 'no-cache'
    }
  } else {
    if (endPoint != signUpApi) {
      header = {
        'Content-type': 'multipart/form-data', 'Cache-Control': 'no-cache'
      }
    }
  }

  var url = baseUrl + endPoint
  console.log('Request Url:-' + url + '\n')
  console.log(formData + '\n')

  try {
    let response = await fetch(url, {
      method: method,
      body: formData,

      headers: header,

    }
    )

    let code = await response.status
    console.log(code)

    if (code == 200) {
      let responseJson = await response.json();
      console.log(responseJson)
      return { responseJson: responseJson, err: null }
    } else if (code == 400) {
      let responseJson = await response.json();
      return { responseJson: null, err: responseJson.message }

    } else {

      return { responseJson: null, err: 'Something went wrong!' }
    }
  } catch (error) {
    console.error('the error of the uploade image is ==>>', error);
    return { responseJson: null, err: 'Something Went Wrong! Please check your internet connection.' }

  }
}

export const requestPostApiSignUp = async (endPoint, formData, method) => {
  var url = baseUrl + endPoint
  console.log('Request Url:-' + url + '\n')
  console.log(formData + '\n')

  try {
    let response = await fetch(url, {
      method: method,
      body: formData,
    }
    )

    let code = await response.status
    console.log(code)

    if (code == 200) {
      let responseJson = await response.json();
      console.log(responseJson)
      return { responseJson: responseJson, err: null }
    } else if (code == 400 || 402) {
      let responseJson = await response.json();
      console.log(responseJson)

      return { responseJson: null, err: responseJson.msg }

    } else {

      return { responseJson: null, err: 'Something went wrong!' }
    }
  } catch (error) {

    return { responseJson: null, err: 'Something Went Wrong! Please check your internet connection.' }
    console.error(error);
  }
}

const objToQueryString = (obj) => {

  const keyValuePairs = [];
  for (const key in obj) {
    keyValuePairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
  }
  return keyValuePairs.length == 0 ? '' : '?' + keyValuePairs.join('&');
}
