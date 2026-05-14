import { View, Text } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center" style={{ backgroundColor: "#0C0C0C" }}>
      <Text
        className="font-bold"
        style={{ color: "#FF5500", fontSize: 64, fontWeight: "900" }}
      >
        Hello Blatte
      </Text>
    </View>
  );
}
