import React from 'react'

const ButtonFilter = ({ children, onClick, type = 'button', className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-28 h-8 px-2 py-1 bg-white border border-basepurple-500 text-basepurple-500 hover:border-basepurple-600  hover:text-basepurple-600 hover:shadow-md text-lg rounded-md shadow transition duration-300 ease-in-out ${className}`}
    >
      {children}
    </button>
  )
}

export default ButtonFilter