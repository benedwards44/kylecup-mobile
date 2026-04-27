import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Activity } from "../types";

interface Props {
  activities: Activity[];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleDateString("en-NZ", { month: "short" });
  const time = date.toLocaleTimeString("en-NZ", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${day} ${month}, ${time}`;
}

export default function ActivityList({ activities }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Activities</Text>
      {activities.length === 0 && (
        <Text style={styles.empty}>No activities yet this month.</Text>
      )}
      {activities.map((activity) => {
        const hasBonus = activity.distance !== activity.distance_calculated;
        return (
          <View key={activity.id} style={styles.row}>
            <View style={styles.header}>
              <Text style={styles.name}>{activity.athlete_name}</Text>
              <Text style={styles.date}>{formatDate(activity.date)}</Text>
            </View>
            <View style={styles.stats}>
              <Text style={styles.distance}>
                {parseFloat(activity.distance).toFixed(2)} km
                {hasBonus && (
                  <Text style={styles.bonus}>
                    {" "}
                    (worth {parseFloat(activity.distance_calculated).toFixed(2)}{" "}
                    km)
                  </Text>
                )}
              </Text>
              <Text style={styles.pace}>{activity.pace_display}</Text>
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
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  empty: {
    fontSize: 15,
    color: "#888",
    textAlign: "center",
    paddingVertical: 24,
  },
  row: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  date: {
    fontSize: 13,
    color: "#888",
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  distance: {
    fontSize: 14,
    color: "#444",
  },
  bonus: {
    color: "#888",
    fontSize: 13,
  },
  pace: {
    fontSize: 13,
    color: "#666",
  },
});
