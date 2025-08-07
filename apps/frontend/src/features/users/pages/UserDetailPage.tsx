import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/core/router/routes';
import { LoadingSpinner } from '@/core/layout/LoadingSpinner';
import { apiClient, API_ENDPOINTS } from '@/core/api/client';

interface User {
  id: number;
  name: string;
  email: string;
}

/**
 * User Detail Page Component
 * Displays detailed information about a specific user
 */
const UserDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) {
        setError('User ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await apiClient.get<User>(API_ENDPOINTS.USER_DETAIL(id));
        setUser(response.data);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError('User not found');
        } else {
          setError('Failed to fetch user details');
        }
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleGoBack = () => {
    navigate(ROUTES.USERS);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !user) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Error: {error || 'User not found'}</h2>
        <button onClick={handleGoBack}>← Back to Users</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Link to={ROUTES.USERS} style={{ color: '#61dafb', textDecoration: 'none', marginBottom: '2rem', display: 'inline-block' }}>
        ← Back to Users
      </Link>
      
      <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '2rem', borderRadius: '12px', marginBottom: '2rem' }}>
        <h1>{user.name}</h1>
        <p>{user.email}</p>
        <small>ID: {user.id}</small>
      </div>
    </div>
  );
};

export default UserDetailPage;
