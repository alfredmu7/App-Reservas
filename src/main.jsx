import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { JobixApp } from './JobixApp'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <BrowserRouter>
      <JobixApp />
    </BrowserRouter>
  </StrictMode>
)
