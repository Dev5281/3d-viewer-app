import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './setupKTX2.js'
import App from './app.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
