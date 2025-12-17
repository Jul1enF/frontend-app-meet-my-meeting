import { useCallback } from "react";
import { useFocusEffect } from "expo-router";

export default function useRestoreListState (refObject) {
useFocusEffect(useCallback(()=>{
    if (refObject.current){
        
    }
},[]))
}