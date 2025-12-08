import { Link } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import { useState } from "react";

function Navbar() {
  const [show, setshow]=useState()

  function toggle(){
    setshow(!show);
  }

  return (
    <div className="w-full h-14 flex items-center justify-between text-white px-4 lg:px-8 bg-slate-900">
      <div className=" text-white">
        <Link to="/" className="text-lg font-bold " >SkillBridge</Link> 
      </div>
      {/* second */}
      <div className=" hidden lg:flex gap-8 ">
        <Link to="/home" className=" font-semibold " >Home </Link>
        <Link to="/about" className=" font-semibold">About </Link>
        <Link to="/opportunities" className=" font-semibold">Opportunities </Link>
      </div>

      {/* third */}
<div className=" hidden lg:flex items-center gap-8 ">
        <Link to="/login" className=" font-semibold " >Login </Link>
        <Link to="/signup"  className=" bg-purple-900 rounded-lg px-3 py-1  font-semibold">Sign up </Link>
      </div>

  {/* fourth */}
  <div className="flex lg:hidden" >
    < IoMenu className="text-lg " onClick={toggle} />
    {
        show && <div className="h-96 w-full px-8 absolute flex left-0 top-14 bg-gray-900 flex-col text-white gap-8 ">
        <Link to="/home" className=" font-semibold " >Home </Link>
        <Link to="/about" className=" font-semibold">About </Link>
        <Link to="/opportunities" className=" font-semibold">Opportunities </Link>
        <Link to="/login" className=" font-semibold " >Login </Link>
        <Link to="/signup"  className=" bg-purple-900 rounded-lg px-3 py-1  font-semibold">Sign up </Link>
      
      </div>
    }     
  </div>

    </div>
  );
}

export default Navbar;
