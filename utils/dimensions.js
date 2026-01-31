import { Dimensions, Platform } from "react-native";


let screenHeight = Dimensions.get('window').height
let fullScreenHeight = Dimensions.get('screen').height
let screenWidth = Dimensions.get('window').width

const phoneDevice = screenWidth < 600;

Dimensions.addEventListener('change', ({ window, screen }) => {
    if (phoneDevice) {
        screenHeight = window.height;
        screenWidth = window.width;

        if (Platform.OS === "android") {
            fullScreenHeight = screen.height;
        }
    }
});

const RPH = (percentage) => {

    if (Platform.OS === "android") {
        return (percentage / 100) * fullScreenHeight
    }
    else {
        return (percentage / 100) * screenHeight;
    }
};

const RPW = (percentage) => {
    return (percentage / 100) * (screenWidth);
};

export {phoneDevice, RPH, RPW}

