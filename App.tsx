import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  PanResponder,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Activity, LeaderboardEntry, MONTHS, MonthKey } from "./src/types";
import { fetchActivities, fetchLeaderboard, syncMonth } from "./src/api";
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
  const [syncing, setSyncing] = useState(false);

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

  const handleSync = useCallback(async () => {
    setSyncing(true);
    try {
      await syncMonth(month);
      Alert.alert("Sync Complete", "Data has been synced successfully.");
      await loadData(true);
    } catch {
      Alert.alert("Sync Failed", "Unable to sync. Please try again.");
    } finally {
      setSyncing(false);
    }
  }, [month, loadData]);

  const monthIndex = MONTHS.findIndex((m) => m.key === month);
  const monthIndexRef = useRef(monthIndex);
  monthIndexRef.current = monthIndex;

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, { dx, dy }) =>
          Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 20,
        onPanResponderRelease: (_, { dx }) => {
          const swipeThreshold = 50;
          if (dx < -swipeThreshold && monthIndexRef.current < MONTHS.length - 1) {
            setMonth(MONTHS[monthIndexRef.current + 1].key);
          } else if (dx > swipeThreshold && monthIndexRef.current > 0) {
            setMonth(MONTHS[monthIndexRef.current - 1].key);
          }
        },
      }),
    []
  );

  const monthLabel = MONTHS[monthIndex]?.label ?? month;

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
          {...panResponder.panHandlers}
        >
          <View style={styles.monthRow}>
            <Text style={styles.monthHeading}>{monthLabel}</Text>
            <TouchableOpacity
              style={[styles.syncButton, syncing && styles.syncButtonDisabled]}
              onPress={handleSync}
              disabled={syncing}
            >
              <Text style={styles.syncButtonText}>
                {syncing ? "Syncing..." : "Sync"}
              </Text>
            </TouchableOpacity>
          </View>
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
  monthRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  monthHeading: {
    fontSize: 16,
    fontWeight: "600",
    color: "#888",
  },
  syncButton: {
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  syncButtonDisabled: {
    opacity: 0.5,
  },
  syncButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
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
