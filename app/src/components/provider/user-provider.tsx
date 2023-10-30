import React, { createContext, useState, useContext } from 'react';
import { UserType } from 'type';


// Định nghĩa kiểu cho context
interface UserContextType {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
}

// Tạo Context
export const UserContext = createContext<UserContextType | undefined>(undefined);

// Tạo Provider
export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Sử dụng hook để truy cập dễ dàng hơn
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
