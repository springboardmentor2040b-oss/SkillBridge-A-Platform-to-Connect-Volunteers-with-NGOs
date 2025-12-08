import { useState } from 'react'
import Navbar from './components/Navbar'
import Home from './components/Home'
import { Route, Routes } from 'react-router-dom'
import Signup from './components/Signup'
import About from './components/About'
import Login from './components/Login'
import Opportunities from "./components/Opportunities"
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Navbar/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/home' element={<Home/>} />
      <Route path='/signup' element={<Signup/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path="/opportunities" element={<Opportunities/>}/>
      <Route path="/login" element={<Login/>}/>
      
    </Routes>
     
     
    </>
  )
}

export default App;
