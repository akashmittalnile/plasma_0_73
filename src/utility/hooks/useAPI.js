import { useState, useCallback, useRef, memo } from 'react';
import Toast from 'react-native-simple-toast';
import { requestGetApi, requestGetWithoutBody, requestPostApi } from '../../WebApi/Service';
import { useDispatch, useSelector } from 'react-redux';
import { setCart } from '../../redux/reduxSlices/cartSlice';
import AddToCartErrorComponent from '../../component/AddToCartErrorComponent';



function appendObjectToFormData(formData, dataObject) {
    // Handle potential empty object or non-object input
    if (!dataObject || typeof dataObject !== 'object') {
        return formData;
    }

    // Loop through each key-value pair in the object
    for (const [key, value] of Object.entries(dataObject)) {
        // Recursively handle nested objects or arrays
        if (typeof value === 'object' && value !== null) {
            appendObjectToFormData(formData, value, key); // Append with key prefix for nested structures
        } else {
            // Append key-value pairs to FormData
            formData.append(key, value);
        }
    }

    return formData;
}

const useAPI = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [isAddToCartErrorComponent, setIsAddToCartErrorComponent] = useState(false);
    const [addToCartErrorComponentMsg, setAddToCartErrorComponentMsg] = useState('');
    const onApproveFunc = useRef(async () => {

        console.log("defaul");
    })
    const onCancelFunc = useRef(async () => { })

    const userdetails = useSelector(state => state.user.user_details);
    const dispatch = useDispatch()

    function controlLoader(signal = false) {
        setLoading(signal);
    }


    const getAPI = useCallback(async ({ endPoint = '', reloadCart = false, toastEnable = true }) => {

        try {
            console.log("getAPI", { userdetails, endPoint });
            setLoading(true);
            setError(null);

            const { responseJson, err } = await requestGetApi(endPoint, '', 'GET', userdetails.access_token)
            console.log(endPoint,"getAPI", responseJson, err);
            setLoading(false);

            if (reloadCart) {
                getCartList()
            }

            if (err == null) {
                if (responseJson.status) {

                    return responseJson

                } else {
                    toastEnable && Toast.show(responseJson?.message);
                    return null


                }
            }
            else {
                return null

            }


        }
        catch (error) {
            console.error("getAPI Get", error);
            return null
        }


    }, []);

    const postAPI = useCallback(async ({ endPoint = '', bodyJSON = null, reloadCart = false, toastEnable = true, catchErrorCallBack = () => { }, isSendJSON = false, loaderOn=true }) => {

        try {
            loaderOn &&  setLoading(true);
            setError(null);
            const formdata = new FormData();

            bodyJSON && appendObjectToFormData(formdata, bodyJSON)

            let sendBody = null

            if (bodyJSON == null) 
                sendBody = null
            else 
                sendBody = isSendJSON ? JSON.stringify(bodyJSON) : formdata
                

            // const sendBody = isSendJSON ? JSON.stringify(bodyJSON) : formdata


            loaderOn && setLoading(true);
            const { responseJson, err } = await requestPostApi(
                endPoint,
                sendBody,
                'POST',
                userdetails.access_token,
            );
            setLoading(false);

            if (reloadCart) {
                getCartList()
            }
            console.log('useAPI Post Response', responseJson, err);
            if (err == null) {
                if (responseJson.status) {

                    // console.log(responseJson.message);

                    toastEnable && responseJson?.message && Toast.show(responseJson?.message);

                    return responseJson

                    // getCourseDetail()
                } else {
                    catchErrorCallBack(responseJson)

                    toastEnable && Toast.show(responseJson.message);
                    return null
                }
            } else {
                console.log('useAPI Post error', err);
                return null
            }
        } catch (error) {
            console.log('useAPI Post error catch', error);
            setLoading(false);
        }

    }, []);

    const putAPI = useCallback(async ({ endPoint = '', bodyJSON = {}, reloadCart = false, toastEnable = true, catchErrorCallBack = () => { }, isSendJSON = false }) => {

      
        try {
            setLoading(true);
            setError(null);
            const formdata = new FormData();

            appendObjectToFormData(formdata, bodyJSON)

            const sendBody = isSendJSON ? JSON.stringify(bodyJSON) : formdata


            setLoading(true);
            const { responseJson, err } = await requestPostApi(
                endPoint,
                sendBody,
                'PUT',
                userdetails.access_token,
                isSendJSON
            );
            setLoading(false);

            if (reloadCart) {
                getCartList()
            }
            console.log('useAPI PUT Response', responseJson, err);
            if (err == null) {
                if (responseJson.status) {

                    // console.log(responseJson.message);

                    toastEnable && responseJson?.message && Toast.show(responseJson?.message);

                    return responseJson

                    // getCourseDetail()
                } else {
                    catchErrorCallBack(responseJson)

                    toastEnable && Toast.show(responseJson.message);
                    return null
                }
            } else {
                console.log('useAPI Post error', err);
                return null
            }
        } catch (error) {
            console.log('useAPI Post error catch', error);

        }

    }, []);

    const postAPIForMedia = useCallback(async ({ endPoint = '', reloadCart = false, toastEnable = true, formData = null }) => {

        if (formData == null) {
            Toast.show("Please add form data!")
            console.log("Please add form data!");
            return
        }

        try {
            setLoading(true);
            setError(null);
            // const formdata = new FormData();

            // appendObjectToFormData(formdata, bodyJSON)


            setLoading(true);
            const { responseJson, err } = await requestPostApi(
                endPoint,
                formData,
                'POST',
                userdetails.access_token,
            );
            setLoading(false);

            if (reloadCart) {
                getCartList()
            }
            console.log('useAPI Post Response', responseJson, err);
            if (err == null) {
                if (responseJson.status) {

                    // console.log(responseJson.message);

                    toastEnable && responseJson?.message && Toast.show(responseJson?.message);

                    return responseJson

                    // getCourseDetail()
                } else {

                    toastEnable && Toast.show(responseJson.message);
                    return null
                }
            } else {
                console.log('useAPI Post error', err);
                return null
            }
        } catch (error) {
            console.log('useAPI Post error catch', error);

        }

    }, []);

    const deleteAPI = useCallback(async ({ endPoint = '', reloadCart = false }) => {

        console.log("deleteAPI");

        try {
            console.log("deleteAPI", { userdetails, endPoint });
            setLoading(true);
            setError(null);

            const { responseJson, err } = await requestGetApi(endPoint, '', 'DELETE', userdetails.access_token)

            setLoading(false);

            if (reloadCart) {
                getCartList()
            }

            if (err == null) {
                if (responseJson.status) {

                    return responseJson

                } else {
                    Toast.show(responseJson?.message);
                    return null


                }
            }
            else {
                return null

            }


        }
        catch (error) {
            console.error("getAPI Get", error);
            return null
        }


    }, []);


    const reload = () => {
        setReloadTrigger(prev => !prev);
    };



    const getCartList = async () => {

        console.log("sss");
        const { responseJson, err } = await requestGetWithoutBody(`cart-list`, userdetails.access_token)

        console.log('cart-list==>>', responseJson);
        if (err == null) {
            if (responseJson.status) {


                console.log("cart-list", responseJson.data);
                // Toast.show(responseJson?.message);

                dispatch(setCart(responseJson))

            } else {

                console.log("else");

                dispatch(setCart(responseJson))

            }
        } else {
        }
    };

    async function emptyCart({ callback = async () => { } }) {

        const res = await postAPI({ endPoint: 'empty-cart', toastEnable: false })

        if (res) {
            console.log("done");
            await callback()
        }

    }

    function showAddToCartErrorComp({ approveFunc = () => { }, cancelFunc = () => { }, msg = '' }) {
        onApproveFunc.current = approveFunc
        onCancelFunc.current = cancelFunc
        setAddToCartErrorComponentMsg(msg)
        setIsAddToCartErrorComponent(true)

    }
    function hideAddToCartErrorComp({ callback = () => { } }) {
        callback()
        setIsAddToCartErrorComponent(false)
    }

    async function onApprove() {
        await emptyCart({ callback: onApproveFunc.current })
        //    await onApproveFunc.current()
        setIsAddToCartErrorComponent(false)

    }
    function onCancel() {
        setIsAddToCartErrorComponent(false)
        onCancelFunc.current()
    }

    async function toggleAddRemoveCart({ in_cart = false, type = null, id = null, onSuccessCallBack = () => { }, onErrorCallBack = () => { } }) {

        const res = postAPI({
            endPoint: in_cart ? 'remove-cart' : 'add-cart', bodyJSON: {
                id: id,
                type: type
            }
        })

        if (res) {
            onSuccessCallBack(res)
        } else {
            onErrorCallBack(res)
        }

    }




    const AddToCartErrorComp = useCallback(() => {

        console.log("AddToCartErrorComp, rerender");

        return <AddToCartErrorComponent isAddToCartErrorComponent={isAddToCartErrorComponent} setIsAddToCartErrorComponent={setIsAddToCartErrorComponent} approveBtn={onApprove} cancelBtn={onCancel} msg={addToCartErrorComponentMsg} />

    }, [isAddToCartErrorComponent, addToCartErrorComponentMsg])

    return {
        getAPI, postAPI, putAPI, deleteAPI, reload, loading, error, getCartList, controlLoader, AddToCartErrorComp, showAddToCartErrorComp,
        hideAddToCartErrorComp, emptyCart, postAPIForMedia, toggleAddRemoveCart
    };
};

export default useAPI;
