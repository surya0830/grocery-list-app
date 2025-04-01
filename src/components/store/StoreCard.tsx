import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../common/Card';

interface Store {
  id: string;
  name: string;
  address: string;
  distance: number;
  rating: number;
  imageUrl: string;
  isOpen: boolean;
  deliveryTime: string;
  minimumOrder: number;
}

interface StoreCardProps {
  store: Store;
  onPress: () => void;
  isSelected?: boolean;
}

export const StoreCard: React.FC<StoreCardProps> = ({
  store,
  onPress,
  isSelected = false,
}) => {
  const { colors, spacing, typography } = useTheme();

  return (
    <TouchableOpacity onPress={onPress}>
      <Card
        style={[
          styles.container,
          isSelected && { borderColor: colors.primary, borderWidth: 2 },
        ]}
      >
        <View style={styles.header}>
          <Image source={{ uri: store.imageUrl }} style={styles.image} />
          <View style={styles.headerInfo}>
            <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
              {store.name}
            </Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color={colors.warning} />
              <Text style={[styles.rating, { color: colors.text }]}>
                {store.rating.toFixed(1)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.row}>
            <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
            <Text style={[styles.address, { color: colors.textSecondary }]} numberOfLines={1}>
              {store.address}
            </Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
            <Text style={[styles.deliveryTime, { color: colors.textSecondary }]}>
              {store.deliveryTime}
            </Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="car-outline" size={16} color={colors.textSecondary} />
            <Text style={[styles.distance, { color: colors.textSecondary }]}>
              {store.distance} miles away
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.minimumOrder}>
            <Text style={[styles.minimumOrderLabel, { color: colors.textSecondary }]}>
              Min. Order
            </Text>
            <Text style={[styles.minimumOrderValue, { color: colors.text }]}>
              ${store.minimumOrder.toFixed(2)}
            </Text>
          </View>
          <View style={[styles.statusContainer, { backgroundColor: store.isOpen ? colors.success : colors.error }]}>
            <Text style={styles.statusText}>
              {store.isOpen ? 'Open' : 'Closed'}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    marginLeft: 4,
  },
  details: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  address: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  deliveryTime: {
    fontSize: 14,
    marginLeft: 8,
  },
  distance: {
    fontSize: 14,
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  minimumOrder: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  minimumOrderLabel: {
    fontSize: 12,
    marginRight: 4,
  },
  minimumOrderValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
}); 