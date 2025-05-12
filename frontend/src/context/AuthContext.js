import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Create Auth Context
export const AuthContext = createContext();

// Create Custom Hook for using Auth Context
export const useAuth = () => useContext(AuthContext);

// Mock user data
const mockUsers = [
  {
    id: 1,
    email: 'test@example.com',
    password: 'password123',
    name: 'Тестовый Пользователь',
    joinDate: new Date().toISOString(),
  },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load user from localStorage on init
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (email, password) => {
    // For demo purposes, using mock data
    const foundUser = mockUsers.find(
      (u) => u.email === email && u.password === password
    );
    
    if (foundUser) {
      // Remove password before storing user
      const { password, ...userWithoutPassword } = foundUser;
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
      return true;
    }
    return false;
  };

  // Register function
  const register = (email, password, name) => {
    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email === email);
    if (existingUser) {
      return false;
    }

    // Create new user
    const newUser = {
      id: mockUsers.length + 1,
      email,
      password,
      name,
      joinDate: new Date().toISOString(),
    };

    // Add to mock database
    mockUsers.push(newUser);

    // Log in with the new user
    login(email, password);
    return true;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
