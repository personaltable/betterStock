import React from 'react'

const ContainerHeader = ({ children, className = '' }) => {
    return (
        <div className={`p-5 h-28 w-60 bg-white text-center text-2xl shadow-md shadow-slate-700 rounded ${className}`}>
            {children}
        </div>
    )
}

export default ContainerHeader
