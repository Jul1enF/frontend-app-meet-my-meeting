import { Text, View, StyleSheet } from 'react-native';
import { useMemo, memo, useState } from 'react';

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import { getMinDuration } from '@utils/timeFunctions';
import { eventCatTranslation } from 'constants/translations';


export default memo(function EventItem({ start, end, description, category, appointment_type, client, unregistered_client, minuteHeight, dtDayWorkingHours }) {

    if (!start || !end || !dtDayWorkingHours) return <></>

    else {
        const { dtDayStart, dtDayEnd } = dtDayWorkingHours

        const { category: appCat, title, default_duration } = appointment_type ?? {}


        // Var for the display of the events (top, height, fonts, etc...)
        const eventMinFromStart = getMinDuration(dtDayStart, start)
        const eventMinDuration = getMinDuration(start, end)

        const fullHeight = eventMinDuration * minuteHeight
        const height = fullHeight * 0.94
        const fullTop = eventMinFromStart * minuteHeight
        const top = fullTop + (fullHeight * 0.03)

        const detailsFontSize = eventMinDuration > 15 ? appStyle.regularText.fontSize : appStyle.smallText.fontSize

        const categoryFontSize = eventMinDuration > 15 ? appStyle.largeText.fontSize : appStyle.regularText.fontSize

        let color
        let paddingTop = 5
        let justifyContent = "space-evenly"
        let rowGap


        switch (category) {
            case "appointment":
                if (eventMinDuration >= 40) {
                    justifyContent = "center"
                    rowGap = phoneDevice ? RPW(7) : 40
                }
                color = "rgba(183, 162, 2, 1)"
                break;
            case "closure":
                color = appStyle.darkGrey
                paddingTop = appStyle.largeMarginTop
                justifyContent = "flex-start"
                break;
            case "absence":
            case "dayOff":
                color = appStyle.strongGrey
                paddingTop = appStyle.largeMarginTop
                justifyContent = "flex-start"
                break;
            case "lunchBreak":
            case "defaultLunchBreak":
            case "break":
                color = "rgba(119, 166, 0, 1)"
                justifyContent = "center"
                if (eventMinDuration > 15) rowGap = phoneDevice ? RPW(3) : 20
                break;
        }


        // Style for eventDetails text
        const eventDetails = {
            fontSize: detailsFontSize,
            letterSpacing: appStyle.regularText.letterSpacing,
            color: appStyle.fontColorDarkBg,
            textAlign: "center",
        }



        // For the event taking the full day we repeat their name along the day height
        const fullDayItemDetails = useMemo(() => {
            const itemDetails = []
            const numberOfItems = Math.floor(fullHeight / (90 * minuteHeight))
            for (let i = 0; i < numberOfItems; i++) {
                itemDetails.push(
                    <View style={{ justifyContent: "center", alignItems: "center", height: height / numberOfItems, maxWidth: "100%", rowGap : phoneDevice ? RPW(3) : 20  }} key={i}>

                        <Text style={[styles.categoryTitle, {fontSize : categoryFontSize}]}>
                            {eventCatTranslation[category]}
                            {description && " :"}
                        </Text>

                        {description &&
                            <Text style={[eventDetails, styles.eventDetailsTitle]} >
                                {description}
                            </Text>
                        }
                    </View>
                )
            }
            return itemDetails
        }, [])

        // Return for thoses elements
        if (category === "closure" || category === "absence" || category === "dayOff") {
            return (
                <View style={[styles.mainContainer, {
                    top: fullTop,
                    height: fullHeight,
                    backgroundColor: color,
                    paddingTop,
                    justifyContent,
                }]} >

                    {fullDayItemDetails}

                </View>
            )
        }



        // Return for appointments and breaks
        return (
            <View style={[styles.mainContainer, rowGap && { rowGap }, {
                top,
                height,
                backgroundColor: color,
                paddingTop,
                justifyContent,
            }]} >

                <Text style={[styles.categoryTitle, {fontSize : categoryFontSize}]}>
                    {eventCatTranslation[category]}
                    {(category === "appointment" || description) && " :"}
                </Text>


                <View style={styles.row}>

                    {category === "appointment" &&

                        <Text style={eventDetails} >

                            {appCat &&
                                <Text style={[eventDetails, styles.eventDetailsTitle]} >
                                    {appCat + " : "}
                                </Text>
                            }

                            {`${title} - ${default_duration} min`}
                        </Text>

                    }

                    {description &&
                        <Text style={eventDetails} >
                            {description}
                        </Text>
                    }

                </View>


                {category === "appointment" &&
                    <View style={styles.row}>
                        <Text style={eventDetails} numberOfLines={2} >
                            <Text style={[eventDetails, styles.eventDetailsTitle]} >
                                Client•e :
                            </Text>

                            {" "}
                            {unregistered_client?.last_name ?? client?.last_name ?? null}
                            {" "}
                            {unregistered_client?.first_name ?? client?.first_name ?? null}
                        </Text>
                    </View>
                }



            </View>
        )
    }
})

const styles = StyleSheet.create({
    mainContainer: {
        width: "90%",
        borderRadius: appStyle.regularItemBorderRadius,
        position: "absolute",
        paddingHorizontal: phoneDevice ? appStyle.regularLateralPadding * 0.5 : appStyle.regularLateralPadding,
        paddingBottom: phoneDevice ? RPW(1) : 5,
        alignItems: "center",
        opacity: 0.95,
    },
    row: {
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
        maxWidth: "100%",
    },
    categoryTitle: {
        letterSpacing : appStyle.largeText.letterSpacing,
        color: appStyle.fontColorDarkBg,
        fontWeight: "700",
        textAlign: "center",
        lineHeight: phoneDevice ? RPW(5.5) : 29,
    },
    eventDetailsTitle: {
        fontWeight: "700"
    },
})