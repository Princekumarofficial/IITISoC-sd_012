import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../service/firebase";

export interface AppUser {
  id?: string;
  name: string;
  email: string;
  photoURL?: string;
}

interface UserContextType {
  user: AppUser | null;
  loading: boolean;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<AppUser | null>>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  logout: () => {},
  setUser: () => {},
});

// ✅ HMR-safe named hook export
export const useUser = () => useContext(UserContext);

// ✅ HMR-safe named component export
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User already set in login page after API call
        setUser((prev) => prev);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = () => {
    signOut(auth);
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loading, logout, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
