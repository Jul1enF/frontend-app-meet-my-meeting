import { Dimensions, Platform } from "react-native";


const screenHeight = Dimensions.get('window').height
const fullScreenHeight = Dimensions.get('screen').height
const screenWidth = Dimensions.get('window').width


export const RPH = (percentage) => {

    if (Platform.OS === "android") {
        return (percentage / 100) * fullScreenHeight
    }
    else {
        return (percentage / 100) * screenHeight;
    }
};

export const RPW = (percentage) => {
    return (percentage / 100) * (screenWidth);
};

export const phoneDevice = RPW(1) <= 6 ? true : false
