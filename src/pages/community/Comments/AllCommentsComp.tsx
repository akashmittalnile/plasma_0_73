import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Keyboard,
    RefreshControl,
} from 'react-native';
import React, { useEffect } from 'react';
// import Header from '../../components/Header/Header';
import {
    responsiveFontSize,
    responsiveHeight,
    responsiveWidth,
} from 'react-native-responsive-dimensions';
// import { globalStyles } from '../../utils/constant';
import CommentTab from './CommentTab';

import BorderBtn from './BorderBtn';
// import {
//   PostApiWithToken,
//   endPoint,
//   GetApiWithToken,
//   DeleteApi,
// } from '../../services/Service';
// import { useAppDispatch, useAppSelector } from '../../redux/Store';
import Toast from 'react-native-simple-toast';
import { RouteProp, useRoute } from '@react-navigation/native';
// import { RootStackParamList } from '../../navigation/MainNavigation';
// import { reloadHandler } from '../../redux/ReloadScreen';
// import ScreenNames from '../../utils/ScreenNames';
// import SkeletonContainer from './SkeletonContainer';
import DeleteModal from './DeleteModal';
import HomeHeader2 from '../../../component/HomeHeader2';
import { useDispatch } from 'react-redux';
import SkeletonContainer from '../../../component/Skelton/SkeltonContainer';
import Loader from '../../../WebApi/Loader';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import useAPI from '../../../utility/hooks/useAPI';
import { reloadCommunity } from '../../../redux/reduxSlices/communitySlice';
import Modal from "react-native-modal";
import MyButtons from '../../../component/MyButtons';
import { dimensions, Mycolors } from '../../../utility/Mycolors';
import NoDataFound from '../../../component/NoDataFound';
import { FONTFAMILY, FONTFAMILYSEMIBOLD } from '../../../utility/fonts';

// type AllCommentsRoutes = RouteProp<RootStackParamList, 'AllComments'>;

