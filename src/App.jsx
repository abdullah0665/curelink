import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from "./components/home"
import About from "./components/about"
import './index.css'
import MapExample from './components/map'
import OCR from './components/OCR'
import ImageUploader from './components/imageUpload'
import Login from './components/login'
import Signup from './components/signup'
import Contact from './components/contact'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={< Login />} />
        <Route path="/signup" element={< Signup />} />
        <Route path="/home" element={< Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/map" element={<MapExample />} />
        <Route path="/ocr" element={<ImageUploader />} />
      </Routes>
    </>
  )
}
export default App
