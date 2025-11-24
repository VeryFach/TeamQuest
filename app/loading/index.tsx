import { View, ActivityIndicator, Text } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function LoadingScreen() {
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            const isLoggedIn = false;

            if (isLoggedIn) {
                router.replace("/(tabs)");
            } else {
                router.replace("/auth/login");
            }
        }, 1500);
    }, []);

    return (
        <View
            style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <ActivityIndicator size="large" />
            <Text style={{ marginTop: 16 }}>Checking session...</Text>
        </View>
    );
}
