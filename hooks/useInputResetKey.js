import { useRef, useEffect, useState } from "react";
import { Platform } from "react-native";

// Hook to solve a bug => On android, if a placeholder is too large (can be because of an accessibility zoom), after entering a value and manually erasing it, the placeholder will break line and display outside of the TextInput height. This key will reset it in this case.

const createId = (length) => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('')
    let id = ""
    for (let i = 0; i < length; i++) {
        id += chars[Math.floor(Math.random() * chars.length)]
    }
    return id
}

export default function useInputResetKey(inputValue) {

    const idRef = useRef(null)

    if (idRef.current === null) idRef.current = createId(32)

    const [idCount, setIdCount] = useState(0)
    const prevValueRef = useRef("")

    useEffect(() => {
        if (Platform.OS !== "android") return;
        
        if (prevValueRef.current && !inputValue) {
            setIdCount(prev => prev + 1)
        }

        prevValueRef.current = inputValue
    }, [inputValue])

    return `${idRef.current}-${idCount}`
}