import React, { useState } from 'react';

const Tooltip = ({ children, content, position = 'left', className = '' }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    let tooltipPositionClasses = '';
    if (position === 'right') {
        tooltipPositionClasses = 'left-full top-1/2 transform -translate-y-1/2 ml-2';
    } else if (position === 'left') {
        tooltipPositionClasses = 'right-full top-1/2 transform -translate-y-1/2 mr-2';
    } else if (position === 'top') {
        tooltipPositionClasses = 'left-1/2 transform -translate-x-1/2 -translate-y-full mb-2';
    } else if (position === 'bottom') {
        tooltipPositionClasses = 'left-1/2 transform -translate-x-1/2 translate-y-full mt-2';
    }

    return (
        <div className='relative flex items-center'>
            <div
                className='cursor-pointer'
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            >
                {children}
            </div>
            {showTooltip && (
                <div className={`absolute ${tooltipPositionClasses} w-64 bg-gray-800 text-white text-sm p-2 rounded-md shadow-lg ${className}`}>
                    {content}
                </div>
            )}
        </div>
    );
};

export default Tooltip;