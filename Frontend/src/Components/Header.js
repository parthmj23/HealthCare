import React, { useContext } from 'react';
import { ThemeContext } from '../Components/ThemeContext';

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header
      className={`p-4 flex justify-between items-center shadow-md ${
        theme === 'light' ? 'bg-primary text-white' : 'bg-gray-700 text-white'
      }`}
    >
      <h1 className="text-lg font-bold">Healthcare Management System</h1>
      <button
        onClick={toggleTheme}
        className={`py-2 px-4 rounded ${
          theme === 'light'
            ? 'bg-gray-200 text-black hover:bg-gray-300'
            : 'bg-gray-600 text-white hover:bg-gray-500'
        }`}
      >
        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
      </button>
    </header>
  );
};

export default Header;
