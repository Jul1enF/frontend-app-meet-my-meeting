import { View, StyleSheet, Text, FlatList, RefreshControl, TouchableOpacity } from "react-native";
import { useEffect, useState, useRef, useMemo } from "react";

import { RPH, RPW, phoneDevice } from "@utils/dimensions"
import { appStyle } from "@styles/appStyle"
import request from "@utils/request";
import { useSelector } from "react-redux";
import useSessionExpired from "@hooks/useSessionExpired";
import { sortByCategory } from "@components/pages/appointments-types/AppointmentTypesUtils";

import ModalPageWrapper from "@components/layout/ModalPageWrapper";
import AppointmentTypeItem from "@components/pages/appointments-types/AppointmentTypeItem";
import AppointmentTypeRedaction from "@components/pages/appointments-types/AppointmentTypeRedaction";
import Octicons from '@expo/vector-icons/Octicons';

export default function AppointmentsTypesPage() {
    const jwtToken = useSelector((state) => state.user.value.jwtToken)
    const [types, setTypes] = useState([])
    const [warning, setWarning] = useState({})
    const [typeModalVisible, setTypeModalVisible] = useState(false)
    const [selectedType, setSelectedType] = useState(null)

    // HOOKS TO LOGOUT IF SESSION EXPIRED
    const [sessionExpired, setSessionExpired] = useState(false)
    useSessionExpired(sessionExpired, setSessionExpired)

    // LOAD APPOINTMENTS TYPES FUNCTION AND USEEFFECT
    const getTypes = async () => {
        const data = await request({ path: "pros/get-appointments-types", jwtToken, setSessionExpired, setWarning })
        if (data) {
            setTypes(sortByCategory(data.appointmentsTypes))
        }
    }

    useEffect(() => {
        getTypes()
    }, [])

    // CATEGORIES LOGIC (IF THERE ARE ONES)
    const categories = useMemo(() => {
        const categoriesObject = types.reduce((acc, type) => {
            const key = type.category
            if (key && !acc[key]) acc[key] = { title: key, id: type._id }
            return acc
        }, {})
        const categoriesArray = Object.values(categoriesObject)
        return categoriesArray
    }, [types])


    // FLATLIST SET UP

    const typesFlatlistRef = useRef(null)

    // Refresh component for the flatlist

    const [isRefreshing, setIsRefreshing] = useState(false)

    const refreshComponent = <RefreshControl refreshing={isRefreshing} colors={[appStyle.strongBlack]} progressBackgroundColor={appStyle.pageBody.backgroundColor} tintColor={appStyle.strongBlack} onRefresh={() => {
        setIsRefreshing(true)
        setTimeout(() => setIsRefreshing(false), 1000)
        getTypes()
    }} />

    // Header
    const typesListHeader = () => {
        return (
            <View style={{ minWidth: "100%", alignItems: "center" }}>
                <Text style={appStyle.pageTitle}>
                    Modèles de rendez-vous
                </Text>

                <Text style={[appStyle.warning, warning?.success && appStyle.success, !warning?.text && { height: 0, marginTop: 0 }]}>
                    {warning?.text}
                </Text>

                <TouchableOpacity style={styles.addTypeButton} activeOpacity={0.6} onPress={() => {
                    setTypeModalVisible(true)
                    selectedType && setSelectedType(null)
                }}>
                    <Text style={styles.addTypeText}>
                        Ajouter un modèle
                    </Text>
                    <Octicons name="feed-plus" size={appStyle.inputIconSize} color={appStyle.fontColorDarkBg} style={styles.plusIcon} />
                </TouchableOpacity>
            </View>
        )
    }

    const typesListEmpty = () => <Text style={appStyle.pageSubtitle} > Aucun modèle encore créé !</Text>

    return (
        <View style={{flex :1, backgroundColor : appStyle.pageBody.backgroundColor}}>
            <FlatList
                data={types}
                refreshControl={refreshComponent}
                ref={typesFlatlistRef}
                onScrollToIndexFailed={(event) => {
                    typesFlatlistRef.current.scrollToIndex({ animated: false, index: event.index })
                }}
                ListHeaderComponent={typesListHeader}
                ListHeaderComponentStyle={{ marginBottom: appStyle.mediumMarginTop }}
                ListEmptyComponent={typesListEmpty}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item._id}
                renderItem={({ item, index }) =>
                    <TouchableOpacity
                        onPress={() => {
                            setTypeModalVisible(true)
                            setSelectedType(item)
                        }}>
                        <AppointmentTypeItem {...item} index={index} />
                    </TouchableOpacity>
                }
                style={{ flex: 1 }}
                contentContainerStyle={{alignItems: 'center', paddingBottom: appStyle.pagePaddingBottom, paddingTop : appStyle.mediumMarginTop}}
            />

            <ModalPageWrapper visible={typeModalVisible} setVisible={setTypeModalVisible} backHeaderText="Liste des modèles de RDV" >

                <AppointmentTypeRedaction selectedType={selectedType} setSelectedType={setSelectedType} jwtToken={jwtToken} setTypes={setTypes} setSessionExpired={setSessionExpired} categories={categories} setTypeModalVisible={setTypeModalVisible} />

            </ModalPageWrapper>
        </View>
    )
}

const styles = StyleSheet.create({
    addTypeButton: {
        ...appStyle.regularItem,
        backgroundColor: appStyle.strongRed,
        marginTop: appStyle.mediumMarginTop,
        alignItems: "center",
        justifyContent: "center"
    },
    addTypeText: {
        ...appStyle.regularText,
        fontWeight: "600",
        color: appStyle.fontColorDarkBg,
    },
    plusIcon: {
        position: "absolute",
        right: phoneDevice ? RPW(3.5) : 25
    }
})