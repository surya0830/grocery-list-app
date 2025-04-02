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

export const PrivacyPolicyScreen: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Privacy Policy"
        showBackButton
        onBackPress={() => NavigationService.goBack()}
      />

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>
            Privacy Policy
          </Text>
          <Text style={[styles.lastUpdated, { color: colors.textSecondary }]}>
            Last updated: March 15, 2024
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            1. Information We Collect
          </Text>
          <Text style={[styles.text, { color: colors.text }]}>
            We collect information that you provide directly to us, including:
          </Text>
          <Text style={[styles.bulletPoint, { color: colors.text }]}>
            • Name and contact information
          </Text>
          <Text style={[styles.bulletPoint, { color: colors.text }]}>
            • Account credentials
          </Text>
          <Text style={[styles.bulletPoint, { color: colors.text }]}>
            • Delivery addresses
          </Text>
          <Text style={[styles.bulletPoint, { color: colors.text }]}>
            • Payment information
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            2. How We Use Your Information
          </Text>
          <Text style={[styles.text, { color: colors.text }]}>
            We use the information we collect to:
          </Text>
          <Text style={[styles.bulletPoint, { color: colors.text }]}>
            • Process your orders and payments
          </Text>
          <Text style={[styles.bulletPoint, { color: colors.text }]}>
            • Send you order confirmations and updates
          </Text>
          <Text style={[styles.bulletPoint, { color: colors.text }]}>
            • Provide customer support
          </Text>
          <Text style={[styles.bulletPoint, { color: colors.text }]}>
            • Improve our services
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            3. Information Sharing
          </Text>
          <Text style={[styles.text, { color: colors.text }]}>
            We do not sell your personal information. We may share your information with:
          </Text>
          <Text style={[styles.bulletPoint, { color: colors.text }]}>
            • Service providers who assist in our operations
          </Text>
          <Text style={[styles.bulletPoint, { color: colors.text }]}>
            • Delivery partners
          </Text>
          <Text style={[styles.bulletPoint, { color: colors.text }]}>
            • Payment processors
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            4. Data Security
          </Text>
          <Text style={[styles.text, { color: colors.text }]}>
            We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            5. Your Rights
          </Text>
          <Text style={[styles.text, { color: colors.text }]}>
            You have the right to:
          </Text>
          <Text style={[styles.bulletPoint, { color: colors.text }]}>
            • Access your personal information
          </Text>
          <Text style={[styles.bulletPoint, { color: colors.text }]}>
            • Correct inaccurate information
          </Text>
          <Text style={[styles.bulletPoint, { color: colors.text }]}>
            • Request deletion of your information
          </Text>
          <Text style={[styles.bulletPoint, { color: colors.text }]}>
            • Opt-out of marketing communications
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            6. Cookies and Tracking
          </Text>
          <Text style={[styles.text, { color: colors.text }]}>
            We use cookies and similar tracking technologies to track activity on our app and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            7. Children's Privacy
          </Text>
          <Text style={[styles.text, { color: colors.text }]}>
            Our app is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us.
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            8. Changes to This Policy
          </Text>
          <Text style={[styles.text, { color: colors.text }]}>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this screen and updating the "Last updated" date.
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            9. Contact Us
          </Text>
          <Text style={[styles.text, { color: colors.text }]}>
            If you have any questions about this Privacy Policy, please contact us at privacy@groceryapp.com
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