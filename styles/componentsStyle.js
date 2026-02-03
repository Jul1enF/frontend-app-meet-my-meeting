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

const largeItemWidth = phoneDevice ? RPW(92) : Math.min(700, RPW(92), RPH(92)) // small android tablets can be smaller than 700 dp
const largeItemHeight = phoneDevice ? RPW(12) : 78
const largeItemVertPadding = phoneDevice ? RPW(2.5) : 19

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
    maxWidth: "100%",
    backgroundColor: darkGrey,
}

const largeCard = {
    ...card,
    width: largeItemWidth,
    maxWidth: "100%",
    paddingBottom: phoneDevice ? RPW(12) : 70,
}

const regularItem = {
    minHeight: regularItemHeight,
    paddingTop: regularItemVertPadding,
    paddingBottom: regularItemVertPadding,
    width: regularItemWidth,
    maxWidth: "100%",
    borderRadius: regularItemBorderRadius,
    marginTop: regularMarginTop,
    paddingHorizontal: regularHorizontalPadding,
}

const mediumItemHeight = {
    minHeight: phoneDevice ? RPW(10.8) : 68,
    paddingTop : phoneDevice ? RPW(2) : 14,
    paddingBottom : phoneDevice ? RPW(2) : 14,
}

const largeItem = {
    minHeight: largeItemHeight,
    paddingTop: largeItemVertPadding,
    paddingBottom: largeItemVertPadding,
    width: largeItemWidth,
    maxWidth: "100%",
    borderRadius: regularItemBorderRadius,
    marginTop: regularMarginTop,
    paddingHorizontal: regularHorizontalPadding,
}

const largeCardItem = {
    ...largeItem,
    width: largeCard.width - (cardHorizontalPadding * 2),
    maxWidth: "100%",
}


const lightGreyBorder = {
    borderColor: lightGrey,
    borderWidth: phoneDevice ? 1.2 : 1.8,
}

const inputIconSize = phoneDevice ? RPW(5.2) : 35




// EXPORT
export const componentsStyle = {
    // Main sizes of the app
    headerHeight: phoneDevice ? RPW(16) : 105,
    headerHorizPadd: phoneDevice ? RPW(4) : 30,
    secondHeaderHeight: phoneDevice ? RPW(10) : 62,
    tabBarHeight: phoneDevice ? RPW(18) : 90,


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
            ...lightGreyBorder,
            ...regularText,
            textAlign :"left",
        },
        baseLarge: {
            ...largeItem,
            ...lightGreyBorder,
            ...regularText,
            textAlign :"left",
        },
        baseLargeCard: {
            ...largeCardItem,
            ...lightGreyBorder,
            ...regularText,
            fontWeight: "700",
            textAlign :"left",
        },
        withIcon: {
            paddingRight: inputIconSize * 1.8,
            textAlign :"left",
        }
    },
    inputIconContainer: {
        position: "absolute",
        height: "100%",
        right: 0,
        paddingRight : regularHorizontalPadding,
        width: inputIconSize * 1.8,
        justifyContent: "center",
        alignItems: "flex-end",
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

    inputIconSize,
}
