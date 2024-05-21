import React from 'react'

const ContainerBody = ({ children, className = '' }) => {
    return (
        <div className={`p-5 h-80 w-[450px] bg-white text-center text-2xl shadow-lg shadow-slate-700 rounded ${className}`}>
            {children}
        </div>
    )
}

export default ContainerBody