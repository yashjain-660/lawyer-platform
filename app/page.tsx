"use client";
import React from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in-up">
            {t('home.title')}
          </h1>
          <p className="text-xl mb-8 text-blue-100">{t('home.subtitle')}</p>
          <Link 
            href="/lawyers"
            className="inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition"
          >
            {t('home.cta')}
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose LegalHub?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg text-center">
              <div className="text-4xl mb-4">👨‍⚖️</div>
              <h3 className="text-xl font-bold mb-2">{t('home.features.expert')}</h3>
              <p className="text-gray-600 dark:text-gray-400">Access to verified and experienced legal professionals</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-2">{t('home.features.secure')}</h3>
              <p className="text-gray-600 dark:text-gray-400">Your data and consultations are completely secure and confidential</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-2">{t('home.features.affordable')}</h3>
              <p className="text-gray-600 dark:text-gray-400">Competitive pricing with transparent cost structures</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
