import { View, Text, TextInput, StyleSheet } from "react-native"
import Autocomplete from "@components/ui/Autocomplete"

import { RPH, RPW, phoneDevice } from "@utils/dimensions"
import { appStyle } from "@styles/appStyle"


export default function AppointmentsTypesInputs({ subcategories, setSubcategory, title, setTitle, defaultDuration, setDefaultDuration, price, setPrice, setWarning, selectedType}) {

    return (
        <>
            <View style={[styles.column, { marginTop: 0 }]}>
                <Text style={styles.label}>
                    Catégorie :
                </Text>

                <Autocomplete data={subcategories} setSelectedItem={setSubcategory} placeholderText="Catégorie..." emptyText="Aucun résultat" height={appStyle.regularItemHeight} width={appStyle.regularItemWidth} inputStyle={{ fontWeight: "400", paddingLeft: 0 }} canCreate={true} initialValue={selectedType?.sub_category && {title : selectedType.sub_category, id : selectedType._id} } />
            </View>

            <View style={styles.column}>
                <Text style={styles.label}>
                    Titre :
                </Text>
                <TextInput style={[appStyle.input.base, { color: appStyle.fontColorDarkBg }]}
                    onChangeText={(e) => {
                        setTitle(e)
                        setWarning("")
                    }}
                    value={title}
                    placeholder='Titre...'
                    placeholderTextColor={appStyle.placeholderColor}
                    autoCapitalize="sentences"
                >
                </TextInput>
            </View>

            <View style={styles.column}>
                <Text style={styles.label}>
                    Durée :
                </Text>

                <View style={styles.numberInputContainer}>
                    <TextInput style={[appStyle.input.withIcon, { color: appStyle.fontColorDarkBg, width: "50%" }]}
                        onChangeText={(e) => {
                            e ? setDefaultDuration(Number(e)) : setDefaultDuration("")
                            setWarning("")
                        }}
                        value={defaultDuration.toString()}
                        placeholder='Durée...'
                        placeholderTextColor={appStyle.placeholderColor}
                        keyboardType="numeric"
                    >
                    </TextInput>
                    <Text style={{ ...appStyle.regularText, color: appStyle.fontColorDarkBg }}>
                        minutes
                    </Text>
                </View>
            </View>


            <View style={styles.column}>
                <Text style={styles.label}>
                    Prix :
                </Text>

                <View style={styles.numberInputContainer}>
                    <TextInput style={[appStyle.input.withIcon, { color: appStyle.fontColorDarkBg, width: "50%" }]}
                        onChangeText={(e) => {
                            e ? setPrice(Number(e)) : setPrice("")
                            setWarning("")
                        }}
                        value={price.toString()}
                        placeholder='Prix...'
                        placeholderTextColor={appStyle.placeholderColor}
                        keyboardType="numeric"
                    >
                    </TextInput>
                    <Text style={{ ...appStyle.regularText, color: appStyle.fontColorDarkBg }}>
                        euros
                    </Text>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    column: {
        alignItems: "center",
        width: "100%",
        marginTop: appStyle.mediumMarginTop,
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
    numberInputContainer: {
        ...appStyle.input.base,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingRight : phoneDevice ? RPW(3) : 25,
    }
})