"use client";
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

const LawyersPage = () => {
  const { t } = useTranslation();
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch lawyers
    fetchLawyers();
  }, []);

  const fetchLawyers = async () => {
    try {
      const response = await fetch('/api/lawyers');
      const data = await response.json();
      setLawyers(data.data || []);
    } catch (error) {
      console.error('Error fetching lawyers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="text-4xl font-bold mb-12 text-center">{t('lawyers.title')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {lawyers.length > 0 ? (
          lawyers.map((lawyer: any) => (
            <Link 
              key={lawyer.id}
              href={`/lawyers/${lawyer.id}`}
              className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{lawyer.user?.firstName} {lawyer.user?.lastName}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{lawyer.bio}</p>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-bold">₹{lawyer.hourlyRate}/hour</span>
                  <span className="text-yellow-500">⭐ {lawyer.averageRating.toFixed(1)}</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-600">{t('lawyers.noResults')}</p>
        )}
      </div>
    </div>
  );
};

export default LawyersPage;
