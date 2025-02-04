import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './index.css'
import Indeed from './components/indeed'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={< Indeed />} />
       
      </Routes>
    </>
  )
}
export default App
