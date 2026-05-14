import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../../lib/auth-context";

export default function HomeScreen() {
  const { profile, signOut } = useAuth();

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#0C0C0C" }}>
      <StatusBar style="light" />
      <View className="flex-1 px-6 py-12 justify-center items-center">
        <Text className="text-white text-3xl font-bold mb-10">
          Salut {profile?.prenom} 👋
        </Text>
        <TouchableOpacity
          className="rounded-lg py-4 px-8 items-center"
          style={{ backgroundColor: "#FF5500" }}
          onPress={signOut}
        >
          <Text className="font-bold text-black text-base">Se déconnecter</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
