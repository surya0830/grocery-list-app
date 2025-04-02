import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface Category {
  id: string;
  name: string;
  imageUrl: string;
  itemCount: number;
}

interface CategoryListProps {
  categories: Category[];
  onCategoryPress: (categoryId: string) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  onCategoryPress,
}) => {
  const { colors, spacing, typography } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          onPress={() => onCategoryPress(category.id)}
          style={[styles.categoryCard, { backgroundColor: colors.surface }]}
        >
          <Image source={{ uri: category.imageUrl }} style={styles.categoryImage} />
          <View style={styles.categoryInfo}>
            <Text style={[styles.categoryName, { color: colors.text }]}>
              {category.name}
            </Text>
            <Text style={[styles.itemCount, { color: colors.textSecondary }]}>
              {category.itemCount} items
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryCard: {
    width: 120,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryImage: {
    width: '100%',
    height: 80,
  },
  categoryInfo: {
    padding: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemCount: {
    fontSize: 12,
  },
}); 