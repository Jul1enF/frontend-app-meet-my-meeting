import { Text } from "react-native"
import { useMemo } from "react";

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import Autocomplete from "@components/ui/autocomplete/Autocomplete";
import MyTextInput from "@components/ui/MyTextInput";

export default function ProsAppointmentInputs({ usersList, client, setClient, unregisteredClient, setUnregisteredClient }) {


    return (
        <>
            <Text style={{ ...appStyle.labelText, color: appStyle.fontColorDarkBg, marginTop: appStyle.mediumMarginTop, textAlign: "center" }}>
                Utilisateur inscrit à l'app :
            </Text>

            <Autocomplete
                data={usersList}
                sectionToSelectKey="user"
                placeholderText={"Utilisateur ( inscrit )"}
                setSelectedItem={setClient}
                selectedItem={client}
                inputStyle={{ ...appStyle.input.baseLargeCard, color: appStyle.fontColorDarkBg }}
                multiline={true}
            />



            <Text style={{ ...appStyle.labelText, color: appStyle.fontColorDarkBg, marginTop: appStyle.mediumMarginTop, textAlign: "center" }}>
                Utilisateur non enregistré :
            </Text>

            <MyTextInput
                style={{ ...appStyle.input.baseLargeCard, color: appStyle.fontColorDarkBg }}
                onChangeText={(e) => {
                    setUnregisteredClient(prev => ({ ...prev, first_name: e }))
                }}
                value={unregisteredClient.first_name}
                placeholder='Prénom'
                placeholderTextColor={appStyle.placeholderColor}
                autoCapitalize="words"
            />

            <MyTextInput
                style={{ ...appStyle.input.baseLargeCard, color: appStyle.fontColorDarkBg }}
                onChangeText={(e) => {
                    setUnregisteredClient(prev => ({ ...prev, last_name: e }))
                }}
                value={unregisteredClient.last_name}
                placeholder='Nom'
                placeholderTextColor={appStyle.placeholderColor}
                autoCapitalize="words"
            />

        </>
    )
}