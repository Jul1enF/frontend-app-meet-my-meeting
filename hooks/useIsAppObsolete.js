import { useState, useEffect } from 'react'
import { AppState } from 'react-native'
import * as Application from 'expo-application'
import request from 'utils/request'


const isRunningVersionObsolete = (runningVersion, minimumVersion) => {
    let obsoleteBuild = false
    const runningVersionNumbers = runningVersion.split('.').map(e => Number(e))
    const minimumVersionNumbers = minimumVersion.split('.').map(e => Number(e))

    if (minimumVersionNumbers[0] > runningVersionNumbers[0]) {
        obsoleteBuild = true
    }
    else if (minimumVersionNumbers[0] == runningVersionNumbers[0]) {
        if (minimumVersionNumbers[1] > runningVersionNumbers[1]) {
            obsoleteBuild = true
        } else if (minimumVersionNumbers[1] == runningVersionNumbers[1]) {
            if (minimumVersionNumbers[2] > runningVersionNumbers[2]) {
                obsoleteBuild = true
            }
        }
    }
    return obsoleteBuild
}



export default function useIsAppObsolete() {

    const [appObsolete, setAppObsolete] = useState(false)

    const updateAppVersionStatus = async () => {
        const data = await request({ path: 'users/getAppMinimumVersion' })
        if (data) {
            const appRunningVersion = Application.nativeApplicationVersion
            
            const { appMinimumVersion } = data

           setAppObsolete(isRunningVersionObsolete(appRunningVersion, appMinimumVersion))
        }
    }

    useEffect(() => {
        updateAppVersionStatus()

        const subscription = AppState.addEventListener("change", (state) => {
            if (state === "active") {
                updateAppVersionStatus()
            }
        });

        return () => {
            subscription.remove();
        };
    }, []);

    return appObsolete
}