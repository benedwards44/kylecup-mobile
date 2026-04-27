import { Platform } from "react-native";
import { Activity, LeaderboardEntry, MonthKey } from "./types";

// iOS simulator can't reach external URLs through VPN/network filters,
// so proxy through localhost in development on native platforms.
const BASE_URL =
  __DEV__ && Platform.OS !== "web"
    ? "http://localhost:3333/api"
    : "https://kylecup.edwards.nz/api";

export async function fetchActivities(month: MonthKey): Promise<Activity[]> {
  const response = await fetch(`${BASE_URL}/${month}/activities`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

export async function fetchLeaderboard(
  month: MonthKey
): Promise<LeaderboardEntry[]> {
  const response = await fetch(`${BASE_URL}/${month}/leaderboard`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}
