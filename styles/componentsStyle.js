import { RPH, RPW, phoneDevice } from '@utils/dimensions'
import { colorsStyle } from './colorsStyle'
import { fontsStyle } from './fontsStyle'
const { brightGrey, lightGrey, darkWhite, darkGrey } = colorsStyle
const { regularText } = fontsStyle

// Sizes called multiple times in this file or called on their own in the app
const regularItemWidth = phoneDevice ? RPW(67) : 510
const regularItemHeight = phoneDevice ? RPW(9) : 55
const regularItemBorderRadius = phoneDevice ? RPW(2.5) : 18
const regularItemVertPadding = phoneDevice ? RPW(1.8) : 10

const mediumItemHeight = phoneDevice ? RPW(10.8) : 68

const largeItemWidth = phoneDevice ? RPW(92) : Math.min(700, RPW(100), RPH(100)) // small android tablets can be smaller than 700 dp
const largeItemHeight = phoneDevice ? RPW(12) : 78

const regularHorizontalPadding = phoneDevice ? RPW(3) : 20
const cardHorizontalPadding = phoneDevice ? RPW(5) : 30

const regularMarginTop = phoneDevice ? RPW(3) : 25
const mediumMarginTop = phoneDevice ? RPW(4.75) : 38
const largeMarginTop = phoneDevice ? RPW(7) : 50  // page padding top
const veryLargeMarginTop = phoneDevice ? RPW(9.5) : 70

const pagePaddingBottom = phoneDevice ? RPW(15) : 120


// Styles called multiple times in this file or called on their own in the app

const card = {
    paddingTop: phoneDevice ? RPW(6) : 45,
    paddingBottom: phoneDevice ? RPW(6.5) : 50,
    paddingHorizontal: cardHorizontalPadding,
    borderRadius: regularItemBorderRadius,
    marginTop: largeMarginTop,
    alignItems: "center",
    width: (cardHorizontalPadding * 2) + regularItemWidth,
    backgroundColor: darkGrey,
}

const largeCard = {
    ...card,
    width : largeItemWidth,
    maxWidth : largeItemWidth,
    paddingBottom: phoneDevice ? RPW(12) : 70,
}

const regularItem = {
    minHeight: regularItemHeight,
    paddingVertical : regularItemVertPadding,
    width: regularItemWidth,
    maxWidth: regularItemWidth,
    borderRadius: regularItemBorderRadius,
    marginTop: regularMarginTop,
    paddingHorizontal: regularHorizontalPadding,
}

const largeItem = {
    height: largeItemHeight,
    width: largeItemWidth,
    borderRadius: regularItemBorderRadius,
    marginTop: regularMarginTop,
    paddingHorizontal: regularHorizontalPadding,
}

const largeCardItem = {
    ...largeItem,
    width : "100%",
    maxWidth : "100%",
}

// On android there is default padding top and bottom on text input that we need to override
const inputVertPadding = {
    paddingBottom: 0,
    paddingTop: 0,
}

const lightGreyBorder = {
    borderColor: lightGrey,
    borderWidth: phoneDevice ? 1.2 : 1.8,
}



// EXPORT
export const componentsStyle = {
    // Main sizes of the app
    headerHeight: phoneDevice ? RPW(16) : 105,
    tabBarHeight: phoneDevice ? RPW(18) : 90,
    secondHeaderHeight: phoneDevice ? RPW(10) : 62,
    secondHeaderHorizPadd: phoneDevice ? RPW(4) : 30,
    inputIconSize: phoneDevice ? RPW(5.2) : 35,


    // Components Style
    pageBody: {
        flex: 1,
        backgroundColor: darkWhite,
        paddingTop: largeMarginTop,
        paddingBottom: pagePaddingBottom,
        alignItems: "center",
    },
    input: {
        base: {
            ...regularItem,
            ...inputVertPadding,
            ...lightGreyBorder,
            ...regularText,
        },
        baseLarge: {
            ...largeItem,
            ...inputVertPadding,
            ...lightGreyBorder,
            ...regularText,
        },
        baseLargeCard : {
            ...largeCardItem,
             ...inputVertPadding,
            ...lightGreyBorder,
            ...regularText,
            fontWeight : "700",
        },
        withIcon: {
            width: "90%",
            height: "100%",
            ...regularText,
            ...inputVertPadding,
        }
    },
    button: {
        alignItems: "center",
        justifyContent: "center",
    },
    horizontalLine: {
        height: phoneDevice ? 1.5 : 2,
        backgroundColor: brightGrey,
    },

    // Border width and colors
    secondHeaderBorderBottom: {
        borderBottomColor: lightGrey,
        borderBottomWidth: phoneDevice ? 0.5 : 1.5
    },
    lightGreyBorder,

    // Export of sizes called multiple times in this file or called on their own in the app
    regularItemWidth,
    regularItemHeight,
    regularItemBorderRadius,

    mediumItemHeight,

    largeItemWidth,
    largeItemHeight,

    regularHorizontalPadding,
    cardHorizontalPadding,
    pagePaddingBottom,

    regularMarginTop,
    mediumMarginTop,
    largeMarginTop,
    veryLargeMarginTop,

    regularItem,
    largeItem,
    largeCardItem,

    card,
    largeCard,

    inputVertPadding,
}