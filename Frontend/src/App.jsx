//import { useState } from 'react'
import Navbar from './components/Navbar'
import Home from './components/Home'
import { Route, Routes, useLocation } from 'react-router-dom'
import Signup from './components/Signup'
import About from './components/About'
import Login from './components/Login'
import Opportunities from "./components/Opportunities"

import Dashboard from './components/dashboard'
import Posted_Opportunities from './components/postedopp'
import Messages from './components/Messages'
import Applications from './components/Application'

import Dashboard from "./components/Dashboard"
import Message from './components/Message'
import Footer from './components/Footer'

function App() {
  //const [count, setCount] = useState(0)
  const location = useLocation();

  const showNavbarRoutes = ['/', '/home', '/about'];

  return (
    <>
      {showNavbarRoutes.includes(location.pathname) && <Navbar/>}
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/home' element={<Home/>} />
        <Route path='/signup' element={<Signup/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/opportunities" element={<Opportunities/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/postedopp" element={<Posted_Opportunities/>}/>
        <Route path="/messages" element={<Messages/>}/>
        <Route path="/application" element={<Applications/>}/>
      </Routes>     
    <Navbar/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/home' element={<Home/>} />
      <Route path='/signup' element={<Signup/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path="/opportunities" element={<Opportunities/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/message' element={<Message/>}/>
      <Route path="/login" element={<Login/>}/>


      
    </Routes>
     
     
    </>
  )
}

export default App;
