export interface Activity {
  id: number;
  display: string;
  athlete_name: string;
  pace_display: string;
  distance_calculated: string;
  distance: string;
  pace: string;
  date: string;
}

export interface LeaderboardEntry {
  id: number;
  athlete_name: string;
  athlete_avatar: string;
  total_distance: string;
  total_distance_raw: string;
}

export const MONTHS = [
  { key: "jan", label: "January" },
  { key: "feb", label: "February" },
  { key: "mar", label: "March" },
  { key: "apr", label: "April" },
  { key: "may", label: "May" },
  { key: "jun", label: "June" },
  { key: "jul", label: "July" },
  { key: "aug", label: "August" },
  { key: "sep", label: "September" },
  { key: "oct", label: "October" },
  { key: "nov", label: "November" },
  { key: "dec", label: "December" },
] as const;

export type MonthKey = (typeof MONTHS)[number]["key"];
