import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useAuth } from "../../lib/auth-context";

export default function DashboardScreen() {
  const { profile, signOut } = useAuth();
  const router = useRouter();

  const heure = new Date().getHours();
  const salutation =
    heure < 12 ? "Bonjour" : heure < 18 ? "Bon après-midi" : "Bonsoir";

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#0C0C0C" }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-6 pt-10 pb-10">

          {/* ─── Header ─── */}
          <View className="mb-10">
            <Text style={{ color: "#666" }} className="text-sm mb-1">
              {salutation},
            </Text>
            <Text className="text-white text-3xl font-bold">
              {profile?.prenom} {profile?.nom}
            </Text>
          </View>

          {/* ─── Statut rapide ─── */}
          <View
            className="rounded-2xl p-5 mb-8"
            style={{ backgroundColor: "#141414", borderWidth: 1, borderColor: "#222" }}
          >
            <Text style={{ color: "#666" }} className="text-xs uppercase tracking-widest mb-4">
              En ce moment
            </Text>
            <View className="flex-row gap-6">
              <StatBlock label="Commandes en cours" value="—" />
              <View style={{ width: 1, backgroundColor: "#222" }} />
              <StatBlock label="Prochaine livraison" value="—" />
            </View>
          </View>

          {/* ─── Actions principales ─── */}
          <Text style={{ color: "#666" }} className="text-xs uppercase tracking-widest mb-4">
            Que voulez-vous faire ?
          </Text>

          <ActionCard
            title="Nouvelle commande"
            description="Parcourez le catalogue et commandez vos matériaux."
            accent
            onPress={() => router.push("/(app)/catalogue")}
          />

          <ActionCard
            title="Mes commandes"
            description="Suivez l'état de vos livraisons en cours."
            onPress={() => router.push("/(app)/commandes")}
          />

          <ActionCard
            title="Mon compte"
            description="Gérez votre profil et votre société."
            onPress={() => router.push("/(app)/profil")}
          />

          {/* ─── Déconnexion ─── */}
          <TouchableOpacity
            className="items-center mt-8"
            onPress={signOut}
          >
            <Text style={{ color: "#444" }} className="text-sm">
              Se déconnecter
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1">
      <Text className="text-white text-2xl font-bold mb-1">{value}</Text>
      <Text style={{ color: "#555" }} className="text-xs leading-4">{label}</Text>
    </View>
  );
}

function ActionCard({
  title,
  description,
  accent = false,
  onPress,
}: {
  title: string;
  description: string;
  accent?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      className="rounded-2xl p-5 mb-4"
      style={{
        backgroundColor: accent ? "#FF5500" : "#141414",
        borderWidth: accent ? 0 : 1,
        borderColor: "#222",
      }}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text
        className="text-lg font-bold mb-1"
        style={{ color: accent ? "#000" : "#fff" }}
      >
        {title}
      </Text>
      <Text
        className="text-sm leading-5"
        style={{ color: accent ? "#3a2000" : "#555" }}
      >
        {description}
      </Text>
    </TouchableOpacity>
  );
}
