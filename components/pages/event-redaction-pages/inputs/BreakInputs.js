import { Text, View, TextInput } from 'react-native';
import { useMemo, useState, useEffect } from 'react';

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import DurationPicker from './DurationPicker';
import Autocomplete from '@components/ui/Autocomplete';
import useAutocompleteLists from '../event-update/useAutocompleteLists';
import useInputResetKey from '@hooks/useInputResetKey';

import { DateTime } from 'luxon';
import { isBefore } from '@utils/timeFunctions';


export default function BreakInputs({ breakDuration, setBreakDuration, eventStart, setEventStart, availableSlots, description, setDescription, category }) {

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


    // Memoisation of the Autocomplete for the appointments slots and the users

    const slotsAutocomplete = useMemo(() => (
        <Autocomplete
            key={availableSlotsList ? availableSlotsList.length : "key"}
            data={availableSlotsList ?? []}
            placeholderText={eventStart ? eventStart.toFormat("HH : mm") : "Horaire"}
            initialValue={"initialValue"}
            showClear={false}
            editable={false}
            setSelectedItem={(item) => item?.start && setEventStart(item?.start)}
            emptyText={!breakDuration ? "Merci de sélectionner une durée" : "Aucun créneau disponible"}
            width="100%"
            suggestionTextStyle={{ lineHeight: phoneDevice ? RPW(6) : 40, fontWeight: "700" }}
            listItemStyle={{ height: "auto", paddingVertical: phoneDevice ? RPW(3) : 22 }}
        />
    ), [availableSlotsList, eventStart])

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

            {slotsAutocomplete}


            <Text style={{ ...appStyle.labelText, color: appStyle.fontColorDarkBg, marginTop: appStyle.mediumMarginTop, }} >
                Description :
            </Text>


            <TextInput
                style={{ ...appStyle.input.baseLargeCard, color: appStyle.fontColorDarkBg }}
                onChangeText={(e) => setDescription(e)}
                value={description}
                placeholder='Description...'
                placeholderTextColor={appStyle.placeholderColor}
                autoCapitalize="sentences"
                key={useInputResetKey(description)}
            />

        </>
    )
}