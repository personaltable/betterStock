import React from 'react'

const ButtonFilter = ({ children, onClick, type = 'button', className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`className=' w-36 h-8 bg-basepurple-500 hover:bg-basepurple-600 text-white font-semibold rounded shadow transition duration-300 ease-in-out ${className}`}
    >
      {children}
    </button>
  )
}

export default ButtonFilter