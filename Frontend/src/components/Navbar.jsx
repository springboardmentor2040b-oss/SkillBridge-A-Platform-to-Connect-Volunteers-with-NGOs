import { Link } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import { useState } from "react";

function Navbar() {
  const [show, setshow]=useState()

  function toggle(){
    setshow(!show);
  }

  return (
<<<<<<< HEAD
    <div className="w-full h-14 flex items-center justify-between bg-white px-4 lg:px-8 bg-slate-900">
=======
    <div className="w-full h-12 flex items-center justify-between text-black px-4 lg:px-8 bg-white">
>>>>>>> a45a26c (backend)
      <div className=" text-black">
        <Link to="/" className="text-lg font-bold " >SkillBridge</Link> 
      </div>
      {/* second */}
      <div className=" hidden lg:flex gap-20 ">
        <Link to="/home" className=" font-semibold " >Home </Link>
        <Link to="/about" className=" font-semibold">About </Link>
        <Link to="/opportunities" className=" font-semibold">Opportunities </Link>
        <Link to="/dashboard"className="font-semibold">Dashboard</Link>
      </div>

      {/* third */}
<div className=" hidden lg:flex items-center gap-8 ">
        <Link to="/login" className=" font-semibold " >Login </Link>
<<<<<<< HEAD
        <Link to="/signup"  className=" bg-orange-500 rounded-lg text-white px-3 py-2  font-semibold">Sign up </Link>
=======
        <Link to="/signup"  className="  rounded-lg px-3 py-1  font-semibold">Sign up </Link>
>>>>>>> a45a26c (backend)
      </div>

  {/* fourth */}
  <div className="flex lg:hidden" >
    < IoMenu className="text-lg " onClick={toggle} />
    {
        show && <div className="h-96 w-full px-8 py-2 absolute flex left-0 top-12 bg-gray-900 flex-col text-white gap-8 ">
        <Link to="/home" className=" font-semibold " >Home </Link>
        <Link to="/about" className=" font-semibold">About </Link>
        <Link to="/opportunities" className=" font-semibold">Opportunities </Link>
        <Link to="/dashboard" className="font-semibold">Dashboard</Link>
        <Link to="/login" className=" font-semibold " >Login </Link>
        <Link to="/signup"  className="  rounded-lg  py-1  font-semibold">Sign up </Link>
      
      </div>
    }     
  </div>

    </div>
  );
}

export default Navbar;
