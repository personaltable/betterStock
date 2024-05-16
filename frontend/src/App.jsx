import React from 'react'
import { Outlet } from 'react-router-dom'

const App = () => {
  return (
    <>
      <h1></h1>
      <div>
        <Outlet/>
      </div>
    </>
  )
}

export default App