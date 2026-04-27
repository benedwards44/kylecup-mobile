import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Activity, LeaderboardEntry, MONTHS, MonthKey } from "./src/types";
import { fetchActivities, fetchLeaderboard } from "./src/api";
import MonthPicker from "./src/components/MonthPicker";
import Leaderboard from "./src/components/Leaderboard";
import ActivityList from "./src/components/ActivityList";

function getCurrentMonth(): MonthKey {
  const index = new Date().getMonth();
  return MONTHS[index].key;
}

export default function App() {
  const [month, setMonth] = useState<MonthKey>(getCurrentMonth());
  const [activities, setActivities] = useState<Activity[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      try {
        const [acts, lb] = await Promise.all([
          fetchActivities(month),
          fetchLeaderboard(month),
        ]);
        setActivities(acts);
        setLeaderboard(lb);
      } catch {
        setError("Failed to load data. Pull to retry.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [month]
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  const monthLabel = MONTHS.find((m) => m.key === month)?.label ?? month;

  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Image
          source={require("./assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <MonthPicker selected={month} onSelect={setMonth} />
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1a1a1a" />
        </View>
      ) : error ? (
        <ScrollView
          contentContainerStyle={styles.center}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadData(true)}
            />
          }
        >
          <Text style={styles.error}>{error}</Text>
        </ScrollView>
      ) : (
        <ScrollView
          style={styles.scroll}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadData(true)}
            />
          }
        >
          <Text style={styles.monthHeading}>{monthLabel}</Text>
          <Leaderboard entries={leaderboard} />
          <ActivityList activities={activities} />
        </ScrollView>
      )}
    </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 8,
  },
  logo: {
    width: 80,
    height: 80,
  },
  scroll: {
    flex: 1,
  },
  monthHeading: {
    fontSize: 16,
    fontWeight: "600",
    color: "#888",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  error: {
    fontSize: 15,
    color: "#888",
    textAlign: "center",
  },
});
