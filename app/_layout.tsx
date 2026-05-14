import "../global.css";
import { Stack } from "expo-router";
import { View, Text } from "react-native";
import { AuthProvider, useAuth } from "../lib/auth-context";

function RootNavigator() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <View
        style={{ flex: 1, backgroundColor: "#0C0C0C", alignItems: "center", justifyContent: "center" }}
      >
        <Text style={{ color: "#FFFFFF" }}>...</Text>
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
