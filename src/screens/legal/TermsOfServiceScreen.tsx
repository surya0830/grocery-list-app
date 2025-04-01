import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Header } from '../../components/common/Header';
import { NavigationService } from '../../navigation/NavigationService';
import { Ionicons } from '@expo/vector-icons';

export const TermsOfServiceScreen: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Terms of Service"
        showBackButton
        onBackPress={() => NavigationService.goBack()}
      />

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>
            Terms of Service
          </Text>
          <Text style={[styles.lastUpdated, { color: colors.textSecondary }]}>
            Last updated: March 15, 2024
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            1. Acceptance of Terms
          </Text>
          <Text style={[styles.text, { color: colors.text }]}>
            By accessing and using the Grocery App, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use the app.
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            2. Use License
          </Text>
          <Text style={[styles.text, { color: colors.text }]}>
            Permission is granted to temporarily download one copy of the Grocery App for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </Text>
          <Text style={[styles.bulletPoint, { color: colors.text }]}>
            • Modify or copy the materials
          </Text>
          <Text style={[styles.bulletPoint, { color: colors.text }]}>
            • Use the materials for any commercial purpose
          </Text>
          <Text style={[styles.bulletPoint, { color: colors.text }]}>
            • Attempt to decompile or reverse engineer any software contained in the app
          </Text>
          <Text style={[styles.bulletPoint, { color: colors.text }]}>
            • Remove any copyright or other proprietary notations
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            3. User Accounts
          </Text>
          <Text style={[styles.text, { color: colors.text }]}>
            To use certain features of the app, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            4. Privacy Policy
          </Text>
          <Text style={[styles.text, { color: colors.text }]}>
            Your use of the Grocery App is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices.
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            5. Disclaimer
          </Text>
          <Text style={[styles.text, { color: colors.text }]}>
            The materials on the Grocery App are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            6. Limitations
          </Text>
          <Text style={[styles.text, { color: colors.text }]}>
            In no event shall we or our suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the Grocery App.
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            7. Revisions and Errata
          </Text>
          <Text style={[styles.text, { color: colors.text }]}>
            The materials appearing on the Grocery App could include technical, typographical, or photographic errors. We do not warrant that any of the materials are accurate, complete, or current. We may make changes to the materials contained on the app at any time without notice.
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            8. Contact Information
          </Text>
          <Text style={[styles.text, { color: colors.text }]}>
            If you have any questions about these Terms of Service, please contact us at support@groceryapp.com
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 14,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  bulletPoint: {
    fontSize: 16,
    lineHeight: 24,
    marginLeft: 16,
    marginBottom: 8,
  },
}); 