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
import { FONTFAMILY } from '../../../utility/fonts';

// type AllCommentsRoutes = RouteProp<RootStackParamList, 'AllComments'>;

let deleteId: number;
const AllComments = (props: any) => {
  const inputRef = React.useRef<TextInput>(null);
  const { params } = useRoute();
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
  const postID = props.route.params.postID;
  const { getAPI, loading, postAPI, deleteAPI } = useAPI()

  const dummyFunc = () => { }

  function initiateReloadCommunity() {
    dispatch(reloadCommunity())
    getPostDetails()
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

  };

  async function deleteHandler(id: any) {
    console.log({ id });

    await deleteAPI({ endPoint: 'post-comment-delete?id=' + id })

    initiateReloadCommunity()



  }

  const editHandler = (obj: { comment: string; id: number }) => {
    setIsEditing({ editing: true, id: obj.id });
    setComment(obj.comment);
    inputRef.current?.focus();
    setReplying(false);
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


    const res = await getAPI({ endPoint: `post-details/${postID}` })
    if (!res) {
      return
    }

    const temp = [];
    const data = res?.data?.comments;

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




    console.log({ res });





  }

  const dismisreplyingText = () => {
    if (isEditing.editing) {
      setIsEditing({editing: false, id: undefined});
    } else {
      setReplying(false);
      setReplyingTo({name: '', id: 0});
    }
    Keyboard.dismiss();
    setComment('');
  };


  useEffect(() => {

    getPostDetails()

  }, []);

  return (<>


    <LinearGradient colors={['#300076', '#53045F']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>

        <HomeHeader2
          height={60}
          // paddingHorizontal={15}
          title={'Post'}
          press1={() => {
            props.navigation.goBack();
          }}
          img1={require('../../../assets/arrow_right_black.png')}
          img1width={25}
          img1height={25}
          press2={() => { props.navigation.navigate('Notification') }}
          img2={require('../../../assets/notification.png')}
          img2width={25}
          img2height={25}
          press3={() => { }}
          img3={require('../../../assets/shoppingbag.png')}
          img3width={25}
          img3height={25}
          backgroundColor={'transparent'}
        />
        <View style={{
          alignItems: 'center',
          flex: 1,
          paddingHorizontal: 10,
          backgroundColor: '#F0F0F0'
        }}>

          {/* <ScrollView> */}
          <View style={styles.subContainer}>
            <ScrollView
              contentContainerStyle={{
                alignItems: 'flex-end',
                paddingBottom: responsiveHeight(25),
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
                      color: 'black', fontFamily:FONTFAMILY
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
          <View style={styles.commentBox}>
            {(replying || isEditing.editing) && (
              <View style={styles.replying}>
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
            <View style={styles.comment}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: '100%',
                  width: '95%',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    paddingBottom: responsiveHeight(3),
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
                  />
                  <BorderBtn
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
                  />
                </View>
              </View>
            </View>
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
        {loading && <Loader />}
      </SafeAreaView>
    </LinearGradient>
  </>
  );
};

export default AllComments;

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
    position: 'absolute',
    bottom: 0,
    elevation: 3,
    // shadowColor: globalStyles.shadowColor,
  },
  comment: {
    paddingVertical: responsiveHeight(2),
    width: responsiveWidth(100),
    backgroundColor: 'white',
    elevation: 3,
    // shadowColor: globalStyles.shadowColor,
  },
  textInput: {
    flex: 6,
    paddingHorizontal: responsiveWidth(5),
    height: '100%',
    backgroundColor: 'white',
    color: 'black'
  },
  commentBtn: {
    flex: 2,
    height: responsiveHeight(5),
    elevation: 3,
    backgroundColor: 'gray'
  },
  replying: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(5),
    width: responsiveWidth(100),
    // backgroundColor: globalStyles.veryLightGray,
  },
  replyingText: {
    fontSize: responsiveFontSize(1.6),
    fontWeight: '400',
    // color: globalStyles.themeBlue,
  },
  replyingBtntouch: {
    justifyContent: 'center',
    alignItems: 'center',
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
