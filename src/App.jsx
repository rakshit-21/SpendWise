import { useState } from 'react'
import NavigationBar from './components/NavigationBar'
import Dashboard from './components/Dashboard'


function App() {
   const [count, setCount] = useState(0);
  return (
    <>
    <div className='flex'>
      <NavigationBar />
      
      <main className='grow'><Dashboard /></main>
    </div>
    </>
  )
}

export default App

