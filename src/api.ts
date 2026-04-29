import { Activity, LeaderboardEntry, MonthKey } from "./types";

function getBaseUrl(): string {
  return "https://kylecup.edwards.nz/api";
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
