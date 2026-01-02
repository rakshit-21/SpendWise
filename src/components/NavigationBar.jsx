import React, { useState } from 'react'
import Logo from "./../assets/Logo.png"
import RightArrow from "./../assets/icons/rightArrow.svg"
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

]

function NavigationBar(){
    const[activeNavIndex, setActiveNavIndex]= useState(0);
    return <div className="relative px-10 py-12 flex flex-col border border-r-2 w-1/5 h-screen">
        <div className="logo-div flex space-x-3 items-center">
            <img src={Logo}/>
            <span>Money Tracker</span>

            <div className="w-5 h-5 bg-red-400 rounded-full absolute -right-2.5 top-12 flex items-center justify-center "></div>
             
           


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
        </div>
    
}
export default NavigationBar