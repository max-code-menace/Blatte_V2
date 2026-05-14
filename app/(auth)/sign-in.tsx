import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";
import { useAuth } from "../../lib/auth-context";

export default function SignInScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!email.includes("@") || !email.includes(".")) e.email = "Email invalide";
    if (password.length < 8) e.password = "Minimum 8 caractères";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSignIn() {
    if (!validate()) return;
    setLoading(true);
    setApiError("");
    const { error } = await signIn({ email, password });
    if (error) setApiError(error.message);
    setLoading(false);
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#0C0C0C" }}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-6 py-12 justify-center">
            <Text className="text-white text-3xl font-bold mb-10">Connexion</Text>

            <TextInput
              className="bg-[#1A1A1A] text-white px-4 py-4 rounded-lg mb-1 border border-[#2A2A2A]"
              placeholder="Email"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.email ? (
              <Text className="text-red-500 mb-3 text-sm">{errors.email}</Text>
            ) : (
              <View className="mb-3" />
            )}

            <TextInput
              className="bg-[#1A1A1A] text-white px-4 py-4 rounded-lg mb-1 border border-[#2A2A2A]"
              placeholder="Mot de passe"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            {errors.password ? (
              <Text className="text-red-500 mb-3 text-sm">{errors.password}</Text>
            ) : (
              <View className="mb-3" />
            )}

            {apiError ? (
              <Text className="text-red-500 mb-4 text-sm">{apiError}</Text>
            ) : null}

            <TouchableOpacity
              className="rounded-lg py-4 items-center mb-6"
              style={{ backgroundColor: "#FF5500" }}
              onPress={handleSignIn}
              disabled={loading}
            >
              <Text className="font-bold text-black text-base">
                {loading ? "..." : "Se connecter"}
              </Text>
            </TouchableOpacity>

            <Link href="/sign-up" asChild>
              <TouchableOpacity className="items-center">
                <Text className="text-[#FF5500] underline">
                  Pas encore de compte ? S'inscrire
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
