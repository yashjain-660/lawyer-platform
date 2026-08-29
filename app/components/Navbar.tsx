"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useUIStore, useAuthStore } from '../lib/store';
import { useTranslation } from 'react-i18next';




const Navbar = () => {
  const { t, i18n } = useTranslation();
  
  const { user, token, logout } = useAuthStore();
  const { darkMode, language, toggleDarkMode, setLanguage } = useUIStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              LegalHub
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">{t('navbar.home')}</Link>
            <Link href="/lawyers" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">{t('navbar.lawyers')}</Link>
            <Link href="/blog" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">{t('navbar.blog')}</Link>
            <Link href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">{t('navbar.contact')}</Link>
          </div>

          <div className="flex items-center space-x-4">
            <select 
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                i18n.changeLanguage(e.target.value);
              }}
              className="px-3 py-2 rounded bg-gray-200 dark:bg-slate-800 text-gray-900 dark:text-white"
            >
              <option value="en">EN</option>
              <option value="hi">HI</option>
            </select>

            <button 
              onClick={() => toggleDarkMode()}
              className="p-2 rounded-lg bg-gray-200 dark:bg-slate-800"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>

            {token ? (
              <>
                <Link href="/portal" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  {t('navbar.portal')}
                </Link>
                <button 
                  onClick={() => logout()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg">
                  {t('navbar.login')}
                </Link>
                <Link href="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
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
