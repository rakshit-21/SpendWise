import { useState } from "react"
import Navbar from "./components/NavigationBar"
import Dashboard from "./components/Dashboard"

function App() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="flex h-screen">
      <Navbar
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />

      <div className="flex-1 bg-gray-50">
        <Dashboard />
      </div>
    </div>
  )
}

export default App
