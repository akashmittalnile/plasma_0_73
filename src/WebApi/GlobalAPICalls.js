import { requestPostApi, update_product_quantity } from "./Service";
import Toast from 'react-native-simple-toast';

// GlobalAPICalls

export async function addToWishlist(course, type, access_token) {

try {
    let formdata = new FormData();
    formdata.append('id', course);
    formdata.append('type', type);
  
    // setLoading(true);
    const { responseJson, err } = await requestPostApi(
      "add-wishlist",
      formdata,
      'POST',
      access_token,
    );
    // setLoading(false);
    console.log('The edit profile responce is==>>', responseJson);
    if (err == null) {
      if (responseJson.status) {
        Toast.show(responseJson.message);
        // getCourseDetail()
      } else {
      }
    } else {
      console.log('The error is==>>', err);
    }
} catch (error) {
  console.error("addToWishlist",error);
}
}

export async function updateCartQty(updateQtyFlag, setLoader = () => { }, access_token, product_id, product_quantity, callback = (resp) => { }) {

  if (product_quantity < 1) {
    return
  }

  let formdata = new FormData();
  formdata.append('product_id', product_id);
  formdata.append('quantity', updateQtyFlag ? parseInt(product_quantity) + 1 : parseInt(product_quantity) - 1);

  setLoader(true);
  const { responseJson, err } = await requestPostApi(
    update_product_quantity,
    formdata,
    'POST',
    access_token,
  );
  setLoader(false);
  console.log('The edit profile responce is==>>', responseJson, err);
  if (err == null) {
    if (responseJson.status) {

      console.log("updateCartQty", responseJson.message);
      Toast.show(responseJson.message);
      callback(responseJson)


      return

      // getCourseDetail()
    } else {

      Toast.show(responseJson.message);
      return
    }
  } else {
    console.log('The error is==>>', err);
  }
}

export async function toggleCartAddRemove(course, type, access_token, action_type = 'add-cart', callback = () => { }, errorCallBack) {

  console.log('dddd');

  try {
    let formdata = new FormData();
    formdata.append('id', course);
    formdata.append('type', type);


    const { responseJson, err } = await requestPostApi(
      action_type,
      formdata,
      'POST',
      access_token,
    );

    console.log('The edit profile responce is==>>', responseJson, err);
    if (err == null) {
      if (responseJson.status) {

        console.log(responseJson.message);
        Toast.show(responseJson.message);

        (typeof callback) == 'function' && callback()
        return

        // getCourseDetail()
      } else {
        if (!responseJson?.cart_related) {
          return
        }
        errorCallBack ? await errorCallBack(responseJson.message) : Toast.show(responseJson.message);
        return
      }
    } else {
      console.log('The error is==>>', err);
    }
  } catch (error) {

  }
}

export async function apiCallWrapper(callback = async function () { }) {

  callback().then((resp) => {
    console.log("apiCallWrapper success", resp);
  }).catch((err) => {
    console.error("apiCallWrapper error", err);
  })

}