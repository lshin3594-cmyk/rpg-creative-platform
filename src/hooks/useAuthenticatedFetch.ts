import { useAuth } from '@/contexts/AuthContext';

export const useAuthenticatedFetch = () => {
  const { user, token } = useAuth();

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    if (user && token) {
      headers['X-User-Id'] = user.id.toString();
      headers['X-Auth-Token'] = token;
    }

    return fetch(url, {
      ...options,
      headers,
    });
  };

  return { fetchWithAuth, user, isAuthenticated: !!user };
};
