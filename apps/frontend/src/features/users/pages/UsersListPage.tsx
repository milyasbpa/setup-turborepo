import { useState } from 'react';
import { Link } from 'react-router-dom';
import { routeUtils } from '@/core/router/routes';
import { useUsers } from '@/features/users/hooks/useUsers';
import { LoadingSpinner } from '@/core/layout/LoadingSpinner';

/**
 * Users List Page Component
 * Displays a list of all users with search and filtering capabilities
 */
const UsersListPage = () => {
  const { users, loading, error, refetch } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter users based on search term
  const filteredUsers = users.filter((user: any) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRetry = () => {
    refetch();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="users-list-page">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">👥 Users Management</h1>
        <p className="page-description">
          Browse and manage user accounts. Click on any user to view detailed information.
        </p>
      </div>

      {/* Search and Actions */}
      <div className="page-actions">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        
        <div className="action-buttons">
          <button onClick={handleRetry} className="refresh-button">
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="error-container">
          <div className="error-content">
            <span className="error-icon">⚠️</span>
            <div className="error-text">
              <h3>Failed to load users</h3>
              <p>{error}</p>
            </div>
            <button onClick={handleRetry} className="retry-button">
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Users Count */}
      {!error && (
        <div className="users-stats">
          <p className="stats-text">
            Showing {filteredUsers.length} of {users.length} users
            {searchTerm && (
              <span className="search-info">
                {' '}for "<strong>{searchTerm}</strong>"
              </span>
            )}
          </p>
        </div>
      )}

      {/* Users Grid */}
      {!error && filteredUsers.length > 0 && (
        <div className="users-grid">
          {filteredUsers.map((user: any) => (
            <Link
              key={user.id}
              to={routeUtils.userDetail(user.id)}
              className="user-card"
            >
              <div className="user-avatar">
                <span className="avatar-text">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              
              <div className="user-info">
                <h3 className="user-name">{user.name}</h3>
                <p className="user-email">{user.email}</p>
                <span className="user-id">ID: {user.id}</span>
              </div>
              
              <div className="card-actions">
                <span className="view-details">View Details →</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!error && !loading && filteredUsers.length === 0 && (
        <div className="empty-state">
          <div className="empty-content">
            <span className="empty-icon">👤</span>
            <h3 className="empty-title">
              {searchTerm ? 'No users found' : 'No users available'}
            </h3>
            <p className="empty-description">
              {searchTerm ? (
                <>
                  No users match your search for "<strong>{searchTerm}</strong>".
                  <br />
                  Try adjusting your search terms.
                </>
              ) : (
                'There are no users in the system yet.'
              )}
            </p>
            
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="clear-search-button"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`
        .users-list-page {
          max-width: 1000px;
          margin: 0 auto;
        }

        /* Page Header */
        .page-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .page-title {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          background: linear-gradient(45deg, #61dafb, #98d8c8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .page-description {
          color: #ccc;
          font-size: 1.1rem;
          line-height: 1.6;
        }

        /* Page Actions */
        .page-actions {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .search-container {
          position: relative;
          flex: 1;
          min-width: 300px;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          border: 2px solid rgba(97, 218, 251, 0.3);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 1rem;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .search-input::placeholder {
          color: #ccc;
        }

        .search-input:focus {
          outline: none;
          border-color: #61dafb;
          background: rgba(255, 255, 255, 0.15);
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.2rem;
          color: #61dafb;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .refresh-button {
          padding: 0.75rem 1.5rem;
          background: transparent;
          border: 2px solid #61dafb;
          color: #61dafb;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .refresh-button:hover {
          background: #61dafb;
          color: #282c34;
          transform: translateY(-1px);
        }

        /* Error Container */
        .error-container {
          background: rgba(255, 107, 107, 0.1);
          border: 1px solid rgba(255, 107, 107, 0.3);
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .error-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .error-icon {
          font-size: 2rem;
          flex-shrink: 0;
        }

        .error-text {
          flex: 1;
        }

        .error-text h3 {
          color: #ff6b6b;
          margin: 0 0 0.5rem 0;
        }

        .error-text p {
          color: #ccc;
          margin: 0;
        }

        .retry-button {
          padding: 0.5rem 1rem;
          background: #ff6b6b;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .retry-button:hover {
          background: #ff5252;
          transform: translateY(-1px);
        }

        /* Users Stats */
        .users-stats {
          margin-bottom: 1.5rem;
        }

        .stats-text {
          color: #ccc;
          font-size: 0.95rem;
          margin: 0;
        }

        .search-info {
          color: #61dafb;
        }

        /* Users Grid */
        .users-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .user-card {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(97, 218, 251, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .user-card:hover {
          transform: translateY(-4px);
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(97, 218, 251, 0.5);
        }

        .user-avatar {
          width: 60px;
          height: 60px;
          background: linear-gradient(45deg, #61dafb, #98d8c8);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }

        .avatar-text {
          font-size: 1.5rem;
          font-weight: bold;
          color: #282c34;
        }

        .user-info {
          text-align: center;
          flex: 1;
        }

        .user-name {
          font-size: 1.3rem;
          color: #61dafb;
          margin: 0 0 0.5rem 0;
        }

        .user-email {
          color: #ccc;
          margin: 0 0 0.5rem 0;
          word-break: break-word;
        }

        .user-id {
          font-size: 0.9rem;
          color: #888;
        }

        .card-actions {
          text-align: center;
          border-top: 1px solid rgba(97, 218, 251, 0.2);
          padding-top: 1rem;
        }

        .view-details {
          color: #61dafb;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .user-card:hover .view-details {
          color: #98d8c8;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 3rem 2rem;
        }

        .empty-content {
          max-width: 400px;
          margin: 0 auto;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.6;
        }

        .empty-title {
          color: #61dafb;
          margin-bottom: 1rem;
        }

        .empty-description {
          color: #ccc;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .clear-search-button {
          padding: 0.75rem 1.5rem;
          background: #61dafb;
          color: #282c34;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .clear-search-button:hover {
          background: #21a1c4;
          transform: translateY(-1px);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .page-title {
            font-size: 2rem;
          }

          .page-actions {
            flex-direction: column;
          }

          .search-container {
            min-width: auto;
          }

          .users-grid {
            grid-template-columns: 1fr;
          }

          .error-content {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default UsersListPage;
