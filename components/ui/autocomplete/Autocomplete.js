import { View, TouchableOpacity, StyleSheet, Pressable, Animated, Easing } from "react-native";
import { useState, useEffect, useRef, useMemo } from "react";
import MyTextInput from "../MyTextInput";
import { useDropdownProps } from "./AutocompleteProvider";

import { findSelectedItemTitle, createId } from "./AutocompleteUtils";

import { RPH, RPW, phoneDevice } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Feather from '@expo/vector-icons/Feather';

// TO DISPLAY CORRECTLY THE ITEMS OF THE DATA LIST ONE OF THOSE THREE CONDITIONS MUST BE RESPECTED :
// - THE ITEMS HAVE A FIELD TITLE
// - THE AUTCOMPLETE HAVE THE PROPS TITLETOSELECTKEY
// - THE ITEMS ARE DIRECTLY A STRING

// BETTER TO USE IN A SCROLLVIEW WITH : keyboardShouldPersistTaps="handled" TO HAVE ICONS PRESSABLE EVEN WHEN ANOTHER INPUT IS FOCUSED

// SELECTEDITEM IS MANDATORY

// THE PARENT MUST NOT HAVE alignItems : "strech"

export default function Autocomplete({
    data = [],
    setSelectedItem,
    selectedItem,
    sectionToSelectKey = null, // if items are object, field to select if not the all the item
    titleToSelectKey = null, // if items are object with no "title" key, the field to display
    placeholderText,
    placeholderColor = appStyle.placeholderColor,
    dropdownMaxHeight = phoneDevice ? RPW(55) : 350,
    emptyResultText = "Aucun résultat",
    inputStyle,
    dropdownContainerStyle,
    dropdownItemStyle,
    dropdownTextStyle,
    dropdownLineColor = appStyle.lightGrey,
    boldTitleWeight,
    iconColor,
    canCreate, // true = create an object if the items are one ; "string" = create a string anycase
    editable = true,
    showClear = true,
    multiline = false,
    autoCapitalize,
    tabBar = true,
    header = true,
}) {


    // VAR, STATES AND HOOKS

    // States and ref for the autocomplete and the dropdown
    const [inputValue, setInputValue] = useState("")
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const autocompleteInputRef = useRef(null)

    // Icon container width depending on the display of the clear icon
    const iconsContainerWidth = appStyle.regularHorizontalPadding + (showClear ? appStyle.inputIconSize * 3.6 : appStyle.inputIconSize * 1.8)

    // current dropdown props and id shared through context
    const { setDropdownProps, currentDropdownId, setCurrentDropdownId } = useDropdownProps()

    // Var to help set selectedItem
    const itemsAreStrings = data.length > 0 && data.every(e => typeof e === "string")
    const registerAString = itemsAreStrings || canCreate === "string"
    const titleKey = titleToSelectKey ?? "title"



    // EXTRACT LAYOUT STYLE PROPS FOR THE STYLE OF THE ITEM IN THE DROPDOWN

    const inputObjectStyle = StyleSheet.flatten(inputStyle) ?? {}

    const layoutStyleProps = new Set(["height", "minHeight", "maxHeight", "width", "minWidth", "maxWidth", "paddingLeft", "paddingRight", "paddingHorizontal", "paddingTop", "paddingBottom", "paddingVertical"])

    const layoutStyle = Object.fromEntries(
        Object.entries(inputObjectStyle).filter(
            ([key, value]) => layoutStyleProps.has(key) && value !== undefined
        )
    )



    // USEEFFECT TO CHANGE THE INPUTVALUE IF SELECTEDITEM HAS BEEN CHANGE ELSWHERE

    useEffect(() => {
        if (!selectedItem && inputValue) {
            setInputValue("")
            return
        }

        else if (selectedItem && selectedItem !== inputValue) {

            if (itemsAreStrings) {
                setInputValue(selectedItem)
                return
            }

            const selectedItemTitle = findSelectedItemTitle({ data, sectionToSelectKey, titleToSelectKey, selectedItem })

            if (selectedItemTitle && selectedItemTitle !== inputValue) setInputValue(selectedItemTitle)
        }
    }, [selectedItem, data])




    // DATA FILTERED WITH INPUT SEARCH VALUE FOR THE DROPDOWN FLATLIST

    const flatlistData = useMemo(() => {
        if (!inputValue || !editable) return data
        else {
            const inputTxtLC = inputValue.toLowerCase()
            const titleKey = titleToSelectKey ?? "title"

            return data.filter(e => itemsAreStrings ? e.toLowerCase().includes(inputTxtLC) :
                e[titleKey].toLowerCase().includes(inputTxtLC)
            )
        }
    }, [data, inputValue])

    // useEffect to change the flatlistData in the provider
    useEffect(() => {
        if (dropdownVisible) {
            setDropdownProps(prev => ({
                ...prev,
                flatlistData,
            }))
        }
    }, [flatlistData])




    // FUNCTIONS TO OPEN OR CLOSE THE DROPDOWN

    const dropdownIdRef = useRef(createId(32))
    const inputFocusRef = useRef(false)

    const closeDropdown = () => {
        if (inputFocusRef.current) autocompleteInputRef.current?.blur()
        setDropdownVisible(false)
        setDropdownProps(null)
        setCurrentDropdownId(null)
    }

    const openDropdown = () => {
        if (!inputFocusRef.current) autocompleteInputRef.current?.focus()
        setDropdownVisible(true)
        setCurrentDropdownId(dropdownIdRef.current)
        setDropdownProps({
            flatlistData,
            setSelectedItem,
            sectionToSelectKey,
            titleToSelectKey,
            closeDropdown,
            emptyResultText,
            layoutStyle,
            dropdownMaxHeight,
            dropdownContainerStyle,
            dropdownItemStyle,
            dropdownTextStyle,
            boldTitleWeight,
            dropdownLineColor,
            autocompleteInputRef,
            tabBar,
            header,
            dropdownId: dropdownIdRef.current,
        })
    }



    // CHEVRON ANIMATION
    const chevronRotation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(chevronRotation, {
            toValue: dropdownVisible ? 1 : 0,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();
    }, [dropdownVisible]);

    const rotateChevron = chevronRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "180deg"],
    });



    // USEEFFECT TO RESET DROPDOWN VISIBLE IF THE ID OF THE CURRENT DROPDOWN IS NOT THIS ONE
    useEffect(()=>{
        if (dropdownVisible && !currentDropdownId || dropdownVisible && currentDropdownId !== dropdownIdRef.current){
            setDropdownVisible(false)
        }
    },[currentDropdownId])





    return (
        <MyTextInput
            style={[inputObjectStyle, { paddingRight: iconsContainerWidth }]}
            onChangeText={(e) => {
                setInputValue(e)

                if (canCreate) {
                    registerAString ? setSelectedItem(e) :
                        setSelectedItem({ [titleKey]: e, ...(sectionToSelectKey && { [sectionToSelectKey]: e }) })
                }
            }}
            onSubmitEditing={(e) => {
                const text = e.nativeEvent.text.toLowerCase()
                const foundItem = data.find(elem => itemsAreStrings ? elem.toLowerCase() === text :
                    elem[titleKey].toLowerCase() === text)

                if (foundItem) {
                    setSelectedItem(!sectionToSelectKey ? foundItem : foundItem[sectionToSelectKey])
                } else if (canCreate) {
                    registerAString ? setSelectedItem(e.nativeEvent.text) :
                        setSelectedItem({ [titleKey]: e.nativeEvent.text, ...(sectionToSelectKey && { [sectionToSelectKey]: e.nativeEvent.text }) })
                }
            }}
            onFocus={() => {
                inputFocusRef.current = true
                !dropdownVisible && openDropdown()
            }}
            onBlur={() => {
                inputFocusRef.current = false
                dropdownVisible && closeDropdown()
            }}
            value={inputValue}
            placeholder={placeholderText}
            placeholderTextColor={placeholderColor}
            autoCapitalize={autoCapitalize}
            autoCorrect={false}
            editable={editable}
            multiline={multiline}
            inputRef={autocompleteInputRef}
        >


            {/* If non editable, pressable to open or close the dropdown */}
            {!editable && (
                <Pressable
                    style={[StyleSheet.absoluteFill, { zIndex: 1 }]}
                    onPress={() =>
                        dropdownVisible ? closeDropdown() : openDropdown()
                    }
                />
            )}



            <View style={{ ...appStyle.inputIconContainer, width: iconsContainerWidth, flexDirection: "row", zIndex: 2 }}>
                {showClear &&
                    <TouchableOpacity activeOpacity={0.6} style={[styles.iconContainer]} onPress={() => {
                        setInputValue("")
                        setSelectedItem(null)
                    }} >
                        <Feather
                            name="x-circle"
                            color={iconColor ?? placeholderColor}
                            size={appStyle.inputIconSize}
                        />
                    </TouchableOpacity>
                }

                <TouchableOpacity activeOpacity={0.6} style={styles.iconContainer} onPress={() => dropdownVisible ? closeDropdown() : openDropdown()} >
                    <Animated.View style={{ transform: [{ rotate: rotateChevron }] }}>
                        <FontAwesome5
                            name="chevron-down"
                            color={iconColor ?? placeholderColor}
                            size={appStyle.inputIconSize}
                        />
                    </Animated.View>
                </TouchableOpacity>
            </View>


        </MyTextInput>
    )
}


const styles = StyleSheet.create({
    iconContainer: {
        width: appStyle.inputIconSize * 2,
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
})