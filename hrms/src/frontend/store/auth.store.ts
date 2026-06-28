import { create } from 'zustand';
import type { UserRole } from '../lib/permissions';

/**
 * مخزن حالة المصادقة. يحمل بيانات المستخدم الحالي ودوره، ويُستخدم في اشتقاق
 * الصلاحيات عبر التطبيق.
 */

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  displayName?: string;
  employeeId?: string;
}

interface AuthState {
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clear: () => set({ user: null }),
}));
