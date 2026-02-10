import { Text, View } from 'react-native';
import { useMemo, useState, useEffect } from 'react';

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import DurationPicker from './DurationPicker';
import Autocomplete from '@components/ui/autocomplete/Autocomplete';
import useAutocompleteLists from '../event-update/useAutocompleteLists';
import MyTextInput from '@components/ui/MyTextInput';

import { DateTime } from 'luxon';
import { isBefore } from '@utils/timeFunctions';


export default function BreakInputs({ breakDuration, setBreakDuration, eventStart, setEventStart, availableSlots, description, setDescription }) {

    // Creation with a hook of the autocomplete list
    const { availableSlotsList } = useAutocompleteLists({ availableSlots, eventStart })


    const [slotWarning, setSlotWarning] = useState("")

    // Set an error if the break start selected doesn't fit with the break duration in a schedule slot
    useEffect(() => {

        if (!breakDuration || !availableSlotsList || !eventStart) return
        if (!availableSlotsList.some(e =>
            e.start.toMillis() === eventStart.toMillis()
        )) {
            const isEventStartInPast = isBefore(eventStart, DateTime.now({ zone: "Europe/Paris" }))

            setSlotWarning(`Erreur : ${isEventStartInPast ? "l'heure de début de la pause est déjà passée " : "la pause ne rentre pas dans le créneau "}! Merci ${isEventStartInPast ? "" : "de changer sa durée ou "}de choisir un autre horaire ci dessous :`)
            setTimeout(() => setSlotWarning(""), 6000)
        }
    }, [breakDuration, availableSlotsList])


  

    return (
        <>
            <Text style={{ ...appStyle.labelText, color: appStyle.fontColorDarkBg, marginTop: appStyle.mediumMarginTop }} >
                Durée :
            </Text>

            <View style={{ width: "100%", alignItems: "center", marginTop: appStyle.regularMarginTop }}>
                <DurationPicker duration={breakDuration} changeDuration={setBreakDuration} />
            </View>


            <Text style={[appStyle.warning, !slotWarning && { height: 0, marginTop: 0 }]}>
                {slotWarning}
            </Text>


            <Text style={{ ...appStyle.labelText, color: appStyle.fontColorDarkBg, marginTop: appStyle.largeMarginTop }} >
                Début :
            </Text>


            <Autocomplete
            data={availableSlotsList ?? []}
            placeholderText={eventStart ? eventStart.toFormat("HH : mm") : "Horaire"}
            showClear={false}
            editable={false}
            setSelectedItem={setEventStart}
            selectedItem={eventStart}
            emptyResultText={!breakDuration ? "Merci de sélectionner une durée" : "Aucun créneau disponible"}
            inputStyle={{ ...appStyle.input.baseLargeCard, color : appStyle.fontColorDarkBg }}
            dropdownTextStyle={{fontWeight : "700"}}
            multiline={true}
        />


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

        </>
    )
}