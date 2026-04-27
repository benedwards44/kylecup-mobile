import React from "react";
import { Platform, View, Text, Image, StyleSheet } from "react-native";
import Constants from "expo-constants";
import { LeaderboardEntry } from "../types";

function proxyAvatarUri(uri: string): string {
  if (__DEV__ && Platform.OS !== "web") {
    const debuggerHost =
      Constants.expoConfig?.hostUri ?? Constants.experienceUrl ?? "";
    const host = debuggerHost.split(":")[0] || "localhost";
    return uri.replace("https://kylecup.edwards.nz", `http://${host}:3333`);
  }
  return uri;
}

interface Props {
  entries: LeaderboardEntry[];
}

export default function Leaderboard({ entries }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Leaderboard</Text>
      {entries.map((entry, index) => {
        const hasBonus = entry.total_distance !== entry.total_distance_raw;
        return (
          <View key={entry.id} style={styles.row}>
            <Text style={styles.rank}>{index + 1}</Text>
            <Image source={{ uri: proxyAvatarUri(entry.athlete_avatar) }} style={styles.avatar} />
            <View style={styles.info}>
              <Text style={styles.name}>{entry.athlete_name}</Text>
              <Text style={styles.distance}>
                {parseFloat(entry.total_distance).toFixed(1)} km
                {hasBonus && (
                  <Text style={styles.bonus}>
                    {" "}
                    ({parseFloat(entry.total_distance_raw).toFixed(1)} km actual)
                  </Text>
                )}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  rank: {
    width: 28,
    fontSize: 16,
    fontWeight: "700",
    color: "#999",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  distance: {
    fontSize: 14,
    color: "#444",
    marginTop: 2,
  },
  bonus: {
    color: "#888",
    fontSize: 13,
  },
});
