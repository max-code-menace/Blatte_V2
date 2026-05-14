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

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!prenom.trim()) e.prenom = "Prénom requis";
    if (!nom.trim()) e.nom = "Nom requis";
    if (!telephone.trim()) e.telephone = "Téléphone requis";
    if (!email.includes("@") || !email.includes(".")) e.email = "Email invalide";
    if (password.length < 8) e.password = "Minimum 8 caractères";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSignUp() {
    if (!validate()) return;
    setLoading(true);
    setApiError("");
    const { error } = await signUp({ email, password, prenom, nom, telephone });
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
          <View className="flex-1 px-6 py-12">
            <Text className="text-white text-3xl font-bold mb-10">
              Créer un compte
            </Text>

            <TextInput
              className="bg-[#1A1A1A] text-white px-4 py-4 rounded-lg mb-1 border border-[#2A2A2A]"
              placeholder="Prénom"
              placeholderTextColor="#666"
              value={prenom}
              onChangeText={setPrenom}
            />
            {errors.prenom ? (
              <Text className="text-red-500 mb-3 text-sm">{errors.prenom}</Text>
            ) : (
              <View className="mb-3" />
            )}

            <TextInput
              className="bg-[#1A1A1A] text-white px-4 py-4 rounded-lg mb-1 border border-[#2A2A2A]"
              placeholder="Nom"
              placeholderTextColor="#666"
              value={nom}
              onChangeText={setNom}
            />
            {errors.nom ? (
              <Text className="text-red-500 mb-3 text-sm">{errors.nom}</Text>
            ) : (
              <View className="mb-3" />
            )}

            <TextInput
              className="bg-[#1A1A1A] text-white px-4 py-4 rounded-lg mb-1 border border-[#2A2A2A]"
              placeholder="Téléphone"
              placeholderTextColor="#666"
              value={telephone}
              onChangeText={setTelephone}
              keyboardType="phone-pad"
            />
            {errors.telephone ? (
              <Text className="text-red-500 mb-3 text-sm">{errors.telephone}</Text>
            ) : (
              <View className="mb-3" />
            )}

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
              onPress={handleSignUp}
              disabled={loading}
            >
              <Text className="font-bold text-black text-base">
                {loading ? "..." : "S'inscrire"}
              </Text>
            </TouchableOpacity>

            <Link href="/sign-in" asChild>
              <TouchableOpacity className="items-center">
                <Text className="text-[#FF5500] underline">
                  Déjà un compte ? Se connecter
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
