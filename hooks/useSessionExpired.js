import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { logout } from "@reducers/user";
import { deleteInformations } from "@reducers/planning";
import * as SecureStore from 'expo-secure-store';

export default function useSessionExpired(sessionExpired, setSessionExpired) {
    const router = useRouter()
    const dispatch = useDispatch()

    const logoutUser = async () => {
        setSessionExpired(false)
        router.replace("/")
        dispatch(logout())
        dispatch(deleteInformations())
        await SecureStore.deleteItemAsync("jwtToken")
    }

    useEffect(() => {
        if (sessionExpired) {
            logoutUser()
        }
    }, [sessionExpired])

}