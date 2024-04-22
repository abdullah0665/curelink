import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from "./components/home"
import About from "./components/about"
import './index.css'
import MapExample from './components/map'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={< Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/map" element={<MapExample />} />
      </Routes>
    </>
  )
}
export default App
