import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Numerical from './numerical.jsx'
import Linear from './linear.jsx'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <div style={{display: "flex",gap: "1rem",justifyContent: "center",alignItems: "center",flexDirection: "row"}}>
        <Link to="/numerical">Numerical Methods</Link>
        <Link to="/linear">Linear Algebra</Link>
      </div>
      <Routes>
        <Route path="/numerical" element={<Numerical />} />
        <Route path="/linear" element={<Linear />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
