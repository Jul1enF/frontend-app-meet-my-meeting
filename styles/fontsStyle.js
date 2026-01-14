import { RPH, RPW, phoneDevice } from '@utils/dimensions'
import { colorsStyle } from "./colorsStyle"
const { strongBlack, strongRed, darkWhite2, lightGreen } = colorsStyle

export const fontsStyle = {
    pageTitle: {
        fontSize: phoneDevice ? RPW(6.2) : 42,
        letterSpacing: phoneDevice ? RPW(0.45) : 2.5,
        fontWeight: '500',
        color: strongBlack,
        textAlign: "center",
    },
    pageSubtitle: {
        fontSize: phoneDevice ? RPW(5.3) : 34,
        letterSpacing: phoneDevice ? RPW(0.5) : 3,
        fontWeight: '500',
        color: strongBlack,
        textAlign: "center",
    },
    labelText: {
        color: strongBlack,
        fontSize: phoneDevice ? RPW(4.65) : 28,
        fontWeight: "700",
        letterSpacing: phoneDevice ? RPW(0.3) : 1.4,
        lineHeight: phoneDevice ? RPW(6.8) : 40,
    },
    largeText: {
        color: strongBlack,
        fontSize: phoneDevice ? RPW(4.65) : 28,
        fontWeight: "500",
        lineHeight: phoneDevice ? RPW(6.8) : 40,
        letterSpacing: phoneDevice ? RPW(0.1) : 1,
    },
    regularText: {
        color: strongBlack,
        fontSize: phoneDevice ? RPW(4.3) : 26,
        lineHeight: phoneDevice ? RPW(5.5) : 35,
        fontWeight: "400",
        letterSpacing: phoneDevice ? RPW(0.15) : 1,
    },
    secondHeaderText: {
        color: strongBlack,
        fontSize: phoneDevice ? RPW(4.15) : 30,
        lineHeight: phoneDevice ? RPW(5) : 35,
        fontWeight: "500",
    },
    smallText: {
        color: strongBlack,
        fontSize: phoneDevice ? RPW(3.8) : 22,
        fontWeight: "400",
    },
    warning: {
        fontSize: phoneDevice ? RPW(4.6) : 30,
        letterSpacing: phoneDevice ? 1.5 : 2.5,
        fontWeight: phoneDevice ? "700" : "500",
        textAlign: "center",
        width: "100%",
        maxWidth: "100%",
        color: strongRed,
        marginTop: phoneDevice ? RPW(3) : 30,
        lineHeight: phoneDevice ? RPW(6) : 38,
    },
    success: {
        color: lightGreen,
    },

    // Special font color
    fontColorDarkBg: darkWhite2,
}