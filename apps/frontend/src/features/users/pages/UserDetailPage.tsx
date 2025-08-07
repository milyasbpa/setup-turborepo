import { useParams, Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/core/router/routes';
import { LoadingSpinner } from '@/core/layout/LoadingSpinner';
import { useUser } from '@/features/users/hooks/useUsers';

/**
 * User Detail Page Component
 * Displays detailed information about a specific user
 */
const UserDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { 
    data: user, 
    isLoading, 
    error,
    refetch 
  } = useUser(id || '', {
    enabled: !!id, // Only run query if ID exists
  });

  const handleGoBack = () => {
    navigate(ROUTES.USERS);
  };

  const handleRetry = () => {
    refetch();
  };

  if (!id) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h2>❌ Invalid User ID</h2>
          <p>The user ID provided is not valid.</p>
          <button onClick={handleGoBack} className="back-button">
            ← Back to Users
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !user) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h2>⚠️ {error instanceof Error && error.message.includes('404') ? 'User Not Found' : 'Failed to Load User'}</h2>
          <p>
            {error instanceof Error && error.message.includes('404') 
              ? `No user found with ID: ${id}`
              : 'An error occurred while fetching user details. Please try again.'
            }
          </p>
          <div className="error-actions">
            <button onClick={handleRetry} className="retry-button">
              🔄 Try Again
            </button>
            <button onClick={handleGoBack} className="back-button">
              ← Back to Users
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-detail-page">
      {/* Navigation */}
      <div className="page-navigation">
        <Link to={ROUTES.USERS} className="back-link">
          ← Back to Users
        </Link>
      </div>
      
      {/* User Header */}
      <div className="user-header">
        <div className="user-avatar-large">
          <span className="avatar-text-large">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="user-title">
          <h1 className="user-name">{user.name}</h1>
          {user.username && (
            <p className="user-username">@{user.username}</p>
          )}
          <p className="user-id">ID: {user.id}</p>
        </div>
      </div>

      {/* User Details Grid */}
      <div className="user-details-grid">
        {/* Contact Information */}
        <div className="detail-card">
          <h3 className="card-title">📧 Contact Information</h3>
          <div className="detail-item">
            <label>Email:</label>
            <span>{user.email}</span>
          </div>
          {user.phone && (
            <div className="detail-item">
              <label>Phone:</label>
              <span>{user.phone}</span>
            </div>
          )}
          {user.website && (
            <div className="detail-item">
              <label>Website:</label>
              <a href={`https://${user.website}`} target="_blank" rel="noopener noreferrer" className="external-link">
                {user.website}
              </a>
            </div>
          )}
        </div>

        {/* Address Information */}
        {user.address && (
          <div className="detail-card">
            <h3 className="card-title">🏠 Address</h3>
            <div className="detail-item">
              <label>Street:</label>
              <span>{user.address.street}</span>
            </div>
            <div className="detail-item">
              <label>City:</label>
              <span>{user.address.city}</span>
            </div>
            <div className="detail-item">
              <label>Zip Code:</label>
              <span>{user.address.zipcode}</span>
            </div>
          </div>
        )}

        {/* Company Information */}
        {user.company && (
          <div className="detail-card">
            <h3 className="card-title">🏢 Company</h3>
            <div className="detail-item">
              <label>Company Name:</label>
              <span>{user.company.name}</span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .user-detail-page {
          max-width: 1000px;
          margin: 0 auto;
          padding: 1rem;
        }

        /* Navigation */
        .page-navigation {
          margin-bottom: 2rem;
        }

        .back-link {
          color: #61dafb;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .back-link:hover {
          color: #98d8c8;
        }

        /* Error Container */
        .error-container {
          max-width: 600px;
          margin: 2rem auto;
          padding: 2rem;
          text-align: center;
        }

        .error-content {
          background: rgba(255, 107, 107, 0.1);
          border: 1px solid rgba(255, 107, 107, 0.3);
          border-radius: 12px;
          padding: 2rem;
        }

        .error-content h2 {
          color: #ff6b6b;
          margin-bottom: 1rem;
        }

        .error-content p {
          color: #ccc;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .error-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .retry-button, .back-button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }

        .retry-button {
          background: #ff6b6b;
          color: white;
        }

        .retry-button:hover {
          background: #ff5252;
          transform: translateY(-1px);
        }

        .back-button {
          background: transparent;
          border: 2px solid #61dafb;
          color: #61dafb;
        }

        .back-button:hover {
          background: #61dafb;
          color: #282c34;
          transform: translateY(-1px);
        }

        /* User Header */
        .user-header {
          display: flex;
          align-items: center;
          gap: 2rem;
          background: rgba(255, 255, 255, 0.1);
          padding: 2rem;
          border-radius: 16px;
          margin-bottom: 2rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(97, 218, 251, 0.3);
        }

        .user-avatar-large {
          width: 120px;
          height: 120px;
          background: linear-gradient(45deg, #61dafb, #98d8c8);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .avatar-text-large {
          font-size: 3rem;
          font-weight: bold;
          color: #282c34;
        }

        .user-title {
          flex: 1;
        }

        .user-name {
          font-size: 2.5rem;
          color: #61dafb;
          margin: 0 0 0.5rem 0;
        }

        .user-username {
          font-size: 1.2rem;
          color: #98d8c8;
          margin: 0 0 0.5rem 0;
          font-style: italic;
        }

        .user-id {
          color: #888;
          margin: 0;
          font-size: 1rem;
        }

        /* Details Grid */
        .user-details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .detail-card {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(97, 218, 251, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
          backdrop-filter: blur(10px);
        }

        .card-title {
          color: #61dafb;
          margin: 0 0 1.5rem 0;
          font-size: 1.3rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(97, 218, 251, 0.2);
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .detail-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }

        .detail-item label {
          font-weight: 600;
          color: #ccc;
          flex-shrink: 0;
          margin-right: 1rem;
        }

        .detail-item span {
          color: white;
          text-align: right;
          word-break: break-word;
        }

        .external-link {
          color: #61dafb;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .external-link:hover {
          color: #98d8c8;
          text-decoration: underline;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .user-header {
            flex-direction: column;
            text-align: center;
          }

          .user-avatar-large {
            width: 100px;
            height: 100px;
          }

          .avatar-text-large {
            font-size: 2.5rem;
          }

          .user-name {
            font-size: 2rem;
          }

          .user-details-grid {
            grid-template-columns: 1fr;
          }

          .detail-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .detail-item span {
            text-align: left;
          }

          .error-actions {
            flex-direction: column;
            align-items: center;
          }

          .retry-button, .back-button {
            width: 100%;
            max-width: 200px;
          }
        }
      `}</style>
    </div>
  );
};

export default UserDetailPage;
