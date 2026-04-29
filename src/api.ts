import { Platform } from "react-native";
import Constants from "expo-constants";
import { Activity, LeaderboardEntry, MonthKey } from "./types";

function getBaseUrl(): string {
  if (!__DEV__ || Platform.OS === "web") {
    return "https://kylecup.edwards.nz/api";
  }
  const debuggerHost =
    Constants.expoConfig?.hostUri ?? Constants.experienceUrl ?? "";
  const host = debuggerHost.split(":")[0] || "localhost";
  return `http://${host}:3333/api`;
}

const BASE_URL = getBaseUrl();

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

export async function syncMonth(month: MonthKey): Promise<void> {
  const response = await fetch(`${BASE_URL}/${month}/sync`, {
    method: "POST",
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
}

export async function registerPushToken(token: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/push-token/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
}
