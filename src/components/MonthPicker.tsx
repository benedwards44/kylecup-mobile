import React, { useRef, useEffect } from "react";
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from "react-native";
import { MONTHS, MonthKey } from "../types";

interface Props {
  selected: MonthKey;
  onSelect: (month: MonthKey) => void;
}

export default function MonthPicker({ selected, onSelect }: Props) {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const index = MONTHS.findIndex((m) => m.key === selected);
    // Approximate scroll position — each pill is roughly 90px wide + 8px margin
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        x: Math.max(0, index * 98 - 120),
        animated: false,
      });
    }, 50);
  }, []);

  return (
    <View style={styles.wrapper}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {MONTHS.map((month) => (
          <TouchableOpacity
            key={month.key}
            style={[
              styles.pill,
              selected === month.key && styles.pillSelected,
            ]}
            onPress={() => onSelect(month.key)}
          >
            <Text
              style={[
                styles.pillText,
                selected === month.key && styles.pillTextSelected,
              ]}
            >
              {month.label.slice(0, 3)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e0e0e0",
  },
  container: {
    paddingHorizontal: 16,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  pillSelected: {
    backgroundColor: "#1a1a1a",
  },
  pillText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  pillTextSelected: {
    color: "#fff",
  },
});
