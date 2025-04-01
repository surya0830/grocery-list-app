import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

interface TabItem {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}

interface BottomBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (tabName: string) => void;
  style?: ViewStyle;
}

export const BottomBar: React.FC<BottomBarProps> = ({
  tabs,
  activeTab,
  onTabPress,
  style,
}) => {
  const { colors, spacing, typography } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }, style]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.name}
          onPress={() => onTabPress(tab.name)}
          style={styles.tab}
        >
          <Ionicons
            name={tab.icon}
            size={24}
            color={activeTab === tab.name ? colors.primary : colors.textSecondary}
          />
          <Text
            style={[
              styles.label,
              {
                color: activeTab === tab.name ? colors.primary : colors.textSecondary,
              },
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
}); 