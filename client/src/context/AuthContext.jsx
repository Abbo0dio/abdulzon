import { createContext, useContext, useEffect, useState } from 'react';
import * as authApi from '../api/auth.js';
import * as likesApi from '../api/likes.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadLikes = async (force = false) => {
    if (!user && !force) {
      setLikes([]);
      return;
    }
    try {
      const data = await likesApi.fetchLikes();
      setLikes(data.likes);
    } catch (_err) {
      setLikes([]);
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const data = await authApi.currentUser();
        setUser(data.user);
        try {
          const likesData = await likesApi.fetchLikes();
          setLikes(likesData.likes);
        } catch (_likesErr) {
          setLikes([]);
        }
      } catch (_err) {
        setUser(null);
        setLikes([]);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const register = async (payload) => {
    setError('');
    try {
      const data = await authApi.register(payload);
      setUser(data.user);
      await loadLikes(true);
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const login = async (payload) => {
    setError('');
    try {
      const data = await authApi.login(payload);
      setUser(data.user);
      await loadLikes(true);
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    setLikes([]);
  };

  const refreshProfile = async () => {
    try {
      const data = await authApi.currentUser();
      setUser(data.user);
    } catch (err) {
      setUser(null);
      setLikes([]);
      throw err;
    }
  };

  const toggleLike = async (productId) => {
    if (!user) {
      const err = new Error('Login required to like products');
      setError(err.message);
      throw err;
    }
    try {
      const liked = likes.some((item) => item.id === productId);
      const data = liked ? await likesApi.unlikeProduct(productId) : await likesApi.likeProduct(productId);
      setLikes(data.likes);
      return data.likes;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    user,
    isAdmin: user?.role === 'admin',
    likes,
    loading,
    error,
    setError,
    register,
    login,
    logout,
    refreshProfile,
    toggleLike,
    refreshLikes: loadLikes,
    isLiked: (productId) => likes.some((item) => item.id === productId)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
