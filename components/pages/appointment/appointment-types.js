import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { useMemo, useState, memo } from 'react';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

export default memo(function AppointmentTypes({ title, types, selected, setSelectedSubcategory, index, setSelectedAppointmentType, setCategoriesListVisible }) {

    const typesItems = types.map((e, i) =>
        <TouchableOpacity key={i} style={styles.typeContainer} onPress={() => {
            setSelectedAppointmentType(e)
            setCategoriesListVisible(false)
        }}>
            <View style={[styles.borderTop, i === 0 && { display: "none" }]} />

            <Text style={[appStyle.regularText, { textAlign: "center" }]}>
                {e.title}
            </Text>
            
        </TouchableOpacity>)



    return (
        <View style={[styles.mainContainer, phoneDevice && { width: "100%" }, index === 0 && phoneDevice && { marginTop: appStyle.regularMarginTop * 1.5 }]}>

            <TouchableOpacity style={[styles.titleContainer, selected && { borderBottomColor: appStyle.darkGrey, borderBottomWidth: 0.5 }]} activeOpacity={0.5} onPress={() => {
                setSelectedSubcategory(prev => prev === title ? null : title)
            }} >
                <Text style={[appStyle.regularText, { fontWeight: "500", textAlign: "center" }]}>
                    {title}
                </Text>

                <FontAwesome5
                    name={selected ? "chevron-up" : "chevron-down"}
                    color={appStyle.strongBlack}
                    size={phoneDevice ? RPW(4.2) : 23}
                    style={styles.chevronIcon}
                />
            </TouchableOpacity>

            {selected && typesItems}
        </View>
    )
})

const styles = StyleSheet.create({
    mainContainer: {
        width: appStyle.largeItem.width,
        marginTop: appStyle.regularMarginTop,
        backgroundColor: appStyle.pageBody.backgroundColor,
        shadowColor: Platform.OS === "android" ? "black" : appStyle.darkGrey,
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    titleContainer: {
        paddingVertical: phoneDevice ? RPW(3.5) : 20,
        marginTop: 0,
        width: "100%",
        borderRadius: 0,
        backgroundColor: appStyle.pageBody.backgroundColor,
        alignItems: "center",
        justifyContent: "center",
    },
    chevronIcon: {
        position: "absolute",
        right: appStyle.regularLateralPadding,
    },
    typeContainer: {
        minWidth: "100%",
        paddingVertical: phoneDevice ? RPW(3.5) : 20,
        alignItems: "center",
        justifyContent: "center",
    },
    borderTop: {
        minWidth: "90%",
        borderTopWidth : phoneDevice ? 0.2 : 0.5,
        borderTopColor : appStyle.darkGrey,
        position: "absolute",
        top: 0,
    }
})