let deleteId: number;
const AllCommentsComp = (props: any) => {
    const inputRef = React.useRef<TextInput>(null);
    // const { params } = useRoute();
    const dispatch = useDispatch();
    // const followedCommunityPost = useAppSelector(
    //   state => state.reload.FollowedCommunityPost,
    // );
    // const followedCommunityDetails = useAppSelector(
    //   state => state.reload.FollowedCommunityDetails,
    // );
    // const token = useAppSelector(state => state.auth.token);

    const [replyingTo, setReplyingTo] = React.useState<{
        name: string;
        id: number;
    }>({ name: '', id: 0 });
    const [replying, setReplying] = React.useState<boolean>(false);
    const [comment, setComment] = React.useState<string>('');
    const [loader, setLoader] = React.useState<boolean>(false);
    const [showSkeleton, setShowSkeleton] = React.useState<boolean>(false);
    const [data, setData] = React.useState<any[]>([]);
    const [reload, setReload] = React.useState<boolean>(false);
    const [isEditing, setIsEditing] = React.useState<{
        editing: boolean;
        id: number | undefined;
    }>({ editing: false, id: undefined });
    const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);
    const [deleteLoader, setDeleteLoader] = React.useState<boolean>(false);
    const [refreshing, setRefreshing] = React.useState(false);
    const [openCommentModal, setOpenCommentModal] = React.useState(false);
    const [keyboard, setkeyboard] = React.useState(false)
    // const postID = props.route.params.postID;
    // const { getAPI, loading, postAPI, deleteAPI } = useAPI()
    const { postAPI, deleteAPI, postID, reloadAPI } = props

    const dummyFunc = () => { }

    function initiateReloadCommunity() {
        dispatch(reloadCommunity())
        // getPostDetails()
        reloadAPI()
    }

    async function postComment() {

        const payload = {
            id: postID,
            comment: comment,
            is_reply: replying ? 1 : 0,
            reply_id: replying ? replyingTo?.id : '',
            type: 1
        }

        console.log({ payload });

        if ((await postAPI({ endPoint: 'post-comment', bodyJSON: payload }))) {


            initiateReloadCommunity()

            setComment('')

            setReplying(false);


        }




    }

    console.log({ postID });


    const replyingHandler = (id: number, name: string) => {
        inputRef.current?.focus();
        setReplyingTo({ name, id });
        setReplying(true);
        setIsEditing({ editing: false, id: -1 });
        setOpenCommentModal(true)

    };

    async function deleteHandler(id: any) {
        // console.log({id});
        
        // return
        console.log({ id });

       const res =  await deleteAPI({ endPoint: 'post-comment-delete?id=' + id })

       if (res) {
        Toast.show(res?.message)
       }
        initiateReloadCommunity()



    }

    const editHandler = (obj: { comment: string; id: number }) => {
        setIsEditing({ editing: true, id: obj.id });
        setComment(obj.comment);
        inputRef.current?.focus();
        setReplying(false);
        setOpenCommentModal(true)
    };


    async function initiateEditComment() {
        console.log({ isEditing });

        const payload = {
            id: isEditing?.id,
            comment: comment
        }

        await postAPI({ endPoint: 'post-comment-edit', bodyJSON: payload })
        initiateReloadCommunity()
        setComment('')
        setIsEditing({ editing: false, id: -1 });


    }

    async function getPostDetails() {


        // const res = await getAPI({ endPoint: `post-details/${postID}` })
        // if (!res) {
        //     return
        // }

        const temp = [];
        // const data = res?.data?.comments;
        const dataRaw = props?.data?.comments;
        const trimComment = props?.trimComment || null

        const data = trimComment ? dataRaw?.slice(0, trimComment) : dataRaw

        for (let i = 0; i < data?.length; i++) {
            temp.push(
                <CommentTab
                    key={i}
                    id={data[i]?.comment_id}
                    replyHandler={replyingHandler}
                    comment={data[i]?.comment}
                    name={data[i]?.comment_user_name}
                    date={data[i]?.comment_posted_date}
                    imageUri={data[i]?.comment_user_profile}
                    style={{ marginBottom: responsiveHeight(1) }}
                    editHandler={editHandler}
                    deleteHandler={deleteHandler}
                    isEdit={data[i]?.my_comment}
                    isDelete={data[i]?.my_comment}
                />,
            );
            if (data[i]?.comment_reply?.length > 0) {
                const _temp = data[i]?.comment_reply?.map((item: any, index: number) => (
                    <CommentTab
                        key={index}
                        id={item?.reply_id}
                        replyHandler={dummyFunc}
                        comment={item?.reply_comment}
                        name={item?.reply_user_name}
                        date={item?.reply_posted_date}
                        imageUri={item?.reply_user_profile}
                        style={{ marginBottom: responsiveHeight(1) }}
                        isReplied={true}
                        editHandler={dummyFunc}
                        deleteHandler={dummyFunc}
                        isEdit={false}
                        isDelete={false}
                    />
                ));
                temp?.push(_temp);
            }
        }
        setData(temp);




        // console.log({ res });





    }
    const dismisreplyingText = () => {
        if (isEditing.editing) {
            setIsEditing({ editing: false, id: undefined });
        } else {
            setReplying(false);
            setReplyingTo({ name: '', id: 0 });
        }
        Keyboard.dismiss();
        setComment('');
    };

    useEffect(() => {

        getPostDetails()

    }, [props?.data?.comments]);

    useEffect(() => {

        Keyboard.addListener('keyboardDidHide',(e)=>{
            setkeyboard(false)
        })
        Keyboard.addListener('keyboardDidShow',(e)=>{
            setkeyboard(true)
        })

        return() => {
            Keyboard.removeAllListeners('keyboardDidShow')
            Keyboard.removeAllListeners('keyboardDidHide')
          }

    }, []);
    

    return (<>

        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 0,
            gap: 20,
            width: '100%',
            height: 38,
            marginTop: 10
            // backgroundColor: 'blue'
        }}>
            <View style={{ flexDirection: 'row' }}>

                <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 16, color: "#fff", padding: 5, lineHeight: 24, fontWeight: '500', marginLeft: 5 }}>{"All Comments"} </Text>
            </View>
            <TouchableOpacity onPress={() => {
                dismisreplyingText()
                setOpenCommentModal(true)
            }

            } style={{
                // flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                // padding: 5, // Use a single value for uniform padding
                // gap: 7,
                // margin: '0 auto', // Center the view horizontally
                // width: 94,
                height: 38,
                backgroundColor: '#B357C3',
                borderRadius: 5,
                shadowColor: '#23356F', // Extracted from box-shadow
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.12,
                shadowRadius: 13,
            }}>
                <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 15, color: "#fff", padding: 5, lineHeight: 24, }}>Add Comment</Text>
            </TouchableOpacity>
        </View>
        {props?.data?.comments ? <>

            <Modal isVisible={openCommentModal}
                onBackdropPress={() => setOpenCommentModal(false)}
                swipeDirection="down"
            >
                <View style={{
                    width: dimensions.SCREEN_WIDTH,
                    backgroundColor: 'white',
                    height: 300, borderTopLeftRadius: 20, borderRadius: 20, alignItems: 'center', position: 'absolute', bottom: keyboard ? '40%' : 0, alignSelf: 'center', justifyContent: 'space-evenly'
                }}>


                    {(replying || isEditing.editing) && (
                        <View style={[styles.replying, { width: '100%', }]}>
                            <View>
                                {replying && (
                                    <Text
                                        style={
                                            styles.replyingText
                                        }>{`Replying to ${replyingTo?.name}`}</Text>
                                )}
                                {isEditing.editing && (
                                    <Text style={styles.replyingText}>Editing</Text>
                                )}
                            </View>
                            <View>
                                <TouchableOpacity
                                    style={styles.replyingBtntouch}
                                    onPress={dismisreplyingText}
                                >
                                    <Image
                                        source={require('../../../assets/crossed.png')}
                                        resizeMode="contain"
                                        style={styles.replyingBtn}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    {/* <View style={styles.comment}> */}
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            // height: '100%',
                            width: '90%',
                            height: 100,
                            // backgroundColor: 'green'
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.23,
                            shadowRadius: 2.62,

                            elevation: 4,
                            borderRadius: 20,
                        }}>

                        <TextInput
                            ref={inputRef}
                            value={comment}
                            onChangeText={text => {
                                setComment(text);
                            }}
                            style={styles.textInput}
                            placeholder="What's on your mind"
                            placeholderTextColor="gray"
                            multiline={true}
                            numberOfLines={50}

                        />
                        {/* <BorderBtn
                                loader={loader}
                                disable={comment?.length === 0}
                                containerStyle={styles.commentBtn}
                                buttonText={
                                    replying
                                        ? 'Reply'
                                        : isEditing?.editing
                                            ? 'Update'
                                            : 'Comment'
                                }
                                onClick={isEditing?.editing ? initiateEditComment : postComment}
                            /> */}

                    </View>
                    {/* </View> */}

                    <MyButtons
                        disabled={comment?.length === 0}

                        title={
                            replying
                                ? 'Reply'
                                : isEditing?.editing
                                    ? 'Update'
                                    : 'Comment'
                        }
                        height={60}
                        width={'90%'}
                        borderRadius={5}
                        fontWeight={'700'}
                        alignSelf="center"
                        press={() => {
                            setOpenCommentModal(false)

                            isEditing?.editing ?
                                initiateEditComment() : postComment()

                        }}
                        marginHorizontal={20}
                        titlecolor={Mycolors.BG_COLOR}
                        backgroundColor={Mycolors.Purple}
                        marginVertical={10}
                    />
                </View>

            </Modal>



            <View style={{
                alignItems: 'center',
                flex: 1,
                paddingHorizontal: 10,
                // backgroundColor: '#F0F0F0'
            }}>


                {/* <ScrollView> */}
                <View style={styles.subContainer}>
                    <ScrollView scrollEnabled={false}
                        contentContainerStyle={{
                            alignItems: 'flex-end',
                            // paddingBottom: responsiveHeight(25),
                        }}
                        refreshControl={
                            <RefreshControl refreshing={false} onRefresh={initiateReloadCommunity} />
                        }
                        showsVerticalScrollIndicator={false}>
                        {showSkeleton ? (
                            <Loader />
                        ) : data?.length > 0 ? (
                            data
                        ) : (
                            <View
                                style={{
                                    alignItems: 'center',
                                    marginTop: responsiveHeight(20),
                                    width: '100%',
                                }}>
                                <Image
                                    // source={require('../../../assets/Icons/no-data-found.png')} 
                                    resizeMode='contain' style={{ height: responsiveHeight(15), width: responsiveWidth(30) }} />
                                <Text
                                    style={{
                                        fontSize: responsiveFontSize(2.5),
                                        fontWeight: '500',
                                        color: 'black',
                                        fontFamily:FONTFAMILYSEMIBOLD
                                    }}>
                                    No comments found
                                </Text>
                            </View>
                        )}
                        {/* <CommentTab
                id={2}
                replyHandler={dum}
                comment=" Impressive! Though it seems the drag feature could be improved. But
            overall it looks incredible. You’ve nailed the design and the
            responsiveness at various breakpoints works really well."
                name="Amyrobson"
                date="1 month ago"
                // imageUri={userIconPath}
                style={{marginBottom: responsiveHeight(1)}}
                isReplied={true}
              /> */}
                    </ScrollView>
                </View>

                {/* </ScrollView> */}

                {showDeleteModal && (
                    <DeleteModal
                        title="Are you sure you want to delete this comment?"
                        loader={deleteLoader}
                        cancelButtonHandler={dummyFunc}
                        confirmButtonHandler={dummyFunc}
                    />
                )}
            </View>
            {/* {loading && <Loader />} */}

        </>
            :
            <View style={{ marginTop: -40 }}>
                <NoDataFound msg='No Comments Found!' />
            </View>
        }
    </>
    );
};

