import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { toggleDarkMode, setLanguage } from '../redux/slices/uiSlice';
import { logout } from '../redux/slices/authSlice';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector(state => state.auth);
  const { darkMode, language } = useAppSelector(state => state.ui);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              LegalHub
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">{t('navbar.home')}</Link>
            <Link to="/lawyers" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">{t('navbar.lawyers')}</Link>
            <Link to="/blog" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">{t('navbar.blog')}</Link>
            <Link to="/contact" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">{t('navbar.contact')}</Link>
          </div>

          <div className="flex items-center space-x-4">
            <select 
              value={language}
              onChange={(e) => {
                dispatch(setLanguage(e.target.value));
                i18n.changeLanguage(e.target.value);
              }}
              className="px-3 py-2 rounded bg-gray-200 dark:bg-slate-800 text-gray-900 dark:text-white"
            >
              <option value="en">EN</option>
              <option value="hi">HI</option>
            </select>

            <button 
              onClick={() => dispatch(toggleDarkMode())}
              className="p-2 rounded-lg bg-gray-200 dark:bg-slate-800"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>

            {token ? (
              <>
                <Link to="/portal" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  {t('navbar.portal')}
                </Link>
                <button 
                  onClick={() => dispatch(logout())}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg">
                  {t('navbar.login')}
                </Link>
                <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  {t('navbar.register')}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
