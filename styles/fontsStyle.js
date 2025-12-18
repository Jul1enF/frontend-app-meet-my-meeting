import { RPH, RPW, phoneDevice } from '@utils/dimensions'
import { colorsStyle } from "./colorsStyle"
const { strongBlack, strongRed, darkWhite2, lightGreen } = colorsStyle

export const fontsStyle = {
    pageTitle: {
        fontSize: phoneDevice ? RPW(6) : 40,
        letterSpacing: phoneDevice ? RPW(0.45) : 2.5,
        fontWeight: '500',
        color: strongBlack,
        textAlign: "center",
    },
    pageSubtitle: {
        fontSize: phoneDevice ? RPW(5) : 32,
        letterSpacing: phoneDevice ? RPW(0.4) : 3,
        fontWeight: '500',
        color: strongBlack,
        textAlign: "center",
    },
    largeText: {
        color: strongBlack,
        fontSize: phoneDevice ? RPW(4.65) : 30,
        fontWeight: "500",
    },
    regularText: {
        color: strongBlack,
        fontSize: phoneDevice ? RPW(4.3) : 28,
        lineHeight: phoneDevice ? RPW(5.5) : 35,
        fontWeight: "400",
    },
    secondHeaderText: {
        color: strongBlack,
        fontSize: phoneDevice ? RPW(4.15) : 30,
        lineHeight: phoneDevice ? RPW(5) : 35,
        fontWeight: "500",
    },
    labelText: {
        color: strongBlack,
        fontSize: phoneDevice ? RPW(4) : 25,
        fontWeight: "500",
    },
    smallText: {
        color: strongBlack,
        fontSize: phoneDevice ? RPW(3.5) : 22,
        fontWeight: "400",
    },
    warning: {
        fontSize: phoneDevice ? RPW(4) : 26,
        letterSpacing: phoneDevice ? 0.5 : 1,
        fontWeight: "500",
        textAlign: "center",
        width: "100%",
        color: strongRed,
    },
    success: {
        color: lightGreen,
    },

    // Special font color
    fontColorDarkBg: darkWhite2,
}