import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app'
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <App/>
  </AuthProvider>,
)
