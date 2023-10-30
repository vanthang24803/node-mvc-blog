import React, { createContext, useState, useContext } from 'react';
import { Blog } from 'type';

// Định nghĩa kiểu cho context
interface BlogContextType {
  blog: Blog[] | null;
  setBlog: React.Dispatch<React.SetStateAction<Blog[] | null>>;
}

// Tạo Context
export const BlogContext = createContext<BlogContextType | undefined>(undefined);

// Tạo Provider
export const BlogContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [blog, setBlog] = useState<Blog[] | null>([]);

  return (
    <BlogContext.Provider value={{ blog, setBlog }}>
      {children}
    </BlogContext.Provider>
  );
};

// Sử dụng hook để truy cập dễ dàng hơn
export const useBlog = (): BlogContextType => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};
