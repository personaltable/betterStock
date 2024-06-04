import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({ trigger, children, className = '', classNameContainer = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <div onClick={handleToggle}>
        {trigger}
      </div>
      {isOpen && (
        <div className={`absolute right-0 w-36 bg-white border border-gray-200 rounded shadow-lg z-10 ${classNameContainer}`}>
          {children}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
