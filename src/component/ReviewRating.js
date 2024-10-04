import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, Button, Keyboard } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Rating } from 'react-native-ratings';
import { dimensions, Mycolors } from '../utility/Mycolors';
import useAPI from '../utility/hooks/useAPI';
import { submit_rating } from '../WebApi/Service';
import { FONTFAMILY } from '../utility/fonts';

const ReviewRating = forwardRef(function ReviewRating({ type, id, callback = () => { }, startLoader=()=>{} }, ref) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [reviewSubmitted, setreviewSubmitted] = useState(false)
    const { loading, postAPI } = useAPI()
    const [isEditModal, setisEditModal] = useState(false)
    const [reviewID, setreviewID] = useState(null)

    const handleOpenModal = () => {

        // console.log({reviewID,
        //     defaultRating,
        //     defaultReviewText});
        setIsModalVisible(true)
        setisEditModal(false)
    }
    const handleEditModal = (reviewId, defaultRating, defaultReviewText) => {

        console.log({
            reviewId,
            defaultRating,
            defaultReviewText
        });

        setreviewID(reviewId)
        setRating(defaultRating)
        setReviewText(defaultReviewText)
        

        setIsModalVisible(true)
        setisEditModal(true)



    }
    const handleCloseModal = () => {
        
        setIsModalVisible(false)
        setRating(0); // Reset rating after submission
        setReviewText(''); // Reset review text after submission
        // setreviewSubmitted((value) => !value)
        setisEditModal(false)
    };
    const handleSubmitReview = async () => {
        startLoader()
        if (isEditModal) {
            editReview()
            return
        }

        console.log(type, id)

        const resp = await postAPI({
            endPoint: submit_rating, bodyJSON: {
                course_id: id,
                rating: rating,
                review: reviewText,
                type: type,
            }
        })

        // if (!resp) {
        //     return
        // }



        try {
            callback()
        } catch (error) {
            console.error(error);
        }


        // Implement logic to submit review (e.g., send to API)
        console.log('Submitted review:', rating, reviewText);
        handleCloseModal();
        setRating(0); // Reset rating after submission
        setReviewText(''); // Reset review text after submission
        setreviewSubmitted((value) => !value)
    };

    const editReview = async () => {

        const res = await postAPI({
            endPoint: "edit-rating", bodyJSON: {
                id: reviewID,
                rating: rating,
                review: reviewText
            }
        })

        try {
            callback()
        } catch (error) {
            console.error(error);
        }


        console.log('Submitted review:', rating, reviewText);
        handleCloseModal();
        setRating(0); // Reset rating after submission
        setReviewText(''); // Reset review text after submission
        setreviewSubmitted((value) => !value)
        setisEditModal(false)

    }

    useImperativeHandle(ref, () => ({
        openModal: handleOpenModal,
        openEditModal: handleEditModal,
        closeModal: handleCloseModal,
        reviewSubmitted: reviewSubmitted
    }));



    return (
        <>
            {/* <View style={styles.container}>
      <Button title="Post Review" onPress={handleOpenModal} /> */}

            <Modal
                animationType="fade"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={handleCloseModal}
            // style={{flex: 1,  width: '100%',
            //     height: '100%',}}
            >
                <View style={styles.modalContent}>
                    <TouchableOpacity onPress={handleCloseModal} style={[styles.modalContent, { width: dimensions.SCREEN_WIDTH, }]} />
                    <View style={{
                        position: 'absolute',
                        backgroundColor: 'white', width: dimensions.SCREEN_WIDTH - 15, borderRadius: 10, height: '50%', justifyContent: 'space-evenly', alignItems: 'center', padding: 5
                    }}>
                        <Text style={styles.modalHeader}>Review & Rating</Text>
                        <Text style={styles.modalText}>Select Stars According To Your Overall Experience</Text>
                        <View style={{ width: '100%', height: 40, alignSelf: 'flex-end' }}>
                            <Rating
                                startingValue={rating}
                                type="star"
                                // rating={}
                                fractions={1} // Allow half-star ratings
                                readonly={false} // Allow user interaction
                                // onFinishRating={(rating) => {
                                //     console.log(rating);
                                //     // setRating(rating)

                                // }}


                                style={styles.rating}
                                onFinishRating={(val) => {
                                    console.log("dddd", val);
                                    setRating(val)
                                }}
                            />
                        </View>
                        <TextInput
                            style={styles.reviewInput}
                            multiline={false}
                            numberOfLines={4}
                            placeholder="Write your review here..."
                            onChangeText={setReviewText}
                            value={reviewText}
                            onSubmitEditing={()=>{
                                Keyboard.dismiss()
                            }}
                        />
                        <TouchableOpacity title={isEditModal ? "Edit Review" : "Submit Review"} onPress={handleSubmitReview} style={styles.submitButton}>

                            <Text style={{fontFamily:FONTFAMILY, color: 'white', fontFamily:FONTFAMILY }}>{isEditModal ? "Edit Review" : "Submit Review"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {/* </View> */}
        </>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(200, 200, 200, 0.5)',
        paddingHorizontal: 10
        // margin: 20,
        // borderRadius: 10,
    },
    modalHeader: {
        fontSize: 25,
        fontWeight: '500',fontFamily:FONTFAMILY
        // marginBottom: 30,
    },
    modalText: {
        fontSize: 15.5,
        // marginBottom: 15,
        width: '100%', fontFamily:FONTFAMILY
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    rating: {
        marginBottom: 20,
    },
    reviewInput: {
        padding: 20,
        borderWidth: 1,
        borderColor: Mycolors.TEXT_BORDER_LIGHt_PURPLE,
        borderRadius: 5,
        // marginBottom: 15,
        width: '100%',
        minHeight: 100 ,// Set a minimum height for multiline input
        fontFamily:FONTFAMILY
    },
    submitButton: {
        backgroundColor: '#B357C3',
        width: dimensions.SCREEN_WIDTH - 40,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
});

export default ReviewRating;
