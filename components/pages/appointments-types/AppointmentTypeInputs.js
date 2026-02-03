import { View, Text, StyleSheet } from "react-native"
import Autocomplete from "@components/ui/Autocomplete"
import MyTextInput from "@components/ui/MyTextInput"

import { RPH, RPW, phoneDevice } from "@utils/dimensions"
import { appStyle } from "@styles/appStyle"


export default function AppointmentsTypesInputs({ categories, setCategory, title, setTitle, defaultDuration, setDefaultDuration, price, setPrice, setWarning, selectedType }) {

    return (
        <>
            <View style={[styles.column, { marginTop: 0 }]}>
                <Text style={styles.label}>
                    Catégorie :
                </Text>

                <Autocomplete
                    data={categories}
                    setSelectedItem={setCategory}
                    placeholderText="Catégorie..."
                    emptyText="Aucun résultat"
                    width={"100%"}
                    canCreate={true}
                    initialValue={selectedType?.category && { title: selectedType.category, id: selectedType._id }}
                    inputStyle={{ height: "auto", paddingTop: phoneDevice ? RPW(3) : 22, paddingBottom: phoneDevice ? RPW(3) : 22, minHeight: appStyle.largeItemHeight, fontWeight: "400" }}
                    inputContainerStyle={{ height: "auto" }}
                    suggestionTextStyle={{ lineHeight: phoneDevice ? RPW(6) : 40 }}
                    listItemStyle={{ height: "auto", paddingVertical: phoneDevice ? RPW(3) : 22 }}
                    multiline={true}
                />
            </View>

            <View style={styles.column}>
                <Text style={styles.label}>
                    Titre :
                </Text>
                <MyTextInput style={[appStyle.input.baseLargeCard, { color: appStyle.fontColorDarkBg, fontWeight: "400" }]}
                    onChangeText={(e) => {
                        setTitle(e)
                        setWarning("")
                    }}
                    value={title}
                    placeholder='Titre...'
                    placeholderTextColor={appStyle.placeholderColor}
                    autoCapitalize="sentences"
                >
                </MyTextInput>
            </View>


            <View style={styles.column}>
                <Text style={styles.label}>
                    Durée :
                </Text>


                <MyTextInput style={styles.inputWithText}
                    onChangeText={(e) => {
                        if (!Number.isNaN(Number(e)) && e) setDefaultDuration(Number(e))
                        else setDefaultDuration("")
                        setWarning("")
                    }}
                    value={defaultDuration.toString()}
                    placeholder='Durée...'
                    placeholderTextColor={appStyle.placeholderColor}
                    keyboardType="numeric"
                >

                    <View style={styles.inputTextContainer}>
                        <Text style={{ ...appStyle.regularText, color: appStyle.fontColorDarkBg }}>
                            minutes
                        </Text>
                    </View>

                </MyTextInput>


            </View>


            <View style={styles.column}>
                <Text style={styles.label}>
                    Prix :
                </Text>

                <MyTextInput style={styles.inputWithText}
                    onChangeText={(e) => {
                        if (!Number.isNaN(Number(e)) && e) setPrice(Number(e))
                        else setPrice("")
                        setWarning("")
                    }}
                    value={price.toString()}
                    placeholder='Prix...'
                    placeholderTextColor={appStyle.placeholderColor}
                    keyboardType="numeric"
                >

                    <View style={styles.inputTextContainer}>
                        <Text style={{ ...appStyle.regularText, color: appStyle.fontColorDarkBg }}>
                            euros
                        </Text>
                    </View>

                </MyTextInput>


            </View>
        </>
    )
}

const styles = StyleSheet.create({
    column: {
        alignItems: "center",
        width: "100%",
        marginTop: appStyle.largeMarginTop,
    },
    label: {
        ...appStyle.largeText,
        fontWeight: "700",
        color: appStyle.fontColorDarkBg,
        paddingBottom: phoneDevice ? RPW(1) : 6,
    },
    labelContainer: {
        borderBottomColor: appStyle.darkWhite,
        borderBottomWidth: phoneDevice ? 2 : 3,
    },
    inputWithText: {
        ...appStyle.input.withIcon,
        ...appStyle.input.baseLargeCard,
        color: appStyle.fontColorDarkBg,
        paddingRight: "50%",
    },
    inputTextContainer: {
        ...appStyle.inputIconContainer,
        width: "50%",
        paddingRight: appStyle.regularHorizontalPadding,
        alignItems: "flex-end"
    }
})