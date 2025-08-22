import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider = ({ children }: AdminAuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedAuth = localStorage.getItem('adminAuth');
    if (storedAuth) {
      const { user: storedUser } = JSON.parse(storedAuth);
      setUser(storedUser);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    // Demo credentials
    if (email === 'admin@adminhub.com' && password === 'admin123') {
      const userData = {
        id: 1,
        email: 'admin@adminhub.com',
        name: 'Administrador',
        role: 'admin'
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', JSON.stringify({ user: userData }));
      setLoading(false);
      return true;
    }
    
    setLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        loading
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};