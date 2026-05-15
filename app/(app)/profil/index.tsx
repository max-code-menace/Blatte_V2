import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function ProfilScreen() {
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#0C0C0C" }}>
      <StatusBar style="light" />
      <View className="flex-1 px-6 pt-10 justify-center items-center">
        <Text className="text-white text-2xl font-bold mb-2">Mon compte</Text>
        <Text style={{ color: "#555" }} className="text-sm">À construire — profil et société</Text>
      </View>
    </SafeAreaView>
  );
}
