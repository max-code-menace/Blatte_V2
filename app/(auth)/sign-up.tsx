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

type Fields = {
  prenom: string;
  nom: string;
  telephone: string;
  email: string;
  password: string;
  raisonSociale: string;
  numeroTva: string;
};

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const [fields, setFields] = useState<Fields>({
    prenom: "",
    nom: "",
    telephone: "",
    email: "",
    password: "",
    raisonSociale: "",
    numeroTva: "",
  });
  const [errors, setErrors] = useState<Partial<Fields>>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(key: keyof Fields) {
    return (val: string) => setFields((f) => ({ ...f, [key]: val }));
  }

  function validate() {
    const e: Partial<Fields> = {};
    if (!fields.prenom.trim()) e.prenom = "Prénom requis";
    if (!fields.nom.trim()) e.nom = "Nom requis";
    if (!fields.telephone.trim()) e.telephone = "Téléphone requis";
    if (!fields.email.includes("@") || !fields.email.includes("."))
      e.email = "Email invalide";
    if (fields.password.length < 8) e.password = "Minimum 8 caractères";
    if (!fields.raisonSociale.trim()) e.raisonSociale = "Raison sociale requise";
    if (!fields.numeroTva.trim()) e.numeroTva = "Numéro de TVA requis";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSignUp() {
    if (!validate()) return;
    setLoading(true);
    setApiError("");
    const { error } = await signUp({
      email: fields.email,
      password: fields.password,
      prenom: fields.prenom,
      nom: fields.nom,
      telephone: fields.telephone,
      raisonSociale: fields.raisonSociale,
      numeroTva: fields.numeroTva,
    });
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
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-6 pt-12 pb-8">
            <Text className="text-white text-3xl font-bold mb-2">Créer un compte</Text>
            <Text style={{ color: "#666" }} className="mb-10 text-sm">
              Remplissez toutes les informations pour commencer.
            </Text>

            {/* ─── Informations personnelles ─── */}
            <SectionTitle>Informations personnelles</SectionTitle>

            <Field
              placeholder="Prénom"
              value={fields.prenom}
              onChangeText={set("prenom")}
              error={errors.prenom}
            />
            <Field
              placeholder="Nom"
              value={fields.nom}
              onChangeText={set("nom")}
              error={errors.nom}
            />
            <Field
              placeholder="Téléphone"
              value={fields.telephone}
              onChangeText={set("telephone")}
              error={errors.telephone}
              keyboardType="phone-pad"
            />

            {/* ─── Informations de connexion ─── */}
            <SectionTitle>Connexion</SectionTitle>

            <Field
              placeholder="Email"
              value={fields.email}
              onChangeText={set("email")}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Field
              placeholder="Mot de passe (minimum 8 caractères)"
              value={fields.password}
              onChangeText={set("password")}
              error={errors.password}
              secureTextEntry
            />

            {/* ─── Informations société ─── */}
            <SectionTitle>Votre société</SectionTitle>

            <Field
              placeholder="Raison sociale"
              value={fields.raisonSociale}
              onChangeText={set("raisonSociale")}
              error={errors.raisonSociale}
              autoCapitalize="words"
            />
            <Field
              placeholder="Numéro de TVA (ex: BE0123456789)"
              value={fields.numeroTva}
              onChangeText={set("numeroTva")}
              error={errors.numeroTva}
              autoCapitalize="characters"
              autoCorrect={false}
            />

            {apiError ? (
              <Text className="text-red-500 mb-4 text-sm">{apiError}</Text>
            ) : null}

            <TouchableOpacity
              className="rounded-lg py-4 items-center mb-6 mt-2"
              style={{ backgroundColor: "#FF5500" }}
              onPress={handleSignUp}
              disabled={loading}
            >
              <Text className="font-bold text-black text-base">
                {loading ? "Création en cours..." : "Créer mon compte"}
              </Text>
            </TouchableOpacity>

            <Link href="/sign-in" asChild>
              <TouchableOpacity className="items-center">
                <Text style={{ color: "#FF5500" }} className="underline">
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

function SectionTitle({ children }: { children: string }) {
  return (
    <Text style={{ color: "#FF5500" }} className="text-xs font-bold uppercase tracking-widest mb-4 mt-2">
      {children}
    </Text>
  );
}

function Field({
  placeholder,
  value,
  onChangeText,
  error,
  ...props
}: {
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  error?: string;
  [key: string]: any;
}) {
  return (
    <>
      <TextInput
        className="text-white px-4 py-4 rounded-lg mb-1"
        style={{ backgroundColor: "#1A1A1A", borderWidth: 1, borderColor: error ? "#ef4444" : "#2A2A2A" }}
        placeholder={placeholder}
        placeholderTextColor="#555"
        value={value}
        onChangeText={onChangeText}
        {...props}
      />
      {error ? (
        <Text className="text-red-500 mb-3 text-xs ml-1">{error}</Text>
      ) : (
        <View className="mb-3" />
      )}
    </>
  );
}
