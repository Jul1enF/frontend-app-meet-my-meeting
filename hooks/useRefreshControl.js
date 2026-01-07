import { RefreshControl } from "react-native";
import { useState } from "react";
import { appStyle } from "@styles/appStyle";

export default function useRefreshControl(func) {

    const [isRefreshing, setIsRefreshing] = useState(false)

    const onRefresh = async () => {
        try {
            setIsRefreshing(true);
            await func(false); 
        } catch (e) {
            console.error(e);
        } finally {
            setIsRefreshing(false);
        }
    };

    return (
        <RefreshControl refreshing={isRefreshing} colors={[appStyle.strongBlack]} progressBackgroundColor={appStyle.pageBody.backgroundColor} tintColor={appStyle.strongBlack} onRefresh={onRefresh} />
    )
}