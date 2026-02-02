import { Text, View  } from 'react-native';

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';
import MyTextInput from '@components/ui/MyTextInput';

import DatePicker from '@components/ui/DatePicker/DatePicker';

export default function VacationInputs({ vacationStart, setVacationStart, vacationEnd, setVacationEnd, description, setDescription, category, selectedEmployee }) {
    
    return (
        <>
            <Text style={{ ...appStyle.labelText, color: appStyle.fontColorDarkBg, marginTop: appStyle.mediumMarginTop, textAlign : "center"}} >
                {`${category === "closure" ? "Fermeture" : "Congé"} du :`}
            </Text>

            <View style={{ marginTop: appStyle.regularMarginTop * 0.5 }}>
                <DatePicker chosenDate={vacationStart} setChosenDate={setVacationStart}
                    endInputText=" ( inclus ) " />
            </View>


            <Text style={{ ...appStyle.labelText, color: appStyle.fontColorDarkBg, marginTop: appStyle.mediumMarginTop, }} >
                Au :
            </Text>

            <View style={{ marginTop: appStyle.regularMarginTop * 0.5 }}>
                <DatePicker chosenDate={vacationEnd} setChosenDate={setVacationEnd}
                    endInputText=" ( inclus ) " />
            </View>

            <Text style={{ ...appStyle.labelText, color: appStyle.fontColorDarkBg, marginTop: appStyle.mediumMarginTop, }} >
                Description :
            </Text>


            <MyTextInput
                style={{ ...appStyle.input.baseLargeCard, color: appStyle.fontColorDarkBg }}
                onChangeText={(e) => setDescription(e)}
                value={description}
                placeholder='Description...'
                placeholderTextColor={appStyle.placeholderColor}
                autoCapitalize="sentences"
            />


            { category === "absence" && 
            <Text style={{...appStyle.regularText, marginTop : appStyle.mediumMarginTop, color : appStyle.fontColorDarkBg, fontWeight : "500"}}>
                <Text style={{...appStyle.largeText, color : appStyle.fontColorDarkBg, fontWeight : "700", textAlign : "center"}}>
                    Personne concernée :
                </Text>
                {`  ${selectedEmployee.first_name ? (selectedEmployee.first_name + " ") : ""}${selectedEmployee.last_name ?? ""}`}
            </Text>
            }

        </>
    )
}