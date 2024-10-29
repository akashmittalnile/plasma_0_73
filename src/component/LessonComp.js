import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { FONTFAMILY, FONTFAMILYSEMIBOLD } from '../utility/fonts'

function LessonComp({ count = 0, style={}, removeLesson=false }) {

    const lessonTitle = (removeLesson) ? '' : (count < 2 ? 'Lesson' : 'Lessons')

    return (
        <TouchableOpacity style={[{  backgroundColor: "#fff", borderRadius: 4, justifyContent: "center", borderWidth: 1, borderColor: '#B357C3', padding: 4 }, style]}>
            <Text style={{fontFamily:FONTFAMILYSEMIBOLD, fontSize: 12, color: "#B357C3", textAlign: "center" }}>{count} {lessonTitle}</Text>
        </TouchableOpacity>
    )
}

export default LessonComp