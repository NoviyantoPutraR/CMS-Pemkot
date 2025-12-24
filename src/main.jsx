import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// Import test utilities hanya di development
if (import.meta.env.DEV) {
  import('./utils/testSupabaseConnection.js')
  import('./utils/testNetworkConnection.js')
}

// Initialize theme from localStorage before rendering
const initializeTheme = () => {
  const stored = localStorage.getItem('theme')
  const root = document.documentElement
  
  if (stored === 'dark') {
    root.classList.add('dark')
  } else if (stored === 'light') {
    root.classList.remove('dark')
  } else {
    // Use system preference if no stored preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }
}

// Initialize theme immediately
initializeTheme()

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

