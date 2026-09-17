import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { THEME } from '../constants/theme';
import { DayOption, getNext7Days } from '../utils/date';

interface DateSelectorProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (dateString: string) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onSelectDate,
}) => {
  const days: DayOption[] = getNext7Days();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chọn ngày đặt phòng</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {days.map((day) => {
          const isSelected = selectedDate === day.dateString;
          return (
            <TouchableOpacity
              key={day.dateString}
              style={[
                styles.dateCard,
                isSelected && styles.dateCardActive,
              ]}
              onPress={() => onSelectDate(day.dateString)}
              activeOpacity={0.75}
            >
              {day.isToday ? (
                <View style={[styles.todayBadge, isSelected && styles.todayBadgeActive]}>
                  <Text style={[styles.todayText, isSelected && styles.todayTextActive]}>
                    Hôm nay
                  </Text>
                </View>
              ) : null}

              <Text style={[styles.dayOfWeek, isSelected && styles.dayOfWeekActive]}>
                {day.dayOfWeek}
              </Text>

              <Text style={[styles.dateText, isSelected && styles.dateTextActive]}>
                {day.shortDate}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: THEME.spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.text,
    marginBottom: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.lg,
  },
  scrollContainer: {
    paddingHorizontal: THEME.spacing.lg,
    gap: 10,
  },
  dateCard: {
    width: 88,
    height: 100,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    position: 'relative',
    ...THEME.shadows.sm,
  },
  dateCardActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primaryDark,
    ...THEME.shadows.md,
  },
  todayBadge: {
    position: 'absolute',
    top: 6,
    backgroundColor: THEME.colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: THEME.borderRadius.sm,
  },
  todayBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  todayText: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  todayTextActive: {
    color: THEME.colors.textInverse,
  },
  dayOfWeek: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
    marginTop: 8,
  },
  dayOfWeekActive: {
    color: THEME.colors.textInverse,
  },
  dateText: {
    fontSize: 17,
    fontWeight: '800',
    color: THEME.colors.text,
  },
  dateTextActive: {
    color: THEME.colors.textInverse,
  },
});
