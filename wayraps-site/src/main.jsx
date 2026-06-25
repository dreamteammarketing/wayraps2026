import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import GeminiDeluxe from './GeminiDeluxe.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/gemini-deluxe" element={<GeminiDeluxe />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
