import React from 'react';

const ContainerBody = ({ children, className = '' }) => {
    return (
        <div className={`relative p-5 ml-2 mt-2 h-80 w-[450px] bg-white text-center text-2xl text-gray-900 shadow-lg rounded-lg border border-gray-300 ${className}`}>
            {children}
        </div>
    );
}

export default ContainerBody;
