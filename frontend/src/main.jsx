import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/theme.css'
import './styles/global.css'
import './styles/pages.css'
import './styles/dashboard.css'
import './styles/farmer.css'
import './styles/admin.css'
import './styles/crops.css'
import './styles/traceability.css'
import './components/auth/Auth.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
