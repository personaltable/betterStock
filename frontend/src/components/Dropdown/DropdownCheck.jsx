import React, { useState, useRef, useEffect } from 'react';

const DropdownCheck = ({ options, selectedOptions, onOptionSelect, children, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionChange = (option) => {
    const newSelectedOptions = selectedOptions.includes(option)
      ? selectedOptions.filter((selected) => selected !== option)
      : [...selectedOptions, option];
    onOptionSelect(newSelectedOptions);
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
        {children}
      </div>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded shadow-lg z-10">
          <ul className="py-1">
            {options.map((option) => (
              <li key={option} className="px-4 py-1">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes(option)}
                    onChange={() => handleOptionChange(option)}
                    className="mr-2 w-4 h-4"
                  />
                  {option}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownCheck;
