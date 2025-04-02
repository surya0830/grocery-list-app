import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface Deal {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  discount: string;
  originalPrice: number;
  discountedPrice: number;
  validUntil: string;
}

interface FeaturedDealsProps {
  deals: Deal[];
  onDealPress: (dealId: string) => void;
}

export const FeaturedDeals: React.FC<FeaturedDealsProps> = ({
  deals,
  onDealPress,
}) => {
  const { colors, spacing, typography } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Featured Deals
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {deals.map((deal) => (
          <TouchableOpacity
            key={deal.id}
            onPress={() => onDealPress(deal.id)}
            style={[styles.dealCard, { backgroundColor: colors.surface }]}
          >
            <View style={styles.dealImageContainer}>
              <Image source={{ uri: deal.imageUrl }} style={styles.dealImage} />
              <View style={[styles.discountBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.discountText}>{deal.discount}</Text>
                <Text style={styles.discountText}>OFF</Text>
              </View>
            </View>
            <View style={styles.dealInfo}>
              <Text style={[styles.dealTitle, { color: colors.text }]} numberOfLines={2}>
                {deal.title}
              </Text>
              <Text style={[styles.dealDescription, { color: colors.textSecondary }]} numberOfLines={2}>
                {deal.description}
              </Text>
              <View style={styles.priceContainer}>
                <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>
                  ${deal.originalPrice.toFixed(2)}
                </Text>
                <Text style={[styles.discountedPrice, { color: colors.primary }]}>
                  ${deal.discountedPrice.toFixed(2)}
                </Text>
              </View>
              <Text style={[styles.validUntil, { color: colors.textSecondary }]}>
                Valid until {deal.validUntil}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  dealCard: {
    width: 280,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dealImageContainer: {
    position: 'relative',
    height: 160,
  },
  dealImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dealInfo: {
    padding: 12,
  },
  dealTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  dealDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  discountedPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  validUntil: {
    fontSize: 12,
  },
}); 