import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

const CircularProgress = ({ size, strokeWidth, progress=0, color }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (circumference * progress) / 100;

    return (
        <View style={{ width: size, height: size }}>
            <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
                    <Circle
                        stroke="#e6e6e6"
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    <Circle
                        stroke={color}
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                    />
                </G>
            </Svg>
            <View style={styles.textContainer}>
                {/* <Text style={styles.text}>{`${progress}%`}</Text> */}
                <Image
                    source={require('../assets/book.png')}
                    style={{ width: 18, height: 18, }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    textContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default CircularProgress;
