import { Link } from 'react-router-dom';
import { ROUTES } from '@/core/router/routes';

/**
 * 404 Not Found Page Component
 * Displayed when user navigates to a route that doesn't exist
 */
const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <div className="not-found-icon">🔍</div>
        <h1 className="not-found-title">404 - Page Not Found</h1>
        <p className="not-found-message">
          Oops! The page you're looking for doesn't exist.
          <br />
          It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <div className="not-found-actions">
          <Link to={ROUTES.HOME} className="home-button">
            🏠 Go Home
          </Link>
          <Link to={ROUTES.USERS} className="users-button">
            👥 Browse Users
          </Link>
        </div>

        <div className="helpful-links">
          <h3>Popular Pages:</h3>
          <ul>
            <li><Link to={ROUTES.HOME}>Home</Link></li>
            <li><Link to={ROUTES.USERS}>Users List</Link></li>
          </ul>
        </div>
      </div>

      <style>{`
        .not-found-page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          padding: 2rem;
        }

        .not-found-content {
          text-align: center;
          max-width: 600px;
          background: rgba(255, 255, 255, 0.1);
          padding: 3rem;
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }

        .not-found-icon {
          font-size: 5rem;
          margin-bottom: 1rem;
          opacity: 0.8;
        }

        .not-found-title {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: #61dafb;
          background: linear-gradient(45deg, #61dafb, #98d8c8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .not-found-message {
          font-size: 1.1rem;
          margin-bottom: 2.5rem;
          color: #ccc;
          line-height: 1.6;
        }

        .not-found-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .home-button,
        .users-button {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .home-button {
          background: #61dafb;
          color: #282c34;
        }

        .home-button:hover {
          background: #21a1c4;
          transform: translateY(-2px);
        }

        .users-button {
          background: transparent;
          color: #61dafb;
          border: 2px solid #61dafb;
        }

        .users-button:hover {
          background: #61dafb;
          color: #282c34;
          transform: translateY(-2px);
        }

        .helpful-links {
          border-top: 1px solid rgba(97, 218, 251, 0.2);
          padding-top: 2rem;
          margin-top: 2rem;
        }

        .helpful-links h3 {
          color: #61dafb;
          margin-bottom: 1rem;
          font-size: 1.2rem;
        }

        .helpful-links ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          justify-content: center;
          gap: 2rem;
        }

        .helpful-links li {
          margin: 0;
        }

        .helpful-links a {
          color: #ccc;
          text-decoration: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          transition: all 0.3s ease;
        }

        .helpful-links a:hover {
          color: #61dafb;
          background: rgba(97, 218, 251, 0.1);
        }

        @media (max-width: 768px) {
          .not-found-content {
            padding: 2rem;
            margin: 1rem;
          }

          .not-found-title {
            font-size: 2rem;
          }

          .not-found-icon {
            font-size: 4rem;
          }

          .not-found-actions {
            flex-direction: column;
            align-items: center;
          }

          .home-button,
          .users-button {
            width: 100%;
            max-width: 250px;
            justify-content: center;
          }

          .helpful-links ul {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;
