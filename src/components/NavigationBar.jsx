import React, { useState } from 'react'
import Logo from "./../assets/Logo.png"
import RightArrow from "./../assets/icons/rightArrow.svg"
import {motion} from "framer-motion"
import {
    LayoutDashboard,
    Clock3,
    BarChart2,
    ArrowRightLeft,
    HelpCircleIcon
} from "lucide-react"



const navLinks=[
    {
        name: "Dashboard",
        icon: LayoutDashboard
    },
    {
        name: "Activity",
        icon: Clock3
    },
    {
        name: "Analytics",
        icon: BarChart2
    },
    {
        name: "Transactions",
        icon: ArrowRightLeft
    },
    {
        name: "Help Center",
        icon: HelpCircleIcon
    }

];

const variants = {
  expanded: { x: 0 },
  nonExpanded: { x: "-75%" }
}


function NavigationBar(){
    const[activeNavIndex, setActiveNavIndex]= useState(0);
    const[isExpanded, setIsExpanded]= useState(true);
    return(
   <motion.div
  variants={variants}
  initial="expanded"
  animate={isExpanded ? "expanded" : "nonExpanded"}
  transition={{ duration: 0.3, ease: "easeInOut" }}
  className="relative w-64 px-10 py-12 flex flex-col border-r h-screen overflow-hidden bg-white"
>


        <div className="logo-div flex space-x-3 items-center">
            <img src={Logo}/>
            <span>Money Tracker</span>
            

            <motion.div onClick={()=>setIsExpanded(!isExpanded)} 
             animate={{ rotate: isExpanded ? 0 : 180 }}
  transition={{ duration: 0.3 }}
            className="w-5 h-5 bg-red-400 rounded-full absolute -right-2.5 top-12 flex items-center justify-center">
  <img src={RightArrow} alt="Arrow" className="w-3 h-3" />
</motion.div>

             
           


            </div>
            <div className='mt-9 flex flex-col space-y-8'>
                {navLinks.map((item, index) => {
  return (
    <div
      key={index}
      onClick={() => setActiveNavIndex(index)}
       className={
      'flex space-x-3 p-2 rounded cursor-pointer ' +
      (activeNavIndex === index
        ? 'bg-red-400 text-white font-semibold'
        : 'hover:bg-gray-100')
    }
    >
      <item.icon />
      <span>{item.name}</span>
    </div>
  )
})}

        </div>
        </motion.div>
    )
    
}
export default NavigationBar