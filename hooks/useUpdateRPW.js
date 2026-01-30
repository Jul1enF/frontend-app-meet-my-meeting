import { AppState } from "react-native";
import {useState, useRef, useEffect} from 'react'
import { RPW, phoneDevice } from "@utils/dimensions";


export default function useUpdateRPW () {
    const [refreshRPW, setRefreshRPW] = useState(0)
    const previousRPWRef = useRef(null)

    useEffect(()=>{
        const subscription = AppState.addEventListener("change", state => {
            console.log("HERE !")
            if (phoneDevice && state === "active" && previousRPWRef.current && previousRPWRef.current !== RPW(1)){
                setRefreshRPW(prev => prev + 1)
            }
            if (previousRPWRef.current !== RPW(1)){
                previousRPWRef.current = RPW(1)
            }
        })

        return () => {
            subscription.remove()
        }
    },[])

    return refreshRPW
}