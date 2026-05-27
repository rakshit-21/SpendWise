import React from "react";
import { LayoutDashboard, Clock4, BarChart3, ArrowLeftRight, HelpCircle, ChevronLeft, ChevronRight, Wallet, LogOut } from "lucide-react";

const navLinks = [
  { link: "Dashboard", icon: LayoutDashboard },
  { link: "Activity", icon: Clock4 },
  { link: "Analytics", icon: BarChart3 },
  { link: "Transactions", icon: ArrowLeftRight },
  { link: "Support", icon: HelpCircle },
];

function Navbar({ isExpanded, setIsExpanded, activeIndex, setActiveIndex, onLogout }) {
  return (
    <div className={`h-screen flex flex-col bg-white border-r border-gray-200 relative transition-all duration-300 ease-in-out ${isExpanded ? "w-64" : "w-20"}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3 top-8 rounded-full w-7 h-7 bg-indigo-500 hover:bg-indigo-600 hidden md:flex justify-center items-center shadow-lg transition-colors duration-200 z-10"
      >
        {isExpanded ? <ChevronLeft className="w-4 h-4 text-white" /> : <ChevronRight className="w-4 h-4 text-white" />}
      </button>

      <div className="p-6 flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
          <Wallet className="w-6 h-6 text-white" />
        </div>
        {isExpanded && (
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            SpendWise
          </span>
        )}
      </div>

      <nav className="flex-1 px-3 mt-8">
        <div className="space-y-2">
          {navLinks.map((item, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeIndex === index
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200"
                  : "text-gray-600 hover:bg-gray-50"
              } ${!isExpanded && "justify-center"}`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isExpanded && <span className="font-medium text-sm">{item.link}</span>}
            </button>
          ))}
        </div>
      </nav>

      {/* Logout Button */}
      <div className="p-3 border-t border-gray-200">
        <button
          onClick={onLogout}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 ${!isExpanded && "justify-center"}`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {isExpanded && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );
}

export default Navbar;