import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

interface User {
  id: number
  name: string
  email: string
}

interface ApiResponse {
  data: User[]
  total: number
}

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [backendStatus, setBackendStatus] = useState<string>('Checking...')

  useEffect(() => {
    // Check backend health
    const checkBackendHealth = async () => {
      try {
        const response = await axios.get('/api/health')
        setBackendStatus(`✅ ${response.data.status}`)
      } catch (err) {
        setBackendStatus('❌ Backend unavailable')
      }
    }

    // Fetch users
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await axios.get<ApiResponse>('/api/users')
        setUsers(response.data.data)
        setError(null)
      } catch (err) {
        setError('Failed to fetch users')
        console.error('Error fetching users:', err)
      } finally {
        setLoading(false)
      }
    }

    checkBackendHealth()
    fetchUsers()
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 Turborepo Frontend</h1>
        <p>React + TypeScript + Vite</p>
        
        <div className="status-section">
          <h2>Backend Status</h2>
          <p>{backendStatus}</p>
        </div>

        <div className="users-section">
          <h2>Users from Backend API</h2>
          {loading && <p>Loading users...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && (
            <div className="users-list">
              {users.map(user => (
                <div key={user.id} className="user-card">
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="links-section">
          <h2>Quick Links</h2>
          <div className="links">
            <a 
              href="http://localhost:3001" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Backend API
            </a>
            <a 
              href="http://localhost:3001/api/health" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Health Check
            </a>
            <a 
              href="http://localhost:3001/api/users" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Users API
            </a>
          </div>
        </div>
      </header>
    </div>
  )
}

export default App
