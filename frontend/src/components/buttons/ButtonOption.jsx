import React from 'react'

const ButtonOption = ({ children, onClick, type = 'button', className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-32 h-8 px-2 py-1 bg-basepurple-500 hover:bg-basepurple-600 hover:shadow-md text-white text-lg rounded-md shadow transition duration-300 ease-in-out ${className}`}
    >
      {children}
    </button>
  )
}

export default ButtonOption