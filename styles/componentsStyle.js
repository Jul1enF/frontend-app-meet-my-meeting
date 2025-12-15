import { RPH, RPW, phoneDevice } from '@utils/dimensions'
import { colorsStyle } from './colorsStyle'
const { brightGrey, lightGrey, darkWhite, darkGrey } = colorsStyle

// Sizes called multiple times in this file or called on their own in the app
const regularItemWidth = phoneDevice ? RPW(67) : 510
const regularItemHeight = phoneDevice ? RPW(9) : 55
const regularItemBorderRadius = phoneDevice ? RPW(2.5) : 18

const largeItemWidth = phoneDevice ? RPW(92) : 716
const largeItemHeight = phoneDevice ? RPW(12) : 78

const cardLateralPadding = phoneDevice ? RPW(5) : 30

const pagePaddingTop = phoneDevice ? RPW(7) : 50
const pagePaddingBottom = phoneDevice ? RPW(15) : 120


export const componentsStyle = {
    // Main sizes of the app
    headerHeight: phoneDevice ? RPW(16) : 105,
    tabBarHeight: phoneDevice ? RPW(18) : 90,
    secondHeaderHeight: phoneDevice ? RPW(10) : 62,

    // Export of sizes that can be called in specific places
    regularItemWidth,
    regularItemHeight,
    regularItemBorderRadius,

    largeItemWidth,
    largeItemHeight,

    cardLateralPadding,

    pagePaddingBottom,
    pagePaddingTop,

    // Components Style
    pageBody: {
        flex: 1,
        backgroundColor : darkWhite,
        paddingTop : pagePaddingTop,
        paddingBottom : pagePaddingBottom,
    },
    card: {
        paddingTop: phoneDevice ? RPW(6) : 45,
        paddingBottom: phoneDevice ? RPW(6.5) : 50,
        paddingHorizontal : cardLateralPadding,
        borderRadius: regularItemBorderRadius,
        marginTop: phoneDevice ? RPW(6) : 40,
        alignItems: "center",
        width: (cardLateralPadding * 2) + regularItemWidth,
        backgroundColor : darkGrey,
    },
    input: {
        paddingBottom: 0,
        paddingTop: 0,
    },
    button: {
        alignItems: "center",
        justifyContent: "center",
    },
    regularItem: {
        height: regularItemHeight,
        width: regularItemWidth,
        borderRadius: regularItemBorderRadius,
        marginTop: phoneDevice ? RPW(3) : 25,
        paddingHorizontal : phoneDevice ? RPW(2) : 20,
    },
    largeItem: {
        height: largeItemHeight,
        width: largeItemWidth,
        borderRadius: regularItemBorderRadius,
        marginTop: phoneDevice ? RPW(3) : 25,
        paddingHorizontal : phoneDevice ? RPW(2) : 20,
    },
     horizontalLine: {
        height: phoneDevice ? 1.5 : 2,
        backgroundColor: brightGrey,
    },

    // Border Colors
    lightGreyBorder: {
        borderColor: lightGrey,
        borderWidth: phoneDevice ? 1.2 : 1.8,
    }
}