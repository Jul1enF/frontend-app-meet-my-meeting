import { Dimensions } from "react-native";


const screenHeight = Dimensions.get('screen').height
const screenWidth = Dimensions.get('screen').width


export const RPH = (percentage) => {
    return (percentage / 100) * screenHeight;
};

export const RPW = (percentage) => {
    return (percentage / 100) * screenWidth;
};

export const phoneDevice = screenWidth < 600;