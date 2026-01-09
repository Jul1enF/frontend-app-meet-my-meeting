import { Text, View, TextInput } from 'react-native';

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import DatePicker from '@components/ui/DatePicker/DatePicker';

export default function VacationInputs({ vacationStart, setVacationStart, vacationEnd, setVacationEnd, description, setDescription, category }) {
    console.log("Category Inputs:", category)
    return (
        <>
            <Text style={{ ...appStyle.labelText, color: appStyle.fontColorDarkBg, marginTop: appStyle.mediumMarginTop, }} >
                {`${category === "closure" ? "Fermeture" : "Congé"} du :`}
            </Text>

            <View style={{ marginTop: appStyle.regularMarginTop * 0.5 }}>
                <DatePicker chosenDate={vacationStart} setChosenDate={setVacationStart}
                    inputText=" ( inclus ) " />
            </View>


            <Text style={{ ...appStyle.labelText, color: appStyle.fontColorDarkBg, marginTop: appStyle.mediumMarginTop, }} >
                Au :
            </Text>

            <View style={{ marginTop: appStyle.regularMarginTop * 0.5 }}>
                <DatePicker chosenDate={vacationEnd} setChosenDate={setVacationEnd}
                    inputText=" ( inclus ) " />
            </View>

            <Text style={{ ...appStyle.labelText, color: appStyle.fontColorDarkBg, marginTop: appStyle.mediumMarginTop, }} >
                Description :
            </Text>


            <TextInput
                style={{ ...appStyle.input.baseLarge, width: "100%", fontWeight: "700", color: appStyle.fontColorDarkBg }}
                onChangeText={(e) => setDescription(e)}
                value={description}
                placeholder='Description...'
                placeholderTextColor={appStyle.placeholderColor}
                autoCapitalize="sentences"
            />

        </>
    )
}