import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { THEME } from '../constants/theme';
import { DEFAULT_STUDENT, useAuthStore } from '../stores/useAuthStore';

const localAvatar = require('../../assets/avatar.jpg');

export const ProfileScreen: React.FC = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);
  const login = useAuthStore((state) => state.login);

  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleLogout = async () => {
    setLogoutModalVisible(false);
    await logout();
    Alert.alert('Đăng xuất thành công', 'Bạn đã đăng xuất khỏi phiên làm việc.');
  };

  const handleReLogin = async () => {
    await login(DEFAULT_STUDENT);
    Alert.alert('Đăng nhập thành công', 'Chào mừng bạn quay lại hệ thống đặt phòng VKU!');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.surface} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tài khoản sinh viên</Text>
        <Text style={styles.headerSubtitle}>Thông tin cá nhân & phân quyền sinh viên VKU</Text>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {currentUser ? (
          <>
            {/* Thẻ sinh viên điện tử VKU */}
            <View style={styles.studentCard}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.schoolTitle}>ĐẠI HỌC CNTT & TRUYỀN THÔNG VIỆT - HÀN</Text>
                  <Text style={styles.cardType}>THẺ SINH VIÊN</Text>
                </View>
                <View style={styles.vkuLogo}>
                  <Text style={styles.vkuLogoText}>VKU</Text>
                </View>
              </View>

              <View style={styles.cardBody}>
                <Image
                  source={localAvatar}
                  style={styles.avatar}
                />
                <View style={styles.studentDetails}>
                  <Text style={styles.studentName}>{currentUser.name}</Text>
                  <Text style={styles.studentMssv}>MSSV: {currentUser.studentId}</Text>
                  <Text style={styles.studentMajor}>{currentUser.major}</Text>
                  <Text style={styles.studentClass}>{currentUser.classGroup}</Text>
                </View>
              </View>
            </View>

            {/* Chi tiết tài khoản */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>

              <View style={styles.infoRow}>
                <View style={styles.iconBox}>
                  <Ionicons name="person-outline" size={20} color={THEME.colors.primary} />
                </View>
                <View style={styles.infoTextGroup}>
                  <Text style={styles.infoLabel}>Họ và tên</Text>
                  <Text style={styles.infoValue}>{currentUser.name}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.iconBox}>
                  <Ionicons name="id-card-outline" size={20} color={THEME.colors.primary} />
                </View>
                <View style={styles.infoTextGroup}>
                  <Text style={styles.infoLabel}>Mã sinh viên</Text>
                  <Text style={styles.infoValue}>{currentUser.studentId}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.iconBox}>
                  <Ionicons name="mail-outline" size={20} color={THEME.colors.primary} />
                </View>
                <View style={styles.infoTextGroup}>
                  <Text style={styles.infoLabel}>Email sinh viên</Text>
                  <Text style={styles.infoValue}>{currentUser.email}</Text>
                </View>
              </View>
            </View>

            {/* Nút Đăng xuất */}
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={() => setLogoutModalVisible(true)}
              activeOpacity={0.85}
            >
              <Ionicons name="log-out-outline" size={20} color={THEME.colors.danger} />
              <Text style={styles.logoutButtonText}>Đăng xuất</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.loggedOutContainer}>
            <Ionicons name="person-circle-outline" size={80} color={THEME.colors.textMuted} />
            <Text style={styles.loggedOutTitle}>Bạn chưa đăng nhập</Text>
            <Text style={styles.loggedOutText}>
              Đăng nhập bằng tài khoản sinh viên VKU để thực hiện đặt phòng học và quản lý lịch.
            </Text>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleReLogin}
              activeOpacity={0.88}
            >
              <Text style={styles.loginButtonText}>Đăng nhập tài khoản VKU</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Thông tin ứng dụng */}
        <View style={styles.appFooter}>
          <Text style={styles.appFooterText}>Ứng dụng Đặt phòng học VKU</Text>
          <Text style={styles.appVersion}>Phiên bản 1.0.0 (Expo SDK 57)</Text>
        </View>
      </ScrollView>

      {/* Modal xác nhận đăng xuất */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={logoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.dialog}>
            <View style={styles.dialogIconCircle}>
              <Ionicons name="log-out" size={32} color={THEME.colors.danger} />
            </View>
            <Text style={styles.dialogTitle}>Đăng xuất</Text>
            <Text style={styles.dialogMessage}>
              Bạn có chắc chắn muốn đăng xuất khỏi ứng dụng đặt phòng VKU không?
            </Text>

            <View style={styles.dialogButtonsRow}>
              <TouchableOpacity
                style={styles.dialogCancelBtn}
                onPress={() => setLogoutModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.dialogCancelText}>Quay lại</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dialogConfirmBtn}
                onPress={handleLogout}
                activeOpacity={0.8}
              >
                <Text style={styles.dialogConfirmText}>Đăng xuất</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.md,
    paddingBottom: THEME.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: THEME.colors.text,
  },
  headerSubtitle: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  container: {
    flex: 1,
    padding: THEME.spacing.lg,
  },
  studentCard: {
    backgroundColor: THEME.colors.secondary,
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.xl,
    ...THEME.shadows.lg,
    marginBottom: THEME.spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: THEME.spacing.lg,
  },
  schoolTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 0.5,
  },
  cardType: {
    fontSize: 16,
    fontWeight: '900',
    color: THEME.colors.textInverse,
    letterSpacing: 1,
    marginTop: 2,
  },
  vkuLogo: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.sm,
  },
  vkuLogoText: {
    fontSize: 12,
    fontWeight: '900',
    color: THEME.colors.textInverse,
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.colors.textInverse,
  },
  studentMssv: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.accent,
    marginTop: 2,
  },
  studentMajor: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },
  studentClass: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  sectionCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadows.sm,
    marginBottom: THEME.spacing.lg,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.text,
    marginBottom: THEME.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.surfaceSecondary,
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTextGroup: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: THEME.colors.textMuted,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.colors.text,
    marginTop: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.dangerLight,
    borderWidth: 1.5,
    borderColor: THEME.colors.danger,
    paddingVertical: 14,
    borderRadius: THEME.borderRadius.md,
    gap: 8,
    marginBottom: THEME.spacing.xl,
  },
  logoutButtonText: {
    color: THEME.colors.danger,
    fontSize: 15,
    fontWeight: '700',
  },
  loggedOutContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  loggedOutTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  loggedOutText: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: THEME.borderRadius.md,
  },
  loginButtonText: {
    color: THEME.colors.textInverse,
    fontSize: 15,
    fontWeight: '700',
  },
  appFooter: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  appFooterText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textMuted,
  },
  appVersion: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  dialog: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.xl,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    ...THEME.shadows.lg,
  },
  dialogIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: THEME.colors.dangerLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing.md,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.colors.text,
    marginBottom: 6,
  },
  dialogMessage: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    marginBottom: THEME.spacing.xl,
    lineHeight: 20,
  },
  dialogButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  dialogCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: THEME.colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  dialogConfirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: THEME.colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogConfirmText: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textInverse,
  },
});