export default AllCommentsComp;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
    },
    headerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: responsiveHeight(2),
        // height: responsiveHeight(7),
        // backgroundColor: globalStyles.themeBlue,
    },
    subContainer: {
        paddingTop: responsiveHeight(1.5),
        width: responsiveWidth(95),
    },
    commentBox: {
        // position: 'absolute',
        // bottom: 0,
        // elevation: 3,
        // shadowColor: globalStyles.shadowColor,
    },
    comment: {
        paddingVertical: responsiveHeight(2),
        width: responsiveWidth(100),
        // backgroundColor: 'green',
        elevation: 3,
        // shadowColor: globalStyles.shadowColor,
    },
    textInput: {
        flex: 6,
        paddingHorizontal: responsiveWidth(5),
        height: '100%',
        backgroundColor: 'white',
        color: 'black', fontFamily:FONTFAMILY
    },
    commentBtn: {
        flex: 2,
        height: responsiveHeight(5),
        elevation: 3,
        backgroundColor: 'gray'
    },
    replying: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: responsiveHeight(1),
        paddingHorizontal: responsiveWidth(5),
        // width: responsiveWidth(100),
        // backgroundColor: globalStyles.veryLightGray,
    },
    replyingText: {
        fontSize: responsiveFontSize(1.6),
        fontWeight: '400', fontFamily:FONTFAMILY
        // color: globalStyles.themeBlue,
    },
    replyingBtntouch: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10
    },
    replyingBtn: {
        height: responsiveHeight(2),
        width: responsiveHeight(2),
    },
    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
});
