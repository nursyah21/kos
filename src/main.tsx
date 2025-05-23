import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { Toaster } from 'sonner'

// @ts-ignore
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster position='top-center'/>
    <App />
  </StrictMode>,
)
