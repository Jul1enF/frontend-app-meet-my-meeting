import { View, StyleSheet } from "react-native";
import { useState, createContext, useContext, useRef, useMemo } from "react";
import Dropdown from "./Dropdown";
import useLayoutSpaces from "@hooks/useLayoutSpaces";


const AutocompleteContext = createContext(null)

export function AutocompleteProvider({ modalPageWrapper = false, children }) {
    const [dropdownProps, setDropdownProps] = useState(null)
    const { tabBar, header } = dropdownProps ?? {}

    // Layout informations to display the dropdown in a View that fit a screen layout
    const { freeHeight, fullHeaderHeight } = useLayoutSpaces({ tabBar, header })

    // Registration of a potential press outside the autocomplete
    const touchStartRef = useRef(null)
    const [pressEvent, setPressEvent] = useState(null)

    // Registration of the current dropdown id to share it with context to all the autocomplete
    const [currentDropdownId, setCurrentDropdownId] = useState(null)

    return (
        <AutocompleteContext.Provider value={{ setDropdownProps, currentDropdownId, setCurrentDropdownId }}>

            <View
                style={StyleSheet.absoluteFill}
                onStartShouldSetResponderCapture={(e) => {
                    if (!dropdownProps) return false

                    if (e.nativeEvent.touches?.length > 1) {
                        touchStartRef.current = null
                        return false
                    }

                    const { pageX, pageY } = e.nativeEvent
                    touchStartRef.current = { pageX, pageY }
                    return false
                }}
                onTouchMove={(e) => {
                    if (!dropdownProps || !touchStartRef.current) return

                    if (e.nativeEvent?.touches?.length > 1) {
                        touchStartRef.current = null
                        return
                    }

                    touchStartRef.current = null
                }}
                onTouchEnd={(e) => {
                    if (!dropdownProps || !touchStartRef.current) return
                    const { pageX, pageY } = e.nativeEvent
                    const { pageX: startX, pageY: startY } = touchStartRef.current

                    const dx = pageX - startX
                    const dy = pageY - startY

                    // If it is not a scroll
                    const isTap = Math.abs(dx) < 10 && Math.abs(dy) < 10

                    if (isTap) {
                        setPressEvent({ pageX, pageY })
                        touchStartRef.current = null
                    }

                }}
            >
                {children}
            </View>


            {/* View wrapping the dropdown with the disposition of a screen between header and tabBar */}

            <View style={[StyleSheet.absoluteFill, { overflow: "hidden", pointerEvents: "box-none" }, !modalPageWrapper && { height: freeHeight, top: fullHeaderHeight }]}
            >
                {dropdownProps &&

                    <Dropdown {...dropdownProps} pressEvent={pressEvent} setPressEvent={setPressEvent} />
                }
            </View>


        </AutocompleteContext.Provider>
    )
}

export function useDropdownProps() {
    return useContext(AutocompleteContext)
}