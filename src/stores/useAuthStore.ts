import { create } from 'zustand';
import { getUser, removeUser, saveUser } from '../services/storage';
import { UserProfile } from '../types/user';

export const DEFAULT_STUDENT: UserProfile = {
  id: 'sv-23it110',
  name: 'Nguyễn Thị Huyền',
  studentId: '23IT110',
  email: 'huyennt.23it@vku.udn.vn',
  major: 'Kỹ thuật Phần mềm',
  classGroup: '23SE1 - VKU',
  avatarUrl: '',
};

interface AuthState {
  currentUser: UserProfile | null;
  isLoading: boolean;
  loadSession: () => Promise<void>;
  logout: () => Promise<void>;
  login: (user?: UserProfile) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: DEFAULT_STUDENT,
  isLoading: false,

  loadSession: async () => {
    set({ isLoading: true });
    try {
      // Luôn ghi đè thông tin sinh viên mới nhất vào AsyncStorage để đảm bảo đồng bộ
      await saveUser(DEFAULT_STUDENT);
      set({ currentUser: DEFAULT_STUDENT, isLoading: false });
    } catch (error) {
      console.warn('Lỗi khi tải phiên đăng nhập:', error);
      set({ currentUser: DEFAULT_STUDENT, isLoading: false });
    }
  },

  logout: async () => {
    await removeUser();
    set({ currentUser: null });
  },

  login: async (user = DEFAULT_STUDENT) => {
    await saveUser(user);
    set({ currentUser: user });
  },
}));
