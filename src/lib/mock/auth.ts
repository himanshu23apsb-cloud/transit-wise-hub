import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role } from "./seed";

export interface Session {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  avatar: string;
}

interface AuthState {
  session: Session | null;
  login: (identifier: string, _password: string, role?: Role) => Session;
  register: (data: { name: string; email: string; phone: string; role: Role }) => Session;
  logout: () => void;
  updateProfile: (patch: Partial<Session>) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      login: (identifier, _password, role = "customer") => {
        const name = identifier.split("@")[0]?.replace(/[._-]/g, " ") || "Demo User";
        const s: Session = {
          id: `USR-${Date.now()}`,
          name: name.replace(/\b\w/g, (c) => c.toUpperCase()),
          email: identifier.includes("@") ? identifier : `${identifier}@demo.com`,
          phone: identifier.match(/^\+?\d/) ? identifier : "+91 90000 00000",
          role,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
        };
        set({ session: s });
        return s;
      },
      register: ({ name, email, phone, role }) => {
        const s: Session = {
          id: `USR-${Date.now()}`,
          name,
          email,
          phone,
          role,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
        };
        set({ session: s });
        return s;
      },
      logout: () => set({ session: null }),
      updateProfile: (patch) =>
        set((state) => ({ session: state.session ? { ...state.session, ...patch } : null })),
    }),
    { name: "freightly-auth" },
  ),
);

export function roleHome(_role: Role) {
  if (_role === "admin") return "/admin";
  if (_role === "driver") return "/driver";
  return "/customer";
